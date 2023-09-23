const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const configCloud = require("../../Config/cloudinary")
//Set config cho nó
cloudinary.config(configCloud.configCloudinary);

//Hàm này sử lý logic
module.exports.uplload = async (req, res, next) => {
    if (req.file) {
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        try {
            const result = await streamUpload(req);
            //req.file.fieldname nó lấy cái key là thumnail
            req.body[req.file.fieldname] = `${result.secure_url}`

        } catch (error) {
            console.error(error);
        }
    }
    next()
}