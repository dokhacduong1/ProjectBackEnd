module.exports.createValidateError = (req,res,next)=>{
    if(!req.body.title){
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

module.exports.editPatch = (req, res, next) => {
    if(!req.body.title) {
      req.flash("error", `Vui lòng nhập họ tên!`);
      res.redirect("back");
      return;
    }
  
    if(!req.body.email) {
      req.flash("error", `Vui lòng nhập email!`);
      res.redirect("back");
      return;
    }
  
    next();
  }