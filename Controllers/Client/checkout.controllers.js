const Cart = require("../../Models/carts.model")
const Product = require("../../Models/product.model")
const Order = require("../../Models/order.model")

const prodcutHelper = require("../../Helpers/product")
module.exports.index = async function (req, res) {
    try {
        const cartId = req.cookies.cartId;
        const tokenUser = req.cookies.tokenUser;
        const user = [];
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
            cart.totalPrice = orderedProducts.reduce((sum, dataReduce) => sum + dataReduce.totalProduct, 0)
            cart.productInfo = orderedProducts
        } else {
            cart.productInfo = []
        }
        
        res.render("Client/Pages/Checkout", {
            title: "Đặt Hàng",
            cartDetail: cart,
        });
    } catch (error) {
        console.error("Error:", error);

    }

}

module.exports.oders = async function (req, res) {
    const cartId = req.cookies.cartId;
    const userInfo = req.body
    let newProducts = [];
    const cart = await Cart.findOne({
        _id: cartId
    })
    if (cart.products.length > 0) {
        const listIdProducts = cart.products.map(dataMap => dataMap.product_id);
        const listProducts = await Product.find({ _id: { $in: listIdProducts } })
            .select("price quantity discountPercentage")
        // Sắp xếp lại danh sách listProducts theo thứ tự của listIdProducts
        const orderedProducts = listIdProducts.map(productId =>
            listProducts.find(product => product._id.toString() === productId)
        );
        newProducts = orderedProducts.map((element, index) => ({
            product_id: element.id,
            quantity: cart.products[index].quantity,
            discountPercentage: element.discountPercentage,
            price: element.price
        }));

    }
    const oderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: newProducts
    }
    const order = new Order(oderInfo)
    await order.save()
    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    })
    res.redirect(`/checkout/success/${order.id}`)
}

module.exports.success = async function (req, res) {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({ _id: orderId })
        
        const listIdProducts = order.products.map(dataMap => dataMap.product_id);
        const listProducts = await Product.find({ _id: { $in: listIdProducts } })
            .select("title thumbnail")
        // Sắp xếp lại danh sách listProducts theo thứ tự của listIdProducts
        const orderedProducts = listIdProducts.map(productId =>
            listProducts.find(product => product._id.toString() === productId)
        );
        orderedProducts.forEach((element, index) => {
           
            element.priceNew = prodcutHelper.priceNewProductSingle(order.products[index])
            element.totalProduct = element.priceNew * order.products[index].quantity
            element.quantity = order.products[index].quantity
        });
       
        order.totalPrice = orderedProducts.reduce((sum, dataReduce) => sum + dataReduce.totalProduct, 0)
        order.productInfo = orderedProducts
    
        res.render("Client/Pages/Checkout/success", {
            title: "Đặt Hàng Thành Công",
            order:order
        });
    } catch (error) {
        res.redirect(`/`);
    }
   
}