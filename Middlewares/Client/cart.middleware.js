const Cart = require("../../Models/carts.model");
const User = require("../../Models/user.model");
const axios = require("axios");

const expiresCookie = 1000 * 60 * 60 * 24 * 365;

// Hàm tạo giỏ hàng mới hoặc lấy giỏ hàng hiện có bằng địa chỉ IP
async function createOrGetCartByIP(user_ip) {
    const existingCart = await Cart.findOne({ user_ip });

    if (existingCart) {
        return existingCart;
    } else {
        const newCart = new Cart({ user_ip });
        await newCart.save();
        return newCart;
    }
}

// Middleware tạo giỏ hàng dựa trên địa chỉ IP
async function crateCart(res) {
    try {
        const { data } = await axios.get("https://api.ipify.org/?format=json");
        const user_ip = data.ip;

        const cart = await createOrGetCartByIP(user_ip);
        cart.totalQuantity = cart.products.reduce((total, dataReduce) => total + dataReduce.quantity, 0);
        res.locals.miniCart = cart;

        res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresCookie) });
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý giỏ hàng:", error);
    }
}

// Middleware xử lý giỏ hàng
module.exports.cartId = async (req, res, next) => {
    const cartId = req.cookies.cartId;
    const tokenUser = req.cookies.tokenUser;
    
    if (tokenUser) {
        const user = await User.findOne({ tokenUser });

        if (user) {
            const cart = await Cart.findOne({ user_id: user.id });

            if (cart) {
                cart.totalQuantity = cart.products.reduce((total, dataReduce) => total + dataReduce.quantity, 0);
                res.locals.miniCart = cart;
                res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresCookie) });
            } else {
                res.clearCookie("tokenUser");
            }
        }
    } else {
        if (cartId) {
            const cart = await Cart.findOne({ _id: cartId });

            if (cart) {
                cart.totalQuantity = cart.products.reduce((total, dataReduce) => total + dataReduce.quantity, 0);
                res.locals.miniCart = cart;
            } else {
                await crateCart(res);
            }
        } else {
            await crateCart(res);
        }
    }

    next();
};

