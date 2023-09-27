const express = require('express');
const multer = require('multer')
const controller = require("../../Controllers/Admin/products-category.controller")
const validate = require("../../Validates/Admin/product-category.validate")
const uploadCloud = require("../../Middlewares/Admin/uploadCloud.middleware")
const upload = multer()
const router = express.Router();

router.get('/', controller.index)
router.get('/create', controller.getCreate)
router.patch('/change-status/:status/:id', controller.changeStatus);
router.delete('/delete/:id', controller.deleteItem);
router.patch('/change-multi', controller.changeMulti);
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.uplload,
    validate.createValidateError,
    controller.postCreate
)
router.get('/edit/:id', controller.getEdit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.uplload,
    validate.createValidateError,
    controller.patchEdit,
);

router.get('/detail/:id', controller.detail);
module.exports = router