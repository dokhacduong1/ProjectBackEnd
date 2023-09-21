function PreviewImageSingle() {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    if (uploadImageInput) {
        uploadImageInput.addEventListener("change", (e) => {
            const divImg = document.querySelector(".box-image-preview")
            const boxImg = document.querySelector(".image-preview")
            //Check xem có nút x không thì xóa
            const close = divImg.querySelector("h1")
            if (close) close.remove()

            //Lấy phần tử cha của thẻ input file
            const uploadImageForm = e.target.parentNode

            //Lấy ra file ảnh up lên
            const fileImage = e.target.files[0]

            //Truyền file ảnh vừa up lên vào src
            boxImg.src = URL.createObjectURL(fileImage)

            //Tạo thẻ close là h1
            const buttonClose = document.createElement("h1")
            buttonClose.innerHTML = "X"

            divImg.appendChild(boxImg)
            divImg.appendChild(buttonClose)
            uploadImageForm.appendChild(divImg)

            buttonClose.addEventListener("click", () => {
                uploadImageInput.value = ""
                boxImg.src = ""
                buttonClose.remove()
            })
        })
    }
}
PreviewImageSingle()