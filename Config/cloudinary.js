//Import cấu hình file .env
require("dotenv").config();
const CONFIG = {
    cloud_name: process.env.CLOUD_NAME,
    api_key:  process.env.CLOUD_KEY,
    api_secret:  process.env.CLOUD_SECRET
}

module.exports = {
    configCloudinary: CONFIG
}