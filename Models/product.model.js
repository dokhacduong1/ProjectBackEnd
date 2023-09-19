const mongoose = require("mongoose")
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
{
    title: String,
    slug: { 
        type: String, 
        slug: "title",
        unique:true
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type:Boolean,
        default: false
    },
    deleteAt:Date
},
{
    timestamps:true
}
);

const Products = mongoose.model("Products", productSchema, "products");

module.exports = Products