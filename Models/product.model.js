const mongoose = require("mongoose")
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
    {
        title: String,
        product_category_id: {
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
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        featured: String,
        position: Number,
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

const Products = mongoose.model("Products", productSchema, "products");

module.exports = Products