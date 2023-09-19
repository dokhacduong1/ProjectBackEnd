const Products = require("../../Models/product.model");
const filterStatusHelpers = require("../../Helpers/filterStatus")
const searchItemHelpers = require("../../Helpers/searchItem")
const paginationHelpers = require("../../Helpers/pagination")
//[GET] /admin/trash
module.exports.index = async function (req, res) {
    //Khai báo biến find
    const find = {
        deleted: true
    }
    
    

    //Đoạn này check query URL nếu không có trả về rỗng
    const checkActive = req.query.status || "";
    const checKeyword = req.query.keyword || "";
    const checkPage = req.query.page || "";



    //Đoạn này về bộc lọc
        //Hàm này để lấy hàm filterStatus từ bên Helpers qua tác dụng để lấy trạng thái bộ lọc
    const filterStatus = filterStatusHelpers(checkActive);
        //Nếu không phải undefind hoặc rỗng thì thêm thuộc tính status
        if (checkActive) {
        find.status = checkActive
    }



    //Đoạn này về thanh search
        //Hàm này để lấy hàm searchItem từ bên Helpers qua tác dụng để lấy regex của keyword
    const searchItem = searchItemHelpers(checKeyword)
        //Nếu không phải undefind hoặc rỗng thì thêm thuộc tính title
    if (checKeyword) {
        find.title = searchItem
    }



    //Đoạn này về phân trang
        //Đếm xem bảng products có bao nhiêu sản phẩm
    const countProducts = await Products.count(find)
        //Hàm này để lấy hàm pagination từ bên Helpers qua tác dụng để lấy objectPagination
        //Chúng ta phải truyền 3 tham số
        //countProducts: Số lượng sản phẩm của bảng
        //checkPage: Page hiện tại của sản phẩm
        //limitPage: Số lượng sản phẩm cần hiển thị
    const objectPagination  =paginationHelpers(countProducts,checkPage,4)
    


    //Bắt đầu tìm kiếm trong bảng sản phẩm
    const products = await Products.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)
  
    res.render("Admin/Pages/Trash", {
        title: "Trang Quản Lý Sản Phẩm Xóa",
        products: products,
        filterStatus: filterStatus,
        keyword: checKeyword,
        objectPagination: objectPagination,
    });

}

module.exports.restore = async function (req, res){
    const id = req.params.id;
    await Products.updateOne({_id:id},{
        deleted:false,
        deleteAt:new Date
    });
    res.redirect("back");
}
module.exports.delete = async function (req, res){
    const id = req.params.id;
    await Products.deleteOne({_id:id});
    res.redirect("back");
   
}