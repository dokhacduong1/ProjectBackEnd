const express = require('express');
const controller = require("../../Controllers/Admin/role.controller")
const router = express.Router();
router.get('/',controller.index )
router.get('/create',controller.getCreate)
router.post('/create',controller.postCreate)
router.get('/edit/:id',controller.getEdit)
router.patch('/edit/:id',controller.patchEdit)
router.delete('/delete/:id',controller.delete)
router.patch('/change-multi', controller.changeMulti);
router.get('/detail/:id', controller.detail);
router.get("/permissions",controller.getPermissions)
router.patch("/permissions",controller.patchPermissions)
module.exports =router