const express = require('express');
const controller = require("../../Controllers/Admin/trash.controller")
const router = express.Router();
router.get('/',controller.index )
router.get('/products',controller.products)
router.get('/products-category',controller.productsCategory)
router.get('/roles',controller.roles)
router.patch('/restore/:id/:collection',controller.restore )
router.delete('/delete/:id/:collection',controller.delete)
router.patch('/change-multi/:collection',controller.changeMulti)
module.exports =router