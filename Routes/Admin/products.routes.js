const express = require('express');
const controller = require("../../Controllers/Admin/products.controller");
const validate = require("../../Validates/Admin/product.validate")
const router = express.Router();
const multer = require('multer')
const storageMulter = require("../../Helpers/storageMulter")
const upload = multer({ storage: storageMulter() })

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.getCreate);

//Nếu muốn upload ảnh phải cho thêm upload.single thì nó mới gửi dữ liệu lên
router.post('/create',
    upload.single('thumbnail'),
    validate.createValidateError,
    controller.postCreate
);
router.get('/edit/:id', controller.getEdit);

router.patch('/edit/:id',
    upload.single('thumbnail'),
    validate.createValidateError,
    controller.patchEdit,

);

router.get('/detail/:id', controller.detail);
module.exports = router