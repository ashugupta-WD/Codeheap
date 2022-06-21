function copySnippet() {
    let copyText = document.getElementsByClassName("codeContainer")[0];
    navigator.clipboard.writeText(copyText.innerText);
    document.getElementsByClassName('alert')[0].style.display = "block";
    setTimeout(() => {
        document.getElementsByClassName('alert')[0].style.display = "none";
    }, 3000);
}