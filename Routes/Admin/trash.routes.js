const express = require('express');
const controller = require("../../Controllers/Admin/trash.controller")
const router = express.Router();
router.get('/',controller.index )
router.patch('/restore/:id',controller.restore )
router.delete('/delete/:id',controller.delete)
module.exports =router