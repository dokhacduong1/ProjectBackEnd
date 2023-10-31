module.exports.cardCheckCount = (req,res,next)=>{
    if(req.body.quantity<1){
        req.flash("error","Vui Lòng Thêm Số Lượng Lớn Hơn 1");
        res.redirect("back")
        return
    }
    next()
}