const User = require("../../Models/user.model")
module.exports.requireAuthClient = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    if (tokenUser) {
        const user = await User.findOne({ tokenUser: tokenUser }).select("-password")
        //Nếu không tìm được user bằng token thì cho nó lại trang đăng nhập
        if (user) {
           res.locals.userClient = user;         
        }
    }
    next();
}
