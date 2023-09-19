//[GET] /
module.exports.index = function (req, res) {
    //Thư mục client/pages/Home sẽ tạo sau
    res.render("Client/Pages/Home",{
        title:"Trang Chủ",
       
    });
    
}