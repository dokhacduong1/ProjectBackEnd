const multer = require('multer')
module.exports = ()=>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './Public/Uploads')
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now()
          cb(null, `${file.originalname}-${uniqueSuffix}.jpg`)
        }
      })
      return storage
}