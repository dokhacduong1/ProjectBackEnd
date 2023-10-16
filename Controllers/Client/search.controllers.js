const searchItemHelpers = require("../../Helpers/searchItem")
const Products = require("../../Models/product.model");
const prodcutHelper = require("../../Helpers/product")
//[GET] /search
module.exports.index = async function (req, res) {
    //Khai báo biến find
    const find = {
        deleted: false,
        status:"active"
    }

    const checKeyword = req.query.keyword || "";
    //Đoạn này về thanh search
    //Hàm này để lấy hàm searchItem từ bên Helpers qua tác dụng để lấy regex của keyword
    const searchItem = searchItemHelpers(checKeyword)
    //Nếu không phải undefind hoặc rỗng thì thêm thuộc tính title
    if (checKeyword) {
        find.title = searchItem;
    }
    const products = await Products.find(find).sort({position:"desc"})

    const productsNew = prodcutHelper.priceNewProducts(products)
    res.render("Client/Pages/Search", {
        title: "Trang Tìm Kiếm",
        keyword: checKeyword,
        products:productsNew

    });

}