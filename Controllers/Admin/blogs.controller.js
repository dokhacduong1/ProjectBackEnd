const Products = require("../../Models/product.model");
const Blogs = require("../../Models/blogs.model");
const BlogsCategory = require("../../Models/blog-category.model");
const filterStatusHelpers = require("../../Helpers/filterStatus")
const searchItemHelpers = require("../../Helpers/searchItem")
const paginationHelpers = require("../../Helpers/pagination")
const systemConfig = require("../../Config/systems")
const createTree = require("../../Helpers/createTree");
const ProductsCategory = require("../../Models/product-category.model");
const Account = require("../../Models/accounts.model");
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

const actionOptions =[
    {
        value:"active",
        text: "Hoạt động"
    },
    {
        value:"inactive",
        text: "Dừng hoạt động"
    },
    {
        value:"delete-all",
        text: "Xóa tất cả"
    },
    {
        value:"change-position",
        text: "Thay đổi vị trí"
    },
]

//[GET] /admin/blogs
module.exports.index = async function (req, res) {
    try {
        //Khai báo biến find
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
        const countProducts = await Blogs.count(find)
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
        



        //Bắt đầu tìm kiếm trong bảng sản phẩm
        const blogs = await Blogs.find(find)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip)
            .sort(sort);

        //Lấy tên của user của user đã tạo
        for(const product of blogs){
            //Lấy thông tin người tạo
            const user = await Account.findOne({ _id:product.createdBy.account_id })
            if(user) product.accountFullName = user.title 
            //Lấy thông tin người cập nhật
            const updateBy = product.updatedBy.slice(-1)[0]
            if(updateBy){
                const userUpdated = await Account.findOne({
                    _id:updateBy.account_id
                })

                updateBy.accountFullName = userUpdated.title
            }
        }
        
      
        //Lấy ra tên user cập nhật
       

        //Render ra giao diện
        res.render("Admin/Pages/Blogs", {
            title: "Trang Blogs",
            blogs: blogs,
            filterStatus: filterStatus,
            keyword: checKeyword,
            objectPagination: objectPagination,
            sortSelect: sortSelect,
            sortOptions:sortOptions,
            actionOptions:actionOptions
        });
    } catch (error) {
        req.flash("error", "Sai Đường Dẫn");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`);
    }

}

//[PATCH] /admin/blogs/change-status/:status/:id
module.exports.changeStatus = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("blogs_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
    const id = req.params.id;
    const status = req.params.status;
    await Blogs.updateOne({ _id: id }, { 
        status: status, 
        $push:{updatedBy:updatedBy}
    });
    req.flash('success', 'Cập Nhật Trạng Thái Thành Công');
    res.redirect('back');
}

//[PATCH] /admin/blogs/change-multi
module.exports.changeMulti = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("blogs_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
    //Lấy type của bên front end gửi về
    const type = req.body.type;
    //CHuyển chuỗi ids qua mảng
    const ids = req.body.ids.split(",");
    switch (type) {
        case "active":
        case "inactive":
            await Blogs.updateMany({ _id: { $in: ids } }, { 
                status: type,
                $push:{updatedBy:updatedBy}
            });
          
            req.flash('success', `Cập Nhật ${ids.length} Sản Phẩm Thành Công`);
            break;
        case "delete-all":
            await Blogs.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id:res.locals.user.id,
                    deletedAt:new Date()
                }
            })
            req.flash('success', `Xóa ${ids.length} Sản Phẩm Thành Công`);
            break
        case "change-position":
            for (const item of ids) {
                const split = item.split("-");
                const [id, position] = split
                await Blogs.updateOne({ _id: id }, { 
                    position: parseInt(position),
                    $push:{updatedBy:updatedBy}
                })
            }
            req.flash('success', `Thay Đổi Vị Trí ${ids.length} Sản Phẩm Thành Công`);
            break;
        default:
            break;
    }

    res.redirect("back")
}

//[DELETE] /admin/blogs/delete/:id
module.exports.deleteItem = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("blogs_delete")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const id = req.params.id;
    await Blogs.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id:res.locals.user.id,
            deletedAt:new Date()
        }
    });
    req.flash('success', `Xóa Sản Phẩm Thành Công`);
    res.redirect("back");
}

//[GET] /admin/blogs/create
module.exports.getCreate = async function (req, res) {
    const records = await BlogsCategory.find({deleted:false})
    //Lấy ra một cây có chưa phân cấp từng danh mục
    const tree = createTree.tree(records)
    res.render("Admin/Pages/Blogs/create", {
        title: "Trang Tạo Blogs",
        record:tree
    });
}
//[POST] /admin/blogs/create
module.exports.postCreate = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("blogs_create")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const cout = await Blogs.count({})
    req.body.description = req.body.description || "Bài Này Chưa Có Tiêu Đề"
    req.body.content = req.body.content || ""
    req.body.position = parseInt(req.body.position) || cout + 1
    req.body.createdBy ={
        account_id:res.locals.user.id
    }
    const product = new Blogs(req.body);
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/blogs`)
}

//[GET] /admin/blogs/edit/:id
module.exports.getEdit = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const records = await BlogsCategory.find({deleted:false})
 
        //Lấy ra một cây có chưa phân cấp từng danh mục
        const tree = createTree.tree(records)
        
        const record = await Blogs.findOne(find)
       
        res.render("Admin/Pages/Blogs/edit", {
            title: "Chỉnh Sửa Blogs",
            record: record,
            recordTree:tree
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`)
    }

}

//[PATCH] /admin/blogs/edit/:id
module.exports.patchEdit = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("blogs_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
    const id = req.params.id
    req.body.description = req.body.description
    req.body.content = req.body.content || ""
    req.body.position = parseInt(req.body.position)

    try {
        await Blogs.updateOne({ _id: id }, {
            ...req.body,
            $push:{updatedBy:updatedBy}
        })
        req.flash("success", "Cập Nhật Thành Công");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`)

    } catch (error) {
        req.flash("error", "Cập Nhật Thất Bại");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`)
    }



}

//[GET] /admin/blogs/detail/:id
module.exports.detail = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await Blogs.findOne(find)
        res.render("Admin/Pages/Blogs/detail", {
            title: "Chi Tiết Blogs",
            record: record
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`)
    }

}