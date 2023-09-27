const ProductsCategory = require("../../Models/product-category.model");
const filterStatusHelpers = require("../../Helpers/filterStatus")
const searchItemHelpers = require("../../Helpers/searchItem")
const paginationHelpers = require("../../Helpers/pagination")
const systemConfig = require("../../Config/systems")

const sortOptions =[
    {
        value:"position-desc",
        text: "Vị trí giảm dần"
    },
    {
        value:"position-asc",
        text: "Vị trí tăng dần"
    },
    {
        value:"title-asc",
        text: "Tiêu đề A - Z"
    },
    {
        value:"title-desc",
        text: "Tiêu đề Z - A"
    },
]
//[GET] /admin/products-category
module.exports.index = async function (req, res) {
    //Khai báo biến findx
    const find = {
        deleted: false
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
    const objectPagination = paginationHelpers(countProducts, checkPage, 4)



    //Đoạn này làm về sort
    //Muốn cho một biến có giá trị thành một thuộc tính ta truyền [sortKey] vào
    const sort = {
        [sortKey]: sortValue
    }
    const sortSelect = `${sortKey}-${sortValue}`;


    const record = await ProductsCategory.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
        .sort(sort);

    //Render ra giao diện
    res.render("Admin/Pages/ProductsCategory", {
        title: "Trang Danh Mục",
        record: record,
        filterStatus: filterStatus,
        keyword: checKeyword,
        objectPagination: objectPagination,
        sortSelect: sortSelect,
        sortOptions:sortOptions
    });

}

//[GET] /admin/products-category/create
module.exports.getCreate = async function (req, res) {
    res.render("Admin/Pages/ProductsCategory/create", {
        title: "Trang Tạo Danh Mục",
    });
}

//[POST] /admin/products-category/create
module.exports.postCreate = async function (req, res) {
    const cout = await ProductsCategory.count({})
    req.body.description = req.body.description || "Bài Này Chưa Có Tiêu Đề"
    req.body.position = parseInt(req.body.position) || cout + 1
    const record = new ProductsCategory(req.body);
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)

}

//[PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async function (req, res) {
    //Lấy type của bên front end gửi về
    const type = req.body.type;
    //CHuyển chuỗi ids qua mảng
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
        case "inactive":
            await ProductsCategory.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash('success', `Cập Nhật ${ids.length} Sản Phẩm Thành Công`);
            break;
        case "delete-all":
            await ProductsCategory.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deleteAt: new Date()
            })
            req.flash('success', `Xóa ${ids.length} Sản Phẩm Thành Công`);
            break
        case "change-position":
            for (const item of ids) {
                const split = item.split("-");
                const [id, position] = split
                await ProductsCategory.updateOne({ _id: id }, { position: parseInt(position) })
            }
            req.flash('success', `Thay Đổi Vị Trí ${ids.length} Sản Phẩm Thành Công`);
            break;
        default:
            break;
    }

    res.redirect("back")
}
//[GET] /admin/products-category/edit/:id
module.exports.getEdit = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await ProductsCategory.findOne(find)
        res.render("Admin/Pages/ProductsCategory/edit", {
            title: "Chỉnh Sửa Sản Phẩm",
            record: record
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}

//[PATCH] /admin/products-category/edit/:id
module.exports.patchEdit = async function (req, res) {
    const id = req.params.id
    req.body.description = req.body.description
    req.body.position = parseInt(req.body.position)
    try {
        await ProductsCategory.updateOne({ _id: id }, req.body)
        req.flash("success", "Cập Nhật Thành Công");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)

    } catch (error) {
        req.flash("error", "Cập Nhật Thất Bại");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }

}

//[DELETE] /admin/delete/:id
module.exports.deleteItem = async function (req, res) {
    const id = req.params.id;
    await ProductsCategory.updateOne({ _id: id }, {
        deleted: true,
        deleteAt: new Date
    });
    req.flash('success', `Xóa Sản Phẩm Thành Công`);
    res.redirect("back");
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async function (req, res) {
    const id = req.params.id;
    const status = req.params.status;
    await ProductsCategory.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập Nhật Trạng Thái Thành Công');
    res.redirect('back');
}

//[GET] /admin/products-category/detail/:id
module.exports.detail = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await ProductsCategory.findOne(find)
        res.render("Admin/Pages/ProductsCategory/detail", {
            title: "Chi Tiết Danh Mục",
            record: record
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }

}