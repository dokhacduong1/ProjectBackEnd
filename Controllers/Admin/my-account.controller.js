const Account = require("../../Models/accounts.model")
const systemConfig = require("../../Config/systems")
var md5 = require('md5');
//[GET] /admin/my-account
module.exports.index = function (req, res) {
    //thư mục admin/pages/dashboard sẽ tạo sau
    res.render("Admin/Pages/MyAccount", {
        title: "Trang Quản Lý Tài Khoản",
    });

}

//[GET] /admin/my-account/edit
module.exports.getEdit = async function (req, res) {
    res.render("Admin/Pages/MyAccount/edit", {
        title: "Trang Chỉnh Sửa Tài Khoản Của Tôi",
    })
}

//[PATCH] /admin/my-account/edit
module.exports.patchEdit = async function (req, res) {
    const id = res.locals.user.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
    req.body.password ? req.body.password = md5(req.body.password) : delete req.body.password
    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        req.flash('error', `Email Đã Trùng Vui Lòng Nhập Lại`);
    }
    else {
        await Account.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        })
        req.flash('success', `Sửa Tài Khoản Thành Công`);
    }
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
 
}