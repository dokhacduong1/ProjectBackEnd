const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()

const uploadCloud = require("../../Middlewares/Admin/uploadCloudTinyMce.middleware")

router.post('/',
    upload.single('thumbnail'),
    uploadCloud.uplload,
)
module.exports = router