//[GET] /products
const Products = require("../../Models/product.model");
module.exports.index = async function (req, res) {
    
    const products  = await Products.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"});
    
    const productsNew = products.map(dataMap=>{
        dataMap.priceNew = (dataMap.price*(100-dataMap.discountPercentage)/100).toFixed(0);
       
        return dataMap
    })
    
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
        res.render("Client/Pages/Products/detail",{
            title:"Trang Sản Phẩm",
            record:record
        });
    } catch (error) {
        res.redirect(`/products`);
    }
    
}