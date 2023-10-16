
const ProductsCategory = require("../../Models/product-category.model");

const createTree = require("../../Helpers/createTree");

module.exports.category = async(req,res,next)=>{
    const find = {
        deleted: false
    }
    const records= await ProductsCategory.find(find);
     //Lấy ra một cây có chưa phân cấp từng danh mục
     const tree = createTree.tree(records)
    res.locals.layoutProductCategory = tree;
    next();
}