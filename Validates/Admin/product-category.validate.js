module.exports.createValidateError = (req,res,next)=>{
    if(!req.body.title){
        req.flash("error","Vui Lòng Nhập Tiêu Đề1");
        res.redirect("back")
        return
    }
    next()
}