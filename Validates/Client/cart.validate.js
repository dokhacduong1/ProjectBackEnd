module.exports.cardCheckBodyCount = (req,res,next)=>{
    if(req.body.quantity<1){
        req.flash("error","Vui Lòng Thêm Số Lượng Lớn Hơn 1");
        res.redirect("back")
        return
    }
    next()
}
module.exports.cardCheckParamsCount = (req,res,next)=>{
    if(parseInt(req.params.quantity)<1){
        req.flash("error","Vui Lòng Thêm Số Lượng Lớn Hơn 1");
        res.redirect("back")
        return
    }

    next()
}