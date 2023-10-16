
const mongoose = require("mongoose")
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const blogsCategorySchema = new mongoose.Schema(
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
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    thumbnail: String,
    status: String,
    position: Number,
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

const BlogsCategory = mongoose.model("BlogsCategory", blogsCategorySchema, "blogs-category");

module.exports = BlogsCategory