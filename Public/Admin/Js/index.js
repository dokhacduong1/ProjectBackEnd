import { CheckBox } from "../Components/checkBox.js";
import { DeleteItem } from "../Components/deleteItem.js";
import { DeleteItemForever } from "../Components/deleteItemForever.js";
import { FilterItem } from "../Components/filterItem.js";
import { FormChangeMulti } from "../Components/formChangeMulti.js";
import { Pagination } from "../Components/pagination.js";
import { PreviewImageSingle } from "../Components/previewImageSingle.js";
import { RestoreItem } from "../Components/restoreItem.js";
import { SearchItem } from "../Components/searchItem.js";
import { ShowAlert } from "../Components/showAlert.js";
//Khối này sẽ lọc sản phẩm bằng bộ lọc
FilterItem()

//Khoois này sẽ tìm kiếm sản phẩm theo từ khóa
SearchItem()

//Khối này sẽ phân trang
Pagination()

//Khối này sẽ là checkbox
CheckBox()

//Khối này sẽ sử lý khi submit fomrChangeMulti
FormChangeMulti()

//Hàm này sẽ sử lý khi người dùng muốn xóa mềm item nào đó (Xóa mềm là không xóa hẳn khỏi Database)
DeleteItem()

//Hàm này có tác dụng khôi phục lại item đã xóa mềm 
RestoreItem()

//Hàm này có tác dụng xóa cứng item nào đó (Xóa cứng là xóa vĩnh viễn khỏi Database)
DeleteItemForever()

//Hàm này có tác dụng sử lý khi có thông báo
ShowAlert()

//Hàm này là sẽ hiện ảnh khi upload
PreviewImageSingle()