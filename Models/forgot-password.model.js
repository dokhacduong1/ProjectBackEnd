const mongoose = require("mongoose")


const forgotPasswordSchema = new mongoose.Schema(
    {
       email:String,
       otp:String,
       expireAt: {
        type: Date,
    }
    }
);
forgotPasswordSchema.index({"lastModifiedDate": 1 },{ expireAfterSeconds: 11 });

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword