function BoxSort() {
    const sortDiv = document.querySelector("[sort]")
    if (sortDiv) {
        let url = new URL(window.location.href);
        const sortSelect = sortDiv.querySelector("[sort-select]") ;
        const sortClear = sortDiv.querySelector("[sort-clear]");
       
        //Nếu select người dùng chọn thì thực hiện set lại url
        sortSelect.addEventListener("change", (e) => {
            const [key, value] = e.target.value.split("-");
            url.searchParams.set("sortKey", key);
            url.searchParams.set("sortValue", value);
            window.location.href = url;

        })
        //Nếu người dùng click nút clear thì xóa tất cả dạng sort đi
        sortClear.addEventListener("click", () => {
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");
            window.location.href = url;
        })

        //Đoạn này sẽ check xem người dùng đang chọn option gì và sẽ cho slected bằng true cái option đó
        const getSortKey = url.searchParams.get("sortKey") || 'position';
        const getSortValue = url.searchParams.get("sortValue") || 'desc';
        const textConvertKey  = `${getSortKey}-${getSortValue}`;
        const optionSlect = sortDiv.querySelector(`option[value=${textConvertKey}]`);
        optionSlect.selected =true;
    }
}
BoxSort()