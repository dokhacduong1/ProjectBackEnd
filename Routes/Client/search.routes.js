const express = require('express');
//Xíu phải tạo file Control mới có file controller này
const controller = require("../../Controllers/Client/search.controllers")
const router = express.Router();
router.get('/',controller.index )
module.exports =router