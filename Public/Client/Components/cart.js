const inputQuantity = document.querySelectorAll("input[name='quantity']")
if (inputQuantity.length > 0) {
    inputQuantity.forEach(element => {
        element.addEventListener("change",async (e) => {
            const productId = element.getAttribute("item-id")
            const quantity = element.value
            window.location.href=`/cart/update/${productId}/${quantity}`
            
        })
    })
}