const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {

    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
    tx[i].addEventListener("input", OnInput, false);
    tx[i].addEventListener("keyup", OnInput, false);
}

function OnInput() {

    if (this.scrollHeight >= 48) {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    } else if (this.scrollHeight <= 46) {
        if (this.style.height !== "40px") {
            this.style.height = "40px"
        }
    }
}

