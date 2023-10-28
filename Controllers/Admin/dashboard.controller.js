const ProductCategory = require("../../Models/product-category.model");
const Product = require("../../Models/product.model");
const Account = require("../../Models/accounts.model");
const User = require("../../Models/user.model");
const Oder = require("../../Models/order.model");
//[GET] /admin/dashboard
module.exports.index = async function (req, res) {
    const productCategory = await ProductCategory.find({ deleted: false }).select("status")
    const product = await Product.find({ deleted: false }).select("status")
    const account = await Account.find({ deleted: false }).select("status")
    const user = await User.find({ deleted: false }).select("status")
    const oder = await Oder.find({ deleted: false }).select("status")
    const statistic = {
        categoryProduct: {
            total: productCategory.length,
            active: productCategory.filter(dataFilter => dataFilter.status === "active").length,
            inactive: productCategory.filter(dataFilter => dataFilter.status === "inactive").length,
        },
        product: {
            total: product.length,
            active: product.filter(dataFilter => dataFilter.status === "active").length,
            inactive: product.filter(dataFilter => dataFilter.status === "inactive").length,
        },
        account: {
            total: account.length,
            active: account.filter(dataFilter => dataFilter.status === "active").length,
            inactive: account.filter(dataFilter => dataFilter.status === "inactive").length,
        },
        user: {
            total: user.length,
            active: user.filter(dataFilter => dataFilter.status === "active").length,
            inactive: user.filter(dataFilter => dataFilter.status === "inactive").length,
        },
        oder:{
            total: oder.length,
            active: oder.filter(dataFilter => dataFilter.status === "active").length,
            inactive: oder.filter(dataFilter => dataFilter.status === "inactive").length,
        }
    };


    //thư mục admin/pages/dashboard sẽ tạo sau
    res.render("Admin/Pages/Dashboard", {
        title: "Trang Tổng Quan",
        statistic: statistic
    });

}