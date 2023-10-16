const Products = require("../../Models/product.model");
const ProductsCategory = require("../../Models/product-category.model");
const Role = require("../../Models/role.model");
const mongoose = require("mongoose")
const filterStatusHelpers = require("../../Helpers/filterStatus")
const searchItemHelpers = require("../../Helpers/searchItem")
const paginationHelpers = require("../../Helpers/pagination")
const createTree = require("../../Helpers/createTree");
const Account = require("../../Models/accounts.model");
const actionOptions = [
    {
        value: "restore",
        text: "Khôi Phục"
    },
    {
        value: "delete-all-full",
        text: "Xóa Vĩnh Viễn"
    }
]
//[GET] /admin/trash
module.exports.index = async function (req, res) {

    res.render("Admin/Pages/Trash", {
        title: "Trang Thùng Rác",

    });

}

module.exports.products = async function (req, res) {
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
    const objectPagination = paginationHelpers(countProducts, checkPage, 4)



    //Bắt đầu tìm kiếm trong bảng sản phẩm
    const records = await Products.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)

    //Lấy tên của user của user đã tạo
    for (const record of records) {
        const user = await Account.findOne({ _id: record.deletedBy.account_id})
        if (user) record.accountFullName = user.title
    }
    res.render("Admin/Pages/Trash/product", {
        title: "Trang Quản Lý Sản Phẩm Xóa",
        products: records,
        filterStatus: filterStatus,
        keyword: checKeyword,
        objectPagination: objectPagination,
        actionOptions: actionOptions
    });

}

module.exports.productsCategory = async function (req, res) {
    const sortOptions = [
        {
            value: "position-desc",
            text: "Vị trí giảm dần"
        },
        {
            value: "position-asc",
            text: "Vị trí tăng dần"
        },
        {
            value: "title-asc",
            text: "Tiêu đề A - Z"
        },
        {
            value: "title-desc",
            text: "Tiêu đề Z - A"
        },
    ]

    //Khai báo biến findx
    const find = {
        deleted: true
    }

    //Đoạn này check query URL nếu không có trả về rỗng
    const checkActive = req.query.status || "";
    const checKeyword = req.query.keyword || "";
    const checkPage = req.query.page || "";
    const sortKey = req.query.sortKey || "position";
    const sortValue = req.query.sortValue || "desc";

    //Đoạn này về bộc lọc
    //Hàm này để lấy hàm filterStatus từ bên Helpers qua tác dụng để lấy trạng thái bộ lọc
    const filterStatus = filterStatusHelpers(checkActive);
    //Nếu không phải undefind hoặc rỗng thì thêm thuộc tính status
    if (checkActive) {
        find.status = checkActive;
    }



    //Đoạn này về thanh search
    //Hàm này để lấy hàm searchItem từ bên Helpers qua tác dụng để lấy regex của keyword
    const searchItem = searchItemHelpers(checKeyword)
    //Nếu không phải undefind hoặc rỗng thì thêm thuộc tính title
    if (checKeyword) {
        find.title = searchItem;
    }



    //Đoạn này về phân trang
    //Đếm xem bảng products có bao nhiêu sản phẩm
    const countProducts = await ProductsCategory.count(find)

    //Hàm này để lấy hàm pagination từ bên Helpers qua tác dụng để lấy objectPagination
    //Chúng ta phải truyền 3 tham số
    //countProducts: Số lượng sản phẩm của bảng
    //checkPage: Page hiện tại của sản phẩm
    //limitPage: Số lượng sản phẩm cần hiển thị
    const objectPagination = paginationHelpers(countProducts, checkPage, 10)



    //Đoạn này làm về sort
    //Muốn cho một biến có giá trị thành một thuộc tính ta truyền [sortKey] vào
    const sort = {
        [sortKey]: sortValue
    }
    const sortSelect = `${sortKey}-${sortValue}`;


    const records = await ProductsCategory.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
    //Lấy tên của user của user đã tạo
    for (const record of records) {
        const user = await Account.findOne({ _id: record.deletedBy.account_id})
        if (user) record.accountFullName = user.title
    }
    //Lấy ra một cây có chưa phân cấp từng danh mục
    const tree = createTree.tree(records)

    //Render ra giao diện
    res.render("Admin/Pages/Trash/products-category", {
        title: "Trang Danh Mục",
        record: tree,
        filterStatus: filterStatus,
        keyword: checKeyword,
        objectPagination: objectPagination,
        sortSelect: sortSelect,
        sortOptions: sortOptions,
        actionOptions: actionOptions,
    });

}

module.exports.roles = async function (req,res){
    let find = {
        deleted: true
    }

    const checKeyword = req.query.keyword || "";
    const checkPage = req.query.page || "";

    //Đoạn này về thanh search
    //Hàm này để lấy hàm searchItem từ bên Helpers qua tác dụng để lấy regex của keyword
    const searchItem = searchItemHelpers(checKeyword)
    //Nếu không phải undefind hoặc rỗng thì thêm thuộc tính title
    if (checKeyword) {
        find.title = searchItem;
    }


    //Đoạn này về phân trang
    //Đếm xem bảng products có bao nhiêu sản phẩm
    const countProducts = await Role.count(find)
    //Hàm này để lấy hàm pagination từ bên Helpers qua tác dụng để lấy objectPagination
    //Chúng ta phải truyền 3 tham số
    //countProducts: Số lượng sản phẩm của bảng
    //checkPage: Page hiện tại của sản phẩm
    //limitPage: Số lượng sản phẩm cần hiển thị
    const objectPagination = paginationHelpers(countProducts, checkPage, 4)


    const records = await Role.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)

    //Lấy tên của user của user đã tạo
    for(const record of records){
        const user = await Account.findOne({ _id:record.createdBy.account_id })
        if(user) record.accountFullName = user.title    
    }
    //Lấy tên của user của user đã tạo
    for (const record of records) {
        const user = await Account.findOne({ _id: record.deletedBy.account_id})
        if (user) record.accountFullName = user.title
    }
    res.render("Admin/Pages/Trash/roles", {
        title: "Trang Thùng Rác Nhóm Quyền",
        records: records,
        keyword: checKeyword,
        objectPagination: objectPagination,
        actionOptions: actionOptions
    });
}


module.exports.restore = async function (req, res) {
    const id = req.params.id;
    let collectionName = req.params.collection;
    //Khởi tạo cho collection mặc đình bằng Products
    let collection = Products;
    if (collectionName === "ProductsCategory") collection = ProductsCategory;
    if (collectionName === "Role") collection = Role;

    await collection.updateOne({ _id: id }, {
        deleted: false,
        deleteAt: new Date
    });
    res.redirect("back");
}
module.exports.delete = async function (req, res) {
    const id = req.params.id;
    let collectionName = req.params.collection;
    //Khởi tạo cho collection mặc đình bằng Products
    let collection = Products;
    if (collectionName === "ProductsCategory") collection = ProductsCategory;
    if (collectionName === "Role") collection = Role;
   
    await collection.deleteOne({ _id: id });
    res.redirect("back");

}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async function (req, res) {

    let collectionName = req.params.collection;
    //Khởi tạo cho collection mặc đình bằng Products
    let collection = Products;
    if (collectionName === "ProductsCategory") collection = ProductsCategory;
    if (collectionName === "Role") collection = Role;
    //Lấy type của bên front end gửi về
    const type = req.body.type;
    //CHuyển chuỗi ids qua mảng
    const ids = req.body.ids.split(",");

    switch (type) {
        case "restore":
            await collection.updateMany({ _id: { $in: ids } }, {
                deleted: false,
                deleteAt: new Date()
            })
            req.flash('success', `Cập Nhật ${ids.length} Sản Phẩm Thành Công`);
            break;
        case "delete-all-full":
            await collection.deleteMany({ _id: { $in: ids } })
            req.flash('success', `Xóa ${ids.length} Sản Phẩm Thành Công`);
            break
        default:
            break;
    }

    res.redirect("back")
}

