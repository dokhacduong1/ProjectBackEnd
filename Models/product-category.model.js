
const mongoose = require("mongoose")
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema(
{
    title: String,
    slug: { 
        type: String, 
        slug: "title",
        unique:true
    },
    description: String,
    parent_id:{
        type:String,
        default:""
    },
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

const ProductsCategory = mongoose.model("ProductsCategory", productCategorySchema, "products-category");

module.exports = ProductsCategory