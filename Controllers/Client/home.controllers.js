const Product = require("../../Models/product.model")
const prodcutHelper = require("../../Helpers/product")
const si = require('systeminformation');
//[GET] /
module.exports.index = async function (req, res) {
    //Lấy ra sản phẩm nổi bật
    const productFeatured = await Product.find({
        deleted: false,
        featured: "1",
        status: "active"
    }).limit(4)
    const test = await si.uuid()
    console.log(test)
    const newProductsFeatured = prodcutHelper.priceNewProducts(productFeatured)

    //Lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).limit(4).sort({ position: "desc" })
    const newProductsNew = prodcutHelper.priceNewProducts(productsNew)

    //Thư mục client/pages/Home sẽ tạo sau
    // res.render("Client/Pages/Home", {
    //     title: "Trang Chủ",
    //     productsFeatured: newProductsFeatured,
    //     productsNew: newProductsNew
    // });
    res.send(test)
}