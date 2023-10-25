module.exports.registerPort = (req,res,next)=>{
    if(!req.body.fullName){
        req.flash("error","Vui Lòng Nhập Họ Tên");
        res.redirect("back")
        return
    }
    if(!req.body.email){
        req.flash("error","Vui Lòng Nhập Email");
        res.redirect("back")
        return
    }
    if(!req.body.password){
        req.flash("error","Vui Lòng Nhập Mật Khẩu");
        res.redirect("back")
        return
    }
    next()
}

module.exports.loginPort = (req,res,next)=>{
    if(!req.body.email){
        req.flash("error","Vui Lòng Nhập Email");
        res.redirect("back")
        return
    }
    next()
}


module.exports.resetPasswordPost = (req,res,next)=>{
    if(!req.body.password){
        req.flash("error","Vui Lòng Nhập Mật Khẩu");
        res.redirect("back")
        return
    }
    if(!req.body.confirmPassword){
        req.flash("error","Vui Lòng Xác Nhận Mật Khẩu");
        res.redirect("back")
        return
    }
    if(req.body.password !== req.body.confirmPassword){
        req.flash("error","Mật Khẩu Bạn Nhập Không Khớp!");
        res.redirect("back")
        return
    }
    next()
}