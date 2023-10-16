const express = require("express");
const router = express.Router();
const controller = require("../../Controllers/Admin/my-account.controller")

const multer = require('multer')
const uploadCloud = require("../../Middlewares/Admin/uploadCloud.middleware")
const upload = multer()

router.get("/", controller.index);
router.get("/edit", controller.getEdit);
router.patch("/edit",
    upload.single('avatar'),
    uploadCloud.uplload,
    controller.patchEdit);
module.exports = router