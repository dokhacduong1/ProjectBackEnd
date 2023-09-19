const express = require('express');
//Xíu phải tạo file Control mới có file controller này
const controller = require("../../Controllers/Client/products.controllers")
const router = express.Router();
router.get('/',controller.index )

router.get('/:slug',controller.detail)
module.exports =router