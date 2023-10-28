const express = require('express');
//Xíu phải tạo file Control mới có file controller này
const authMiddleware =require("../../Middlewares/Client/auth.middleware")
const controller = require("../../Controllers/Client/chat.controllers")
const router = express.Router();
router.get('/',authMiddleware.requireAuth,controller.index)

module.exports =router