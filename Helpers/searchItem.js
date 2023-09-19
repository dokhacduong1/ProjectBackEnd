module.exports = (query)=>{
     //Tạo mỗi chuỗi regex nó có tác dụng tìm chuỗi keyword không phân biệt chữ hoa chữ thường
        //Nói chung nó sẽ tìm kiếm tương đương
    const regex = new RegExp(query,"i");
    return regex
}