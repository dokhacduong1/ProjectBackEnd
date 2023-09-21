//Phân Trang
function Pagination() {
    let url = new URL(window.location.href);
    //Đoạn này thao tác cho người dùng nhấn next hoặc chuyển trang gì đó
    const buttonPagination = document.querySelectorAll("[button-pagination]");
    buttonPagination.forEach(button => {
        button.addEventListener("click", (e) => {
            const page = button.getAttribute("button-pagination")
            if (page) {
                url.searchParams.set("page", page);
            } else {
                url.searchParams.delete("page");
            }
            window.location.href = url
        })
    });

    //Đoạn này thao tác cho người dùng muốn nhập số trang
    const buttonPaginationInput = document.querySelectorAll("[button-pagination-input]")
    buttonPaginationInput.forEach(input => {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                const totalPage = parseInt(input.getAttribute("total-page"))
                const page = parseInt(input.value)
                if (page && totalPage >= page && page > 0) {
                    url.searchParams.set("page", page);
                } else {
                    url.searchParams.delete("page");
                }
                window.location.href = url
            }
        });
    })
}
//End
Pagination()