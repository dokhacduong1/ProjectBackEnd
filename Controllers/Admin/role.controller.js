const Role = require("../../Models/role.model");
const Account = require("../../Models/accounts.model");
const searchItemHelpers = require("../../Helpers/searchItem")
const paginationHelpers = require("../../Helpers/pagination")
const systemConfig = require("../../Config/systems")


const actionOptions = [
    {
        value: "delete-all",
        text: "Xóa tất cả"
    }
]

//[GET] /roles
module.exports.index = async function (req, res) {
    let find = {
        deleted: false
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
        //Lấy thông tin người tạo
        const user = await Account.findOne({ _id:record.createdBy.account_id })
        if(user) record.accountFullName = user.title 
        //Lấy thông tin người cập nhật
        const updateBy = record.updatedBy.slice(-1)[0]
        if(updateBy){
            const userUpdated = await Account.findOne({
                _id:updateBy.account_id
            })

            updateBy.accountFullName = userUpdated.title
        }
    }
    
    res.render("Admin/Pages/Role", {
        title: "Trang Quản Quyền",
        records: records,
        keyword: checKeyword,
        objectPagination: objectPagination,
        actionOptions: actionOptions
    });
}
//[GET] /roles/create
module.exports.getCreate = async function (req, res) {
    res.render("Admin/Pages/Role/create", {
        title: "Trang Thêm Quyền",

    });
}
//[POST] /roles/create
module.exports.postCreate = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("roles_create")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    req.body.createdBy ={
        account_id:res.locals.user.id
    }
    const record = new Role(req.body)
    
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

//[GET] /roles/edit
module.exports.getEdit = async function (req, res) {
   
    try {
        let find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await Role.findOne(find)

        res.render("Admin/Pages/Role/edit", {
            title: "Trang Chỉnh Sửa Nhóm Quyền",
            data: record
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }

}
//[Patch] /roles/edit
module.exports.patchEdit = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("roles_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
    const id = req.params.id;
    try {
        await Role.updateOne({ _id: id }, {
            ...req.body,
            $push:{updatedBy:updatedBy}
        })
        req.flash("success", "Cập Nhật Thành Công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`)

    } catch (error) {
        req.flash("error", "Cập Nhật Thất Bại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }

}
//[Delete] /roles/delete
module.exports.delete = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("roles_delete")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const id = req.params.id;
    await Role.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id:res.locals.user.id,
            deletedAt:new Date()
        }
    });

    res.redirect(`${systemConfig.prefixAdmin}/roles`)

}

//[PATCH] /admin/role/change-multi
module.exports.changeMulti = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("roles_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    //Lấy type của bên front end gửi về
    const type = req.body.type;
    //CHuyển chuỗi ids qua mảng
    const ids = req.body.ids.split(",");

    switch (type) {
        case "delete-all":
            await Role.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id:res.locals.user.id,
                    deletedAt:new Date()
                }
            })
            req.flash('success', `Xóa ${ids.length} Sản Phẩm Thành Công`);
            break
        default:
            break;
    }

    res.redirect("back")
}

//[GET] /admin/role/detail/:id
module.exports.detail = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await Role.findOne(find)
        res.render("Admin/Pages/Role/detail", {
            title: "Chi Tiết Sản Phẩm",
            record: record
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }

}

//[GET] /admin/role/permissions
module.exports.getPermissions = async function (req, res) {
    let find = {
        deleted: false
    };
    const records = await Role.find(find)

    res.render("Admin/Pages/Role/permissions", {
        title: "Phân Quyền",
        records: records

    });
}

//[Patch] /admin/role/permissions
module.exports.patchPermissions = async function (req, res) {
    const permissions = JSON.parse(req.body.permissions);
    for (element of permissions) {
        const id = element.id;
        await Role.updateOne({ _id: id }, { permissions: element.permissions });
    };
    req.flash('success', `Cập Nhật Thành Công`);
    res.redirect("back")

}