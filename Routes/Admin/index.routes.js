const dashboardRoutes = require("./dashboard.routes")
const productsRoutes = require("./products.routes")
const trashRoutes = require("./trash.routes")
const systemConfig = require("../../Config/systems")
module.exports = (app)=>{
    
    app.use(systemConfig.prefixAdmin+'/dashboard',dashboardRoutes)
    app.use(systemConfig.prefixAdmin+'/products',productsRoutes)
    app.use(systemConfig.prefixAdmin+'/trash',trashRoutes)
}