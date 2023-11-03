import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// file upload wwith preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6
});
//end file upload wwith preview

function scrollToBottom() {
    //Scroll Chat To botttom
    const bodyChat = document.querySelector(".chat .inner-body");
    if (bodyChat) {
        bodyChat.scrollTop = bodyChat.scrollHeight;
    }
    //End Scroll Chat To botttom
}
function showTypingChat() {
    socket.emit("CLIENT_SEND_TYPING", "show")
    //Clear timeout để đảm báo đến cuối cùng dừng hẳn ko gõ nó mới clea typing đi
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hiden")
    }, 3000)
}
function previewImage() {
    //Preview Full Image
    const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
    if (bodyChatPreviewImage) {
        const gallery = new Viewer(bodyChatPreviewImage);
    }

    //End Preview Full Image

}
scrollToBottom()
previewImage()

//Client_Send_Message
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements?.content?.value
        const images = upload.cachedFileArray;
        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });
            socket.emit("CLIENT_SEND_TYPING", "hiden");
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
        }
    })
}

//End Client_Send_Message


// ---------Show Icon Chat---------

//Show Poput
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip)
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
//End Show Poput

//Insert icon To Input
var typingTimer;
const emojPicker = document.querySelector('emoji-picker')
if (emojPicker) {
    const inputChat = document.querySelector(".chat .inner-form textarea[name='content']")

    emojPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode;
        inputChat.value = inputChat.value + icon;
        //Khi click ra vào icon vẫn đảm bảo con trỏ ở input vẫn ở cuối
        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();
        showTypingChat();
    })
    //Input Keyup
    inputChat.addEventListener("keyup", () => {
        showTypingChat()
    })
}
// EndInsert icon To Input

// ---------End Show Icon Chat---------


