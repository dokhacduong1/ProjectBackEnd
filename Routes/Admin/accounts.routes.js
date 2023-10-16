const express = require('express');
const controller = require("../../Controllers/Admin/accounts.controller")
const validate = require("../../Validates/Admin/accounts.validate")
const router = express.Router();
const multer = require('multer')
const uploadCloud = require("../../Middlewares/Admin/uploadCloud.middleware")
const upload = multer()

router.get('/', controller.index)
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.get('/create', controller.getCreate)
router.delete('/delete/:id', controller.deleteItem);
router.post('/create',
    upload.single('avatar'),
    uploadCloud.uplload,
    validate.createValidateError,
    controller.postCreate)
router.get('/detail/:id', controller.detail);
router.get("/edit/:id", controller.getEdit);
router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.uplload,
    validate.editPatch,
    controller.patchEdit
  );
module.exports = router