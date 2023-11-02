
function scrollToBottom() {
    //Scroll Chat To botttom
    const bodyChat = document.querySelector(".chat .inner-body");
    if (bodyChat) {
        bodyChat.scrollTop = bodyChat.scrollHeight;
    }
    //End Scroll Chat To botttom
}
scrollToBottom()

// /SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body")
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const listTyping = document.querySelector(".chat .inner-list-typing");
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
        body.insertBefore(div,listTyping);
        scrollToBottom();
    }

})
//End SERVER_RETURN_MESSAGE



//Server_retun_Typing

socket.on("SERVER_RETURN_TYPING", (data) => {
    const listTyping = document.querySelector(".chat .inner-list-typing");
    if (listTyping) {
       
        const userIdCheck = document.querySelector(`[user-id= "${data.userId}"]`)
        if (data.type === "show") {         
            //Nếu có cái user id thì ko appendChild đoạn chat vào nữa
            if (!userIdCheck) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId)
                boxTyping.innerHTML = `
                    <div class ="inner-name">
                        ${data.fullName}
                    </div>
                    <div class = "inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>`
                listTyping.appendChild(boxTyping)
            }

        } else {
           
            if (userIdCheck) {
                listTyping.removeChild(userIdCheck)
            }
        }
        scrollToBottom();

    }



})
//End Typing

