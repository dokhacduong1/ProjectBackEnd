import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//Client_Send_Message
const formSendData = document.querySelector(".chat .inner-form")
formSendData.addEventListener("submit", (e) => {
    e.preventDefault()
    const content = e.target.elements?.content?.value
    if (content) {
        socket.emit("CLIENT_SEND_MESSAGE", content);
        e.target.elements.content.value = "";
    }
})
//End Client_Send_Message

// /SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body")
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    if (body) {
        const div = document.createElement("div")
        let innerClass = ""
        let boxFullName = ""
        if (myId !== data.userId) {
            innerClass = "inner-incoming"
            boxFullName = `<div class="inner-name">${data.fullName}</div>`

        } else {
            innerClass = "inner-outgoing"

        }
        div.classList.add(innerClass);
        div.innerHTML = `
         ${boxFullName}
         <div class="inner-content">${data.content}</div>
        `
        body.appendChild(div);
        body.scrollTop = bodyChat.scrollHeight;
    }

})
//End SERVER_RETURN_MESSAGE


//Scroll Chat To botttom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
//End Scroll Chat To botttom


// Show Icon Chat
    //Show Poput
const buttonIcon = document.querySelector(".button-icon");
if(buttonIcon){
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip)
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
    //End Show Poput

    //Insert icon To Input
    const emojPicker = document.querySelector('emoji-picker')
    if(emojPicker){
        const inputChat = document.querySelector(".chat .inner-form input[name='content']")
        console.log(inputChat)
        emojPicker.addEventListener("emoji-click",(e)=>{
            const icon  = e.detail.unicode
            inputChat.value = inputChat.value+icon
        })

        //Input Keyup
        inputChat.addEventListener("keyup",()=>{
            socket.emit("CLIENT_SEND_TYPING","show")
        })
    }
    // EndInsert icon To Input
// End Show Icon Chat


//Server_retun_Typing
socket.on("SERVER_RETURN_TYPING", (data) => {
    const listTyping = document.querySelector(".inner-list-typing");
    if(listTyping){
        const div = document.createElement("div");
        div.classList.add("box-typing")
        const html =`
            <div class="inner-name">${data.fullName}</div> 
            <div class="inner-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>

        `
        div.innerHTML=html;
        listTyping.appendChild(div)
    }
})
//End Typing

