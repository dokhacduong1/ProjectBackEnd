const Cart = require("../../Models/carts.model")
const Product = require("../../Models/product.model")
const prodcutHelper = require("../../Helpers/product")
//[GET] /cart
module.exports.index = async function (req, res) {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({
            _id: cartId
        })
        if (cart.products.length > 0) {
            const listIdProducts = cart.products.map(dataMap => dataMap.product_id);
            const listProducts = await Product.find({ _id: { $in: listIdProducts } })
                .select("title thumbnail slug price discountPercentage")
            // Sắp xếp lại danh sách listProducts theo thứ tự của listIdProducts
            const orderedProducts = listIdProducts.map(productId =>
                listProducts.find(product => product._id.toString() === productId)
            );
            orderedProducts.forEach((element, index) => {
                element.priceNew = prodcutHelper.priceNewProductSingle(element)
                element.totalProduct = element.priceNew * cart.products[index].quantity
                element.quantity = cart.products[index].quantity
            });
            cart.totalPrice = orderedProducts.reduce((sum,dataReduce)=>sum+dataReduce.totalProduct,0)
            cart.productInfo = orderedProducts
        }else{
            cart.productInfo =[]
        }

        res.render("Client/Pages/Cart", {
            title: "Giỏ Hàng",
            cartDetail: cart,

        });
    } catch (error) {
        console.error("Error:", error);

    }

}
//[POST] /cart/add:productId
module.exports.add = async function (req, res) {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    try {
        const cart = await Cart.findById(cartId);

        if (cart) {
            //Check xem product mà khách hàng thêm là vị trí nhiêu không có thì tạo mới một sản phẩn,có rồi lấy cái số lượng cũ
            //cộng cho số lượng mới
            const indexProduct = cart.products.findIndex(dataIndex => dataIndex.product_id === productId);
            if (indexProduct !== -1) {
                cart.products[indexProduct].quantity += quantity;
                //xóa một phần tử theo vị trí
                // cart.products.splice(indexProduct, 1);
            } else {
                cart.products.push({
                    product_id: productId,
                    quantity: quantity
                })
            }
        }

        await cart.save()
        req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
        req.flash("error", "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    }

    res.redirect("back")


}

//[GET] /cart/delete/:productId
module.exports.delete = async function (req, res){
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne({
        _id:cartId
    },{
        $pull:{products:{product_id:productId}}
    }
    )
    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
    res.redirect("back");
}

//[POST] /cart/update/:productId/:quantity
module.exports.update = async function (req, res){
    const cartId = req.cookies.cartId;
    const {productId,quantity} = req.params
    await Cart.updateOne({
        _id:cartId,
        "products.product_id":productId
    },{
        $set:{
            "products.$.quantity":quantity
        }
    })
    req.flash("success", "Cập nhật số lượng thành công!");
    res.redirect("back")
}
