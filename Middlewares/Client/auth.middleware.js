const User = require("../../Models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser, status: "active" }).select("-password");
    if (!user) {
      res.clearCookie("tokenUser")
      res.clearCookie("cartId")
      res.redirect(`/user/login`);

    } else {
      res.locals.user = user;
      next();
    }
  }
};