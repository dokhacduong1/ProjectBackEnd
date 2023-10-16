const homeRoutes = require("./home.routes");
const prodcutsRoutes =require ("./products.routes")
const odersRoutes =require ("./oders.routes")
const searchRoutes =require ("./search.routes")
const categoryMiddleware = require("../../Middlewares/Client/category.middleware")
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use('/', homeRoutes)
    app.use('/products', prodcutsRoutes)
    app.use('/oders', odersRoutes)
    app.use('/search', searchRoutes)
}