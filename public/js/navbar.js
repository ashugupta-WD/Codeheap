let hamBtn = document.getElementById("ham");
let hamOn = false;

document.onclick = (event) => {
    if (event.target.id !== `ham` && event.target.id !== `bar` && event.target.id !== `menu`) {
        hamBtn.classList.remove("open");
        hamOn = false;
        document.getElementsByClassName("menuContent")[0].classList.remove("menuOpen");
        document.body.style.overflowY = 'visible';
    }
}

function hamOpen() {
    if (!hamOn) {
        hamBtn.classList.add("open");
        document.getElementsByClassName("menuContent")[0].classList.add("menuOpen");
        document.body.style.overflowY = 'hidden';
        hamOn = true;
    } else {
        hamBtn.classList.remove("open");
        document.getElementsByClassName("menuContent")[0].classList.remove("menuOpen");
        document.body.style.overflowY = 'visible';
        hamOn = false;
    }
}

function dismissAlert() {
    setTimeout(() => {
        document.getElementsByClassName(`alert`)[0].style.display = "none";
    }, 5000);
}

window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById(`backToTopBtn`).style.display = "flex";
    } else {
        document.getElementById(`backToTopBtn`).style.display = "none";
    }
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}