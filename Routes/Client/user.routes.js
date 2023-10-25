const express = require('express');
//Xíu phải tạo file Control mới có file controller này
const controller = require("../../Controllers/Client/user.controllers")
const validate =require("../../Validates/Client/user.validate")
const authMiddleware =require("../../Middlewares/Client/auth.middleware")
const router = express.Router();
router.get('/register',controller.getRegister )
router.post('/register',validate.registerPort,controller.postRegister )
router.get('/login',controller.getLogin )
router.get('/logout',controller.getLogout )
router.post('/login',validate.loginPort,controller.postLogin )
router.get('/password/forgot',controller.getForgotPassword )
router.post('/password/forgot',controller.postForgotPassword )
router.get('/password/otp',controller.getOtp )
router.post('/password/otp',controller.postOtp )
router.get('/password/reset',authMiddleware.requireAuth,controller.getResetPassword )
router.post('/password/reset',authMiddleware.requireAuth,validate.resetPasswordPost,controller.postResetPassword )
module.exports =router