module.exports = (countProducts,checkPage,limiItem)=>{
        //Khai báo biến phân trang
        let objectPagination = {
            //Nếu checkPage không có nó sẽ là 1
            currentPage: parseInt(checkPage) || 1,
            limitItem : limiItem,
        }
            //Thêm skip cho phân trang 
        objectPagination.skip  =(objectPagination.currentPage-1)*objectPagination.limitItem
            //Tính số Page sản phẩm cho trang
        const totalPage  = Math.ceil(countProducts/objectPagination.limitItem)
        objectPagination.totalPage = totalPage
        return objectPagination
}