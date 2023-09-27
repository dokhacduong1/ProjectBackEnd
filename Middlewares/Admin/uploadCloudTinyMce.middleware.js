const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const configCloud = require("../../Config/cloudinary")
//Set config cho nó
cloudinary.config(configCloud.configCloudinary);

//Hàm này sử lý logic
module.exports.uplload = async (req, res, next) => {
    let result ="";
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
            const data = await streamUpload(req);
            result = data.secure_url

        } catch (error) {
            result = "ERROR"
        }
        return res.json({url:result});
    }

}