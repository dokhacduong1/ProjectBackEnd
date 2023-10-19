//[GET] /products
const Products = require("../../Models/product.model");
const ProductsCategory = require("../../Models/product-category.model");
const prodcutHelper = require("../../Helpers/product")
const treeHelper = require("../../Helpers/createTree")
module.exports.index = async function (req, res) {
    
    const products  = await Products.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"});
    
    const productsNew = prodcutHelper.priceNewProducts(products)
    
    res.render("Client/Pages/Products",{
        title:"Trang Sản Phẩm",
        products:productsNew
     
    });
}

module.exports.detail = async function (req, res) {
    try {
        const find = {
            deleted :false,
            slug:req.params.slug,
            status:"active"
        }
        const record = await Products.findOne(find)
        if(record.product_category_id){
            const category = await ProductsCategory.findOne({
                _id:record.product_category_id,
                deleted:false,
                status:"active"
            })
            record.category = category
        }
        record.priceNew = prodcutHelper.priceNewProductSingle(record)

        res.render("Client/Pages/Products/detail",{
            title:"Trang Sản Phẩm",
            product:record
        });
    } catch (error) {
        res.redirect(`/products`);
    }
    
}
module.exports.category = async function (req, res) {
    const slug =req.params.slugCategory
    const category = await ProductsCategory.findOne({
        slug:slug
    });
    //Lấy ra các danh mục con trong danh mục cha ví dụ chọn danh mục Nữ nó phải load sản phẩm ra
    //Áo Polo ,Áo Thun
    const listSubCategory  = await treeHelper.treeLoadSubCategory(category.id)
    const listSubCategoryId = listSubCategory.map(item => item.id);
    const products = await Products.find({
        product_category_id:{$in:[category.id,...listSubCategoryId]},
        deleted:false
    }).sort({position:"desc"})
    const productsNew = prodcutHelper.priceNewProducts(products)
    
    res.render("Client/Pages/Products",{
        title:category.title,
        products:productsNew
     
    });
  
}