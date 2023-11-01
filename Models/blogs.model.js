const mongoose = require("mongoose")
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const blogsSchema = new mongoose.Schema(
    {
        title: String,
        blog_category_id: {
            type: String,
            default: ""
        },
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        description: String,
        content: String,
        thumbnail: String,
        status: String,
        position: Number,
        featured: String,
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deleted: {
            type: Boolean,
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
        // deleteAt:Date
    },
    {
        timestamps: true
    }
);

const Blogs = mongoose.model("Blogs", blogsSchema, "blogs");

module.exports = Blogs