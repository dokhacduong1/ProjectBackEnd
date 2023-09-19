const homeRoutes = require("./home.routes");
const prodcutsRoutes =require ("./products.routes")
const odersRoutes =require ("./oders.routes")
module.exports = (app) => {
    app.use('/', homeRoutes)
    app.use('/products', prodcutsRoutes)
    app.use('/oders', odersRoutes)
}