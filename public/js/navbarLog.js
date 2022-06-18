let hamSwitch = false;
let profileSwitch = false;


document.onclick = (event) => {
    if (event.target.id !== `navbarSupportedContent` && event.target.id !== `navbar-nav` && event.target.id !== `bar` && event.target.id !== `bar2`) {
        document.getElementsByClassName('bar')[0].classList.remove('hamOpen');
        document.getElementsByClassName('navbar-collapse')[0].classList.remove('show');
        document.body.style.overflowY = 'visible';
        hamSwitch = false;
    }
}

function hamAnimation() {
    if (!hamSwitch) {
        document.getElementById(`profileSupportedContent`).classList.remove('showProfileContent');
        profileSwitch = false;
        document.getElementsByClassName('bar')[0].classList.add('hamOpen');
        hamSwitch = true;
        document.body.style.overflowY = 'hidden';
    }
    else {
        document.getElementsByClassName('bar')[0].classList.remove('hamOpen');
        hamSwitch = false;
        document.body.style.overflowY = 'visible';
    }
}

function openProfile() {
    if (!profileSwitch) {
        document.getElementsByClassName('bar')[0].classList.remove('hamOpen');
        hamSwitch = false;
        document.getElementById(`profileSupportedContent`).classList.add('showProfileContent');
        profileSwitch = true;
        document.body.style.overflowY = 'hidden';
    }
    else {
        document.getElementById(`profileSupportedContent`).classList.remove('showProfileContent');
        profileSwitch = false;
        document.body.style.overflowY = 'visible';
    }
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
