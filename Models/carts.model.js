
const mongoose = require("mongoose")


const cartsSchema = new mongoose.Schema(
{
    user_id:String,
    products:[
        {
            product_id:String,
            quantity:Number
        }
    ]
},
{
    timestamps:true
}
);

const Carts = mongoose.model("CartsCategory", cartsSchema, "carts");

module.exports = Carts