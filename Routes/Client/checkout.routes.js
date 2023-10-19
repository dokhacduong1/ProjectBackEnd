const express = require('express');
//Xíu phải tạo file Control mới có file controller này
const controller = require("../../Controllers/Client/checkout.controllers")
const router = express.Router();
router.get('/',controller.index )
router.post('/order',controller.oders )
router.get('/success/:orderId',controller.success)
module.exports =router