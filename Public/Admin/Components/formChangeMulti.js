function FormChangeMulti() {
    const formChangeMulti = document.querySelector("[form-change-multi]");
    if (formChangeMulti) {
        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        formChangeMulti.addEventListener("submit", (e) => {
            e.preventDefault()
            const inputChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");
            const inputValue = formChangeMulti.querySelector("input[name='ids']")
            const typeChange = e.target.elements.type.value;

            //Nếu typeChange = delete-all và cofirm = false nghĩa là không muốn xóa thì return luôn
            if (typeChange === "delete-all" && !confirm("Bạn Có Muốn Xóa Những Sản Phẩm Này ?")) return;

            //Array from là chuyển đổi các phần html sang một mảng
            const ids = Array.from(inputChecked).map(input => {
                const id = input.value
                //input.closest() lấy giá trị cha của input cụ thể là tr
                const position = input.closest("tr").querySelector("input[name='position']")?.value || "";
                //nếu type = change-position thì ta cộng thêm position đằng sau không thì thôi
                const stringId = typeChange === "change-position" ? `${id}-${position}` : `${id}`
                return stringId
            });

            if (ids.length > 0) {
                inputValue.value = ids
                formChangeMulti.submit()
                return
            }
            alert("Vui Lòng Tích Vào Ô")

        })
    }
}
FormChangeMulti()