
const Cart = require("../../Models/carts.model")
const axios = require("axios")

async function crateCart(res) {
    try {
       
        let idCookie = ""
        const instance = axios.create({
            timeout: 10000 // Timeout sau 10 giây (hoặc bạn có thể thay đổi thời gian timeout tùy ý)
          });
        const { data } = await instance.get("https://api.ipify.org/?format=json");
        
        const user_ip = data.ip;
        const existingCart = await Cart.findOne({ user_ip });
        const expiresCookie = 1000 * 60 * 60 * 24 * 365;
        
        let cart = {};
        //check xem nếu có ip giỏ hàng này rồi thì cho nó vào lại cookie tránh người dùng xóa cookie linh tinh
        if (existingCart) {
            idCookie = existingCart.id
            cart = existingCart
        } else {
            const newCart = new Cart({ user_ip: user_ip });
            await newCart.save();
            idCookie = newCart.id
            cart = newCart
        }
        //Lưu giá trị số lượng sản phẩm để in ra màn hình
        cart.totalQuantity = cart.products.reduce((total, dataReduce) => total + dataReduce.quantity, 0)
        res.locals.miniCart = cart

        res.cookie("cartId", idCookie, {
            expires: new Date(Date.now() + expiresCookie) // cookie will be removed after 8 hours
        });

    } catch (error) {
        console.error("Lỗi trong quá trình xử lý giỏ hàng:", error);
    }
}

module.exports.cartId = async (req, res, next) => {
    const cartId = req.cookies.cartId;
    //nếu tồn tại cookie có tên carId thì vào trong if không thì tạo cái mới
    if(cartId){       
        const cart = await Cart.findOne({_id: cartId});
        //nếu tìm thấy giỏ hàng thì gán giá trị totalQuantity cho cart luôn không tìm thấy thì cũng tạo cái mới
        if(cart){
            cart.totalQuantity = cart.products.reduce((total, dataReduce) => total + dataReduce.quantity, 0)
            res.locals.miniCart = cart
        }else{
            await crateCart(res)
        }
       
    }else{

        await crateCart(res)
    }
    
    next();
}