const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
{
    fullName: String,
    email:String,
    phone:String,
    address:String,
    password:String,
    tokenUser:String,
    phone:String,
    avatar:String,
    status:{
        type:String,
        default:"active"
    },
    updatedBy: [
        {
          account_id: String,
          updatedAt: Date
        }
      ],
    deleted: {
        type:Boolean,
        default: false
    },
    deletedAt:Date
},
{
    timestamps:true
}
);

const User = mongoose.model("Uswer", userSchema, "users");

module.exports = User