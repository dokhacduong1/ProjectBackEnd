const Chat = require("../../Models/chat.model")
module.exports.linkSocket = async (res) => {
    const userId = res.locals.userClient.id
    const fullName = res.locals.userClient.fullName
    _io.once('connection', (socket) => {
        // Lưu vào database
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            console.log(content)
            const chat = new Chat({
                content: content,
                user_id: userId
            })
            await chat.save()
            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
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