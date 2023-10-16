const Account = require("../../Models/accounts.model")
const Role = require("../../Models/role.model")

const filterStatusHelpers = require("../../Helpers/filterStatus")
const searchItemHelpers = require("../../Helpers/searchItem")
const paginationHelpers = require("../../Helpers/pagination")
const systemConfig = require("../../Config/systems")
var md5 = require('md5');

const actionOptions = [
    {
        value: "active",
        text: "Hoạt động"
    },
    {
        value: "inactive",
        text: "Dừng hoạt động"
    },
    {
        value: "delete-all",
        text: "Xóa tất cả"
    }
]
//[GET] /admin/accounts
module.exports.index = async function (req, res) {
    let find = {
        deleted: false,
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
        find.status = checkActive;
    }

    //Đoạn này về thanh search
    //Hàm này để lấy hàm searchItem từ bên Helpers qua tác dụng để lấy regex của keyword
    const searchItem = searchItemHelpers(checKeyword)
    //Nếu không phải undefind hoặc rỗng thì thêm thuộc tính title
    if (checKeyword) {
        find.fullName = searchItem;
    }


    //Đoạn này về phân trang
    //Đếm xem bảng products có bao nhiêu sản phẩm
    const countAccount = await Account.count(find)

    //Hàm này để lấy hàm pagination từ bên Helpers qua tác dụng để lấy objectPagination
    //Chúng ta phải truyền 3 tham số
    //countProducts: Số lượng sản phẩm của bảng
    //checkPage: Page hiện tại của sản phẩm
    //limitPage: Số lượng sản phẩm cần hiển thị
    const objectPagination = paginationHelpers(countAccount, checkPage, 4)


    const records = await Account.find(find)
        .select("-password -token")
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (let record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    //Lấy tên của user của user đã tạo
    for (const record of records) {
        //Lấy thông tin người tạo
        const user = await Account.findOne({ _id: record.createdBy.account_id })
        if (user) record.accountFullName = user.title
        //Lấy thông tin người cập nhật
        const updateBy = record.updatedBy.slice(-1)[0]
        if (updateBy) {
            const userUpdated = await Account.findOne({
                _id: updateBy.account_id
            })

            updateBy.accountFullName = userUpdated.title
        }
    }

    //thư mục admin/pages/dashboard sẽ tạo sau
    res.render("Admin/Pages/Accounts", {
        title: "Trang Tài Khoản",
        records: records,
        filterStatus: filterStatus,
        keyword: checKeyword,
        objectPagination: objectPagination,
        actionOptions: actionOptions,

    });
}
//[GET] /admin/accounts/create
module.exports.getCreate = async function (req, res) {
    let find = {
        deleted: false,
    }
    const roles = await Role.find(find)
    console.log(roles)
    res.render("Admin/Pages/Accounts/create", {
        title: "Trang Tài Khoản",
        roles: roles
    });
}

//[POst] /admin/accounts/create
module.exports.postCreate = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("account_create")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const emailExits = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if (emailExits) {
        req.flash("error", "Email Đã Tồn Tại");
    }
    else {
        req.body.password = md5(req.body.password);
        req.body.createdBy = {
            account_id: res.locals.user.id
        }
        const record = new Account(req.body);
        await record.save();
    }

    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
}

//[PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("account_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
    const id = req.params.id;
    const status = req.params.status;
    await Account.updateOne({ _id: id }, { 
        status: status,
        $push:{updatedBy:updatedBy}
    });
    req.flash('success', 'Cập Nhật Trạng Thái Thành Công');
    res.redirect('back');
}

//[PATCH] /admin/accounts/change-multi
module.exports.changeMulti = async function (req, res) {
    const permission = res.locals.role.permissions
    if(!permission.includes("account_edit")){
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
            await Account.updateMany({ _id: { $in: ids } }, { 
                status: type ,
                $push:{updatedBy:updatedBy}
            });
            req.flash('success', `Cập Nhật ${ids.length} Sản Phẩm Thành Công`);
            break;
        case "delete-all":
            await Account.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            req.flash('success', `Xóa ${ids.length} Sản Phẩm Thành Công`);
            break
        default:
            break;
    }

    res.redirect("back")
}
//[DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async function (req, res) {
    const id = req.params.id;
    await Account.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    req.flash('success', `Xóa Sản Phẩm Thành Công`);
    res.redirect("back");
}

//[GET] /admin/accounts/detail/:id
module.exports.detail = async function (req, res) {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await Account.findOne(find)
        res.render("Admin/Pages/Products/detail", {
            title: "Chi Tiết Tài Khoản",
            record: record
        });
    } catch {
        req.flash("error", "ID Không Tồn Tại");
        res.redirect(`${systemConfig.prefixAdmin}/account`)
    }

}

// [GET] /admin/accounts/edit/:id
module.exports.getEdit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };

    try {
        const data = await Account.findOne(find);

        const roles = await Role.find({
            deleted: false,
        });

        res.render("Admin/Pages/Accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
};
// [Patch] /admin/accounts/edit/:id
module.exports.patchEdit = async (req, res) => {
    const permission = res.locals.role.permissions
    if(!permission.includes("account_edit")){
        return res.json({err:"Bạn Không Có QUyền"});
        
    }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
      }
    const id = req.params.id
    //Nếu admin không muốn đổi mật khẩu thì xóa password đi
    req.body.password ? req.body.password = md5(req.body.password) : delete req.body.password
    const emailExits = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    })
    if (emailExits) {
        req.flash('error', `Email Đã Trùng Vui Lòng Nhập Lại`);
    }
    else {
        await Account.updateOne({ _id: id }, {
            ...req.body,
            $push:{updatedBy:updatedBy}
        })
        req.flash('success', `Sửa Tài Khoản Thành Công`);
    }
    res.redirect(`back`);


};