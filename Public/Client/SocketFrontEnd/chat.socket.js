
function scrollToBottom() {
    //Scroll Chat To botttom
    const bodyChat = document.querySelector(".chat .inner-body");
    if (bodyChat) {
        bodyChat.scrollTop = bodyChat.scrollHeight;
    }
    //End Scroll Chat To botttom
}
function previewImage(images) {
    //Preview Full Image
    if (bodyChatPreviewImage) {
        const gallery = new Viewer(images);
    }

    //End Preview Full Image

}
scrollToBottom()

// /SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body");
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const listTyping = document.querySelector(".chat .inner-list-typing");
    if (body) {
        const div = document.createElement("div");
        //Check xem đúng user không
        const isOutgoing = myId === data.userId;
        //Nếu đúng user đang sử dụng thì addClass inner-outgoing
        const innerClass = isOutgoing ? "inner-outgoing" : "inner-incoming";
        const boxFullName = isOutgoing ? "" : `<div class="inner-name">${data.fullName}</div>`;
        const innerContent = data.content ? `<div class="inner-content">${data.content}</div>` : "";
        const innerImages = data.images.length > 0 ? `
            <div class="inner-images">
                ${data.images.map(dataMap => `<img src="${dataMap}"></img>`).join("")}
            </div>` : "";

        div.classList.add(innerClass);
        div.innerHTML = `
            ${boxFullName}
            ${innerContent}
            ${innerImages}
        `;
        body.insertBefore(div, listTyping);
        scrollToBottom();
        const gallery = new Viewer(div);
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
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML = `
                    <div class ="inner-name">
                        ${data.fullName}
                    </div>
                    <div class = "inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>`;
                listTyping.appendChild(boxTyping);
            }

        } else {
            if (userIdCheck) {
                listTyping.removeChild(userIdCheck);
            }
        }
        scrollToBottom();
    }
})
//End Typing

