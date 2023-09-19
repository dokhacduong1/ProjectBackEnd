//Form Tìm Kiếm
export function SearchItem(){
    const formSearch = document.querySelector("#form-search");
    if(formSearch){
        let url = new URL(window.location.href);
        formSearch.addEventListener("submit",(e)=>{
            e.preventDefault();
            const keyword = e.target.elements.keyword.value
            if(keyword){
                url.searchParams.set("keyword",keyword)
            }else{
                url.searchParams.delete("keyword")
            }
           window.location.href =url
        })
    }
}
//End