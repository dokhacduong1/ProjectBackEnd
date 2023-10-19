const Account = require("../../Models/accounts.model")
const systemConfig = require("../../Config/systems")
var md5 = require('md5');
//[GET] /admin/auth/login
module.exports.getLogin = async function (req, res) {  
    const token  = req.cookies.token;
    const findAccout = await Account.findOne({token:token})
    //Nếu đã đăng nhập rồi thì chuyển lại dashboard không cho vào lại trangd đăng nhập nữa
    if(findAccout) res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    res.render("Admin/Pages/Auth/login", {
        title: "Đăng Nhập",   
    });
}


//[POST] /admin/auth/login
module.exports.postLogin = async function (req, res) {
    const email = req.body.email;
    const password  = req.body.password;
    const user = await Account.findOne({
        email:email,
        deleted:false,
        password:md5(password)
    })
    if(!user){
        req.flash("error","Tài Khoản Hoặc Mật Khẩu Không Đúng !")
        res.redirect("back");
        return
    }
    if(user.status !== "active"){
        req.flash("error","Tài Khoản Của Bạn Đã Bị Khóa !")
        res.redirect("back");
        return
    }
    res.cookie("token",user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {

    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
 }