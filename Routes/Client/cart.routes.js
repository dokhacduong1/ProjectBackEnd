const express = require('express');
//Xíu phải tạo file Control mới có file controller này
const controller = require("../../Controllers/Client/cart.controllers")
const validate = require("../../Validates/Client/cart.validate")
const router = express.Router();
router.get('/',controller.index)
router.post('/add/:productId',validate.cardCheckBodyCount,controller.add )
router.get('/delete/:productId',controller.delete)
router.get("/update/:productId/:quantity",validate.cardCheckParamsCount, controller.update);
module.exports =router