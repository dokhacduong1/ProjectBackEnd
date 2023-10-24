const homeRoutes = require("./home.routes");
const prodcutsRoutes =require ("./products.routes")
const odersRoutes =require ("./oders.routes")
const searchRoutes =require ("./search.routes")
const cartRoutes =require ("./cart.routes")
const checkoutRoutes =require ("./checkout.routes")
const userRoutes =require ("./user.routes")
const cartMiddleware = require("../../Middlewares/Client/cart.middleware")
const categoryMiddleware = require("../../Middlewares/Client/category.middleware")
const headerMiddleware = require("../../Middlewares/Client/header.middleware")
const userMiddleware = require("../../Middlewares/Client/user.middleware")
module.exports = (app) => {
    app.use(cartMiddleware.cartId);
    app.use(categoryMiddleware.category);
    app.use(headerMiddleware.cacheControl);
    app.use(userMiddleware.requireAuthClient);
    app.use('/', homeRoutes);
    app.use('/products', prodcutsRoutes);
    app.use('/oders', odersRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);
    app.use('/user', userRoutes);
}