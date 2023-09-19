const Products = require("../../Models/product.model");
const filterStatusHelpers = require("../../Helpers/filterStatus")
const searchItemHelpers = require("../../Helpers/searchItem")
const paginationHelpers = require("../../Helpers/pagination")
const systemConfig = require("../../Config/systems")
//[GET] /admin/products
module.exports.index = async function (req, res) {
    //Khai báo biến find
    const find = {
        deleted: false
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
    const products = await Products.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
        .sort({ position: "desc" })



    //Render ra giao diện
    res.render("Admin/Pages/Products", {
        title: "Trang Sản Phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: checKeyword,
        objectPagination: objectPagination,
    });

}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async function (req, res) {
    const id = req.params.id;
    const status = req.params.status;
    await Products.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập Nhật Trạng Thái Thành Công');
    res.redirect('back')
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async function (req, res) {
    //Lấy type của bên front end gửi về
    const type = req.body.type;
    //CHuyển chuỗi ids qua mảng
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
        case "inactive":
            await Products.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash('success', `Cập Nhật ${ids.length} Sản Phẩm Thành Công`);
            break;
        case "delete-all":
            await Products.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deleteAt: new Date()
            })
            req.flash('success', `Xóa ${ids.length} Sản Phẩm Thành Công`);
            break
        case "change-position":
            for (const item of ids) {
                const split = item.split("-");
                const [id, position] = split
                await Products.updateOne({ _id: id }, { position: parseInt(position) })
            }
            req.flash('success', `Thay Đổi Vị Trí ${ids.length} Sản Phẩm Thành Công`);
            break;
        default:
            break;
    }

    res.redirect("back")
}

//[DELETE] /admin/delete/:id
module.exports.deleteItem = async function (req, res) {
    const id = req.params.id;
    await Products.updateOne({ _id: id }, {
        deleted: true,
        deleteAt: new Date
    });
    req.flash('success', `Xóa Sản Phẩm Thành Công`);
    res.redirect("back");
}

//[GET] /admin/products/create
module.exports.getCreate = async function (req, res) {
    res.render("Admin/Pages/Products/create", {
        title: "Trang Tạo Sản Phẩm",
    });
}
//[POST] /admin/products/create
module.exports.postCreate = async function (req, res) {
    const cout = await Products.count({})

    req.body.description = req.body.description || "Bài Này Chưa Có Tiêu Đề"
    req.body.price = parseInt(req.body.price) || 0
    req.body.discountPercentage = parseInt(req.body.discountPercentage) || 0
    req.body.thumbnail = req.file ? `/Uploads/${req.file.filename}` : "https://www.duongshop.xyz/logo1.png"
    req.body.position = parseInt(req.body.position) || cout + 1
    req.body.stock = parseInt(req.body.stock) || 0

    const product = new Products(req.body);
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] /admin/products/edit/:id
module.exports.getEdit = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await Products.findOne(find)
        res.render("Admin/Pages/Products/edit", {
            title: "Chỉnh Sửa Sản Phẩm",
            record: record
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}

//[PATCH] /admin/products/edit/:id
module.exports.patchEdit = async function (req, res) {
    const id = req.params.id
    req.body.description = req.body.description 
    req.body.price = parseInt(req.body.price) 
    req.body.discountPercentage = parseInt(req.body.discountPercentage) 
    req.body.position = parseInt(req.body.position)
    req.body.stock = parseInt(req.body.stock)

    if(req.file){
        req.body.thumbnail = `/Uploads/${req.file.filename}`
    }
    
    try {
        await Products.updateOne({_id:id},req.body)
        req.flash("success", "Cập Nhật Thành Công");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
       
    } catch (error) {
        req.flash("error", "Cập Nhật Thất Bại");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }


   
}

//[GET] /admin/products/detail/:id
module.exports.detail = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await Products.findOne(find)
        res.render("Admin/Pages/Products/detail", {
            title: "Chi Tiết Sản Phẩm",
            record: record
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}