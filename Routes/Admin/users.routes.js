const express = require('express');
const controller = require("../../Controllers/Admin/users.controller")
const validate = require("../../Validates/Admin/users.validate")
const router = express.Router();


router.get('/', controller.index)
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/detail/:id', controller.detail);
router.get("/edit/:id", controller.getEdit);
router.patch(
    "/edit/:id",
    validate.editPatch,
    controller.patchEdit
  );
module.exports = router