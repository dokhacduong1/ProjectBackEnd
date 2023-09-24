//Require Thư viện đã cài
const express = require('express')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
var flash = require('express-flash')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var path = require('path');



//Require các thành phần vừa viết
const routeClient = require("./Routes/Client/index.routes")
const routeAdmin = require("./Routes/Admin/index.routes")
const database = require("./Config/database")
const systemConfig = require("./Config/systems")


//Tạo một đối tượng app
const app = express()

//Cấu hình để nhận data body khi request
app.use(bodyParser.urlencoded({ extended: false }))
//Cấu hình phương thức gửi đi của form
app.use(methodOverride('_method'))
//Cấu hình thư mục cho public  để người dùng có thể truy cập được trong mục public
app.use(express.static(`${__dirname}/Public`));
//Cấu hình để hiển thị thông báo (Flash)
app.use(cookieParser('FJFDSIOSDFIPDSF'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//Cấu hình Tinymce bộ soạn thaỏ văn bản
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));



app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Truyền app vào routes chính của Client và Admin trước ta đặt là index.routes
routeClient(app)
routeAdmin(app)

//Cấu hình cho express hiểu đang sử dụng pug
//Và cấu hình thư mục cho templates ở đây là thư mục  Views
app.set("views", `${__dirname}/Views`);
app.set("view engine", "pug");




//Import cấu hình file .env
require("dotenv").config();
//Kết nối vào database
database.connect();

//Tạo cổng cho có là 3000
const port = process.env.PORT

//Cho expres lắng nghe cổng 3000 và chạy cổng
app.listen(port, () => {
  console.log("ok",`${__dirname}/Public`)
  console.log(`Example app listening on port ${port}`)
})