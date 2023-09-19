module.exports = (query) => {
    //Tạo một block filter để in ra giao diện
    let filterStatus = [
        {
            name: "Tất Cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt Động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng Hoạt Động",
            status: "inactive",
            class: ""
        },
    ]
     //Check nút bấm xem có đang active không
     const index = filterStatus.findIndex(dataFind => dataFind.status === query);
     filterStatus[index].class = "active"
     return filterStatus
}
