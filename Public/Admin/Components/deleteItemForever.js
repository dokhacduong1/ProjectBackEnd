function DeleteItemForever() {
    const buttonDeleteForever = document.querySelectorAll(`[button-delete-forever]`);
    if (buttonDeleteForever.length > 0) {
        const formDeleteForeVer = document.querySelector("#form-delete-forever-status");
        const path = formDeleteForeVer.getAttribute("data-path");
        buttonDeleteForever.forEach(button => {
            button.addEventListener("click", () => {
                const isComfirm = confirm("Bạn Có Chắc Muốn Xóa Vĩnh Viễn Sản Phẩm Này?")
                if (isComfirm) {
                    const collectionName = button.getAttribute("collection");
                    const id = button.getAttribute("data-id");
                    const action = `${path}/${id}/${collectionName}?_method=DELETE`;
                    formDeleteForeVer.action = action;
                    formDeleteForeVer.submit();
                }
            })
        })
    }
}
DeleteItemForever()