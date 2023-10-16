const mongoose = require("mongoose")
const generate = require("../Helpers/generate")
const accountSchema = new mongoose.Schema(
{
    title: String,
    email:String,
    password:String,
    token:{
        type:String,
        default:generate.generateRandomString(20)
    },
    phone:String,
    avatar:String,
    role_id:String,
    status:String,
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type:Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
          account_id: String,
          updatedAt: Date
        }
      ],
},
{
    timestamps:true
}
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account