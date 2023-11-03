const Chat = require("../../Models/chat.model")
const uploadToCloudinary = require("../../Helpers/uploadToCloudinary")
module.exports.linkSocket = async (res) => {
    const userId = res.locals.userClient.id
    const fullName = res.locals.userClient.fullName
    _io.once('connection', (socket) => {
        // Lưu vào database
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const { content, images } = data
            const arrayImages = await uploadToCloudinary.uploadMultiple(images)
            const chat = new Chat({
                content: content,
                user_id: userId,
                images: arrayImages

            })
            await chat.save()
            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content,
                images: arrayImages
            })
        })


        //Typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {

            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        })
        //End Typing


    });
}