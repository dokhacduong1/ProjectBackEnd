const Chat = require("../../Models/chat.model")
const User = require("../../Models/user.model")
//[GET] /chat
module.exports.index = async function (req, res){
    const userId = res.locals.userClient.id
    const fullName = res.locals.userClient.fullName
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE",async (content)=>{
            const chat = new Chat({
                content:content,
                user_id:userId
            })
            await chat.save()
            _io.emit("SERVER_RETURN_MESSAGE",{
                userId:userId,
                fullName:fullName,
                content:content
                
            })
        })       
        
      });
    //Lấy data từ database ra ngoài giao diện
    const chats = await Chat.find({
        deleted:false
    })
   
    const listUser = await User.find({ deleted:false }).select("fullName")
    chats.forEach(dataMap=>{
        const checkName = listUser.filter(dataFilter=>dataFilter.id === dataMap.user_id)
        dataMap.infoUser = checkName[0]
    })
    res.render("Client/Pages/Chat", {
        title: "Chat",
        chats:chats
      });
}