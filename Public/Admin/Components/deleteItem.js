function DeleteItem() {

    const buttonDelete = document.querySelectorAll(`[button-delete]`);
    if (buttonDelete.length > 0) {
        const formDelete = document.querySelector("#form-delete-status");
        const path = formDelete.getAttribute("data-path");
        buttonDelete.forEach(button => {
            button.addEventListener("click", () => {
                console.log("ok")
                const isComfirm = confirm("Bạn Có Chắc Muốn Xóa Sản Phẩm Này?")
                if (isComfirm) {
                    const id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=DELETE`;
                    formDelete.action = action;
                    formDelete.submit();
                }
            })
        })
    }
}
DeleteItem()