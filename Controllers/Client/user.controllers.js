var md5 = require('md5');
const generate = require("../../Helpers/generate")
const sendMailHelper = require("../../Helpers/sendMail")
const User = require("../../Models/user.model")
const ForgotPassword = require("../../Models/forgot-password.model");
const Cart = require("../../Models/carts.model")
const generateHelper = require('../../Helpers/generate');

//[GET] /user/register
module.exports.getRegister = async function (req, res) {
  const userCheck = res.locals.userClient
  if (userCheck) {
    res.redirect("/");
    return;
  }
  res.render("Client/Pages/User/register", {
    title: "Đăng Ký Tài Khoản",

  });
}
//[POST] /user/register
module.exports.postRegister = async function (req, res) {
  try {
    const emailExits = await User.findOne({
      email: req.body.email,
      deleted: false
    });
    if (emailExits) {
      req.flash("error", "Email Đã Tồn Tại");
    }
    else {
      const idCard = req.cookies.cartId;
      req.body.tokenUser= generate.generateRandomString(20)
      req.body.password = md5(req.body.password);
      const record = new User(req.body);
      await record.save();
      const expiresCookie = 1000 * 60 * 60 * 24 * 365;
      await Cart.updateOne({_id:idCard},{
        user_id:record.id,
        user_ip:""
      })
      res.cookie("tokenUser", record.tokenUser, {
        expires: new Date(Date.now() + expiresCookie) // cookie will be removed after 8 hours
      })


    }
  } catch (error) {

    req.flash("error", "Lỗi Rồi");
  }
 
  res.redirect(`/`);
}

//[GET] /user/Login
module.exports.getLogin = async function (req, res) {

  const userCheck = res.locals.userClient
  if (userCheck) {
    res.redirect("/");
    return;
  }
  res.render("Client/Pages/User/login", {
    title: "Đăng Nhập",

  });
}
//[GET] /user/Logout
module.exports.getLogout = async function (req, res) {
  res.clearCookie("tokenUser")
  res.clearCookie("cartId")
  res.redirect("/");
}

//[POST] /user/Login
module.exports.postLogin = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
      email: email,
      deleted: false,
      password: md5(password)
    })

    if (!user) {
      req.flash("error", "Tài Khoản Hoặc Mật Khẩu Không Đúng !")
      res.redirect("back");
      return
    }
    if (user.status !== "active") {
      req.flash("error", "Tài Khoản Của Bạn Đã Bị Khóa !")
      res.redirect("back");
      return
    }
    const expiresCookie = 1000 * 60 * 60 * 24 * 365;
    res.cookie("tokenUser", user.tokenUser, {
      expires: new Date(Date.now() + expiresCookie) // cookie will be removed after 8 hours
    })
    req.flash("success", "Đăng Nhập Thành Công !")
  } catch (error) {
    req.flash("error", "Lỗi Rồi");
  }

  res.redirect("/user/login");
}

//[GET] /user/forgot
module.exports.getForgotPassword = async function (req, res) {
  res.render("Client/Pages/User/forgot-password", {
    title: "Lấy Lại Mất Khẩu",

  });
}

//[POST] /user/forgot
module.exports.postForgotPassword = async function (req, res) {
  try {
    const email = req.body.email
    const emailExits = await User.findOne({
      email: email,
      deleted: false
    });
    //Check xem email tồn tại hay chưa
    if (!emailExits) {
      req.flash("error", "Email Không Tồn Tại !")
      res.redirect("back");
      return
    }
    const ForgotPasswordExits = await ForgotPassword.findOne({
      email: email,
    });
    //Check xem người dùng có ấn quên mật khẩu nhiều lần không nếu có rồi thì link lại trang nhập otp
    if (ForgotPasswordExits) {  
      res.redirect(`/user/password/otp?email=${email}`);
      return
    }
    //set up time để tự mất
    const expireAtOk = new Date();
    expireAtOk.setMinutes(expireAtOk.getMinutes() + 4);
   
    const objectForgotPassword = {
      email: email,
      otp: generateHelper.generateRandomNumber(6),
      expireAt: expireAtOk
    }
    const record = new ForgotPassword(objectForgotPassword);
    
    await record.save();
    const expireAt = new Date(record.expireAt);
   
    //Nếu tồn tại email thì gửi về email
    const otp = record.otp;
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Duong Shop</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Cảm ơn bạn đã sử dụng trang web của Dương. Sử dụng OTP sau để hoàn tất thủ quên mật khẩu của bạn. OTP có hiệu lực trong 5 phút <br> Tuyệt đối không chia sẻ mã này dưới mọi hình thức!</p>
    <h2 style="background: #000000;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Duong,<br />Duong Shop</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Duong Shop</p>
      <p>An Dương,Hải Phòng</p>
      <p>Việt Nam</p>
    </div>
  </div>
</div>
  `;
     sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
  } catch (error) {
    
    res.redirect("/");
  }

}

//[GET] /user/password/otp?email
module.exports.getOtp = async function (req, res) {
  const email = req.query.email;
  const emailExits = await ForgotPassword.findOne({
    email: email,
  });
  if (!emailExits) {
    res.redirect("/");
    return
  }

  res.render("Client/Pages/User/otp-password", {
    title: "Nhập Mã Otp",
    email,
  });
}
//[POST] /user/password/otp
module.exports.postOtp = async function (req, res) {
  const email = req.body.email
  const otp = req.body.otp
  const checkAuth = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });
  if (!checkAuth) {
    req.flash("error", "Mã Xác Thực Không Chính Xác !")
    res.redirect("back");
    return
  }
  const user = await User.findOne({
    email: email,
    deleted: false
  });

  res.cookie("tokenUser", user.tokenUser);
  
  res.redirect("/user/password/reset");

}
//[GET] /user/password/reset
module.exports.getResetPassword = async function (req, res) {
  res.render("Client/Pages/User/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
}
//[POST] /user/password/reset
module.exports.postResetPassword = async function (req, res) {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne({
    tokenUser: tokenUser
  }, {
    password: md5(password)
  });
  res.redirect("/");
}

//[GET] /user/info
module.exports.getInfo = async function (req, res){
 
  res.render("Client/Pages/User/info", {
    pageTitle: "Thông Tin Người Dùng",
  });
}

//[POST] /user/info
module.exports.postInfo = async function (req, res){
  const tokenUser = req.cookies.tokenUser;
  const email = req.body.email
  const emailExits = await User.findOne({
    tokenUser: { $ne: tokenUser },
    email: email,
    deleted: false
  });

  //Check xem email tồn tại hay chưa
  if (emailExits) {
    req.flash("error", "Email Đã Tồn Tại !")
    res.redirect("back");
    return
  }

  await User.updateOne({
    tokenUser: tokenUser
  }, req.body);
  res.redirect("back");
}