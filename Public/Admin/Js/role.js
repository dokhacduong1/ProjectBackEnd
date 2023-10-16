const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
    const buttonSubmit = document.querySelector("[ button-submit]")
    buttonSubmit.addEventListener("click",()=>{
        let permissions = [];
        //Lấy ra các rows của role có rất nhiều row chuyển nó về array
        const rows = tablePermissions.querySelectorAll("[data-name]");
        //Duyệt tất cả cá row đó
        rows.forEach((dataMap)=>{
            //từ row lấy input của từng rows
            const inpust = Array.from(dataMap.querySelectorAll("input"));
            //Ta sẽ lấy được name từ các row đó
            const name = dataMap.getAttribute("data-name")
            if(name === "id"){
                //Nếu name là id ta sẽ cho cái permissions = cái mảng input chứa value là id xong thêm một mảng permissions rỗng
               permissions=inpust.map(data=>({id:data.value,permissions:[]}))
            }else{
                //Còn nếu không phải thì push cái name đó vào đúng index để lấy các ô người dùng đã chọn
                inpust.forEach((data,index)=>data.checked && permissions[index].permissions.push(name))
            }
        })
       const jsonSend = JSON.stringify(permissions)
     
       const formSend = document.querySelector("#form-change-permissions");
       const inputFomrSend = formSend.querySelector("[name=permissions]")
       inputFomrSend.value = jsonSend
       formSend.submit()
     
       
    }
    )
}


//Hiện Data ra giao diện
    const dataRecord = document.querySelector("[data-records]");
    if(dataRecord){
        const records = JSON.parse(dataRecord.getAttribute("data-records"));
        records.map((dataMap,index)=>{
            const permissions = dataMap.permissions
            //Nếu ô input nào có checked bằng true thì gán truy  cho nó
            permissions.map(data=>
                document.querySelectorAll(`[data-name=${data}] input`)[index].checked =true
            )
        })
    }
//End