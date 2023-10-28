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
        body.appendChild(div)
    }

})
//End SERVER_RETURN_MESSAGE