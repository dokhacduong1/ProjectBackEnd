const Account = require("../../Models/accounts.model")
const Role = require("../../Models/role.model")
const systemConfig = require("../../Config/systems")
module.exports.requireAuthClient = async (req,res,next)=>{
    const token  = req.cookies.token;
    const user = await Account.findOne({token:token}).select("-password")
    //Nếu không tìm được user bằng token thì cho nó lại trang đăng nhập
    if(!user){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
        //Nếu đúng check quyền của tài khoản đó và lưu vào biến toàn cục có tên role
        const role = await Role.findOne({
            _id:user.role_id
        }).select("title permissions")
        res.locals.user = user;
        res.locals.role = role;
        
        next();
    }
   
}
