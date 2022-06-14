let currentSnippet = 0;

function switchSnippet(index) {
    currentSnippet = index;
    for (let i = 0; i < 3; i++) {
        document.getElementsByClassName('codeContainer')[i].classList.remove('displaySnippet');
        document.getElementsByClassName('snippet')[i].classList.remove('activeSnippet');
    }
    document.getElementsByClassName('snippet')[index].classList.add('activeSnippet');
    document.getElementsByClassName('codeContainer')[index].classList.add('displaySnippet');
}

function copySnippet() {
    let copyText = document.getElementsByClassName("codeContainer")[currentSnippet];
    navigator.clipboard.writeText(copyText.innerText);
    document.getElementsByClassName('alert')[0].style.display = "block";
    setTimeout(() => {
        document.getElementsByClassName('alert')[0].style.display = "none";
    }, 3000);
}