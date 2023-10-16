const express = require("express");
const router = express.Router();

const controller = require("../../Controllers/Admin/auth.controller")
const validate = require("../../Validates/Admin/auth.validate")

router.get("/login", controller.getLogin);

router.post("/login",
    validate.loginPost,
    controller.postLogin);
router.get("/logout", controller.logout);
module.exports = router;