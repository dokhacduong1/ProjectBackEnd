const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const configCloud = require("../Config/cloudinary")
//Set config cho nó
cloudinary.config(configCloud.configCloudinary);

const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });

        streamifier.createReadStream(buffer).pipe(stream);
    });
};
module.exports.uploadSingle = async (buffer) => {
    const result = await streamUpload(buffer);
    return result.secure_url;
}
module.exports.uploadMultiple  = async (arrayBuffer) => {
    const result = [];
    for(let buffer of arrayBuffer){
        const link = await streamUpload(buffer);
        result.push(link.secure_url)
    }
    return result;
}
