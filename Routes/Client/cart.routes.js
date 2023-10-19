const express = require('express');
//Xíu phải tạo file Control mới có file controller này
const controller = require("../../Controllers/Client/cart.controllers")
const router = express.Router();
router.get('/',controller.index)
router.post('/add/:productId',controller.add )
router.get('/delete/:productId',controller.delete)
router.get("/update/:productId/:quantity", controller.update);
module.exports =router