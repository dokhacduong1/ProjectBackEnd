const uploadToCloudinary = require("../../Helpers/uploadToCloudinary")
//Hàm này sử lý logic
module.exports.uplload = async (req, res, next) => {
    if (req.file) {
        try {
            const link = await uploadToCloudinary.uploadSingle(req.file.buffer);
            //req.file.fieldname nó lấy cái key là thumnail
            req.body[req.file.fieldname] = link;
        } catch (error) {
            console.error(error);
        }
    }
    next()
}