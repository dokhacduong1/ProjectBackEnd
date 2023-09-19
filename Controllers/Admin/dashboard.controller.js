//[GET] /admin/dashboard
module.exports.index = function (req, res) {
    //thư mục admin/pages/dashboard sẽ tạo sau
    res.render("Admin/Pages/Dashboard", {
        title: "Trang Tổng Quan",
    });

}