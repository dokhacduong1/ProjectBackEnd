export function RestoreItem() {
    const buttonRestore = document.querySelectorAll(`[button-restore]`);
    if(buttonRestore.length>0){
        const formRestore= document.querySelector("#form-restore-status");
        const path = formRestore.getAttribute("data-path");
        buttonRestore.forEach(button=>{
            button.addEventListener("click",()=>{
                const isComfirm = confirm("Bạn Có Muốn Khôi Phục Sản Phẩm Này?")
                if(isComfirm){
                    const id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=PATCH`;
                    formRestore.action =action;
                    formRestore.submit();
                }
            })
        })
    }
}