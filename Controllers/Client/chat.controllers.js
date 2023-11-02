const Chat = require("../../Models/chat.model")
const User = require("../../Models/user.model")
const socketSend = require("../../SocketBackEnd/Client/chat.socket")
//[GET] /chat
module.exports.index = async function (req, res) {
    await socketSend.linkSocket(res);
    //Lấy data từ database ra ngoài giao diện
    const chats = await Chat.find({
        deleted: false
    })

    const listUser = await User.find({ deleted: false }).select("fullName")
    chats.forEach(dataMap => {
        const checkName = listUser.filter(dataFilter => dataFilter.id === dataMap.user_id)
        if(checkName[0].fullName){
            dataMap.infoUser = checkName[0]
        }
       
    })  
    res.render("Client/Pages/Chat", {
        title: "Chat",
        chats: chats
    });
}