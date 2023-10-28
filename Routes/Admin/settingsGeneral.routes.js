const multer = require('multer')
const express = require('express');
const controller = require("../../Controllers/Admin/settings-eneral.controller")
const uploadCloud = require("../../Middlewares/Admin/uploadCloud.middleware")
const upload = multer()

const router = express.Router();
router.get('/general',controller.getGeneral)
router.patch('/general',
    upload.single('logo'),
    uploadCloud.uplload,
    controller.patchGeneral)
module.exports = router