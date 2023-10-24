var md5 = require('md5');
const User = require("../../Models/user.model")
const ForgotPassword = require("../../Models/forgot-password.model");
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
      req.body.password = md5(req.body.password);
      const record = new User(req.body);
      await record.save();
      const expiresCookie = 1000 * 60 * 60 * 24 * 365;

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

  res.redirect("/");
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
    if(!email){
      req.flash("error", "Email Không Tồn Tại !")
      res.redirect("back");
      return
    }
    const objectForgotPassword = {
      email:email,
      otp:generateHelper.generateRandomNumber(8),
      expiresAt:Date.now()+300
    }
    const record = new ForgotPassword(objectForgotPassword);
    await record.save();
  } catch (error) {

  }
  res.send("ok")
}

