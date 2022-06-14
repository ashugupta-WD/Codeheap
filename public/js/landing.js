const slide = document.querySelector('.cardBox');
let slides = document.querySelectorAll('.card');
let index = 0;

const startSlide = () => {
    setInterval(() => {
        slide.style.transform = `translateX(-${index + 1}00%)`;
        slide.style.transition = 'all 1s ease-in'
        index++;
    }, 5000);
}

slide.addEventListener('transitionend', () => {
    let mySlides = document.getElementsByClassName('card');
    try {
        if (mySlides[index].id == "first-clone") {
            setTimeout(() => {
                index = 0;
                slide.style.transition = 'none';
                slide.style.transform = `translateX(0%)`;
            }, 1000);
        }

    } catch (error) {
        if (index > 3) {
            index = 0;
            slide.style.transition = 'none';
            slide.style.transform = `translateX(0%)`;
        }
    }
});
startSlide();

let sectionList = [];
for (let index = 0; index < 5; index++) {
    sectionList.push(document.getElementsByTagName('section')[index].offsetTop - 200);
}
let navLi = document.getElementsByClassName('link');
let menuLi = document.getElementById('menu').getElementsByTagName('a');

window.onscroll = () => {
    scrollFunction();
    if (pageYOffset >= 0 && pageYOffset < sectionList[1] - 48) {
        for (let index = 0; index < 5; index++) {
            navLi[index].classList.remove('link-active');
            menuLi[index].classList.remove('active');
        }
        navLi[0].classList.add('link-active');
        menuLi[0].classList.add('active');
    } else
        if (pageYOffset >= sectionList[1] && pageYOffset < sectionList[2] - 48) {
            for (let index = 0; index < 5; index++) {
                navLi[index].classList.remove('link-active');
                menuLi[index].classList.remove('active');
            }
            navLi[1].classList.add('link-active');
            menuLi[1].classList.add('active');

        } else
            if (pageYOffset >= sectionList[2] - 48 && pageYOffset < sectionList[3] - 48) {
                for (let index = 0; index < 5; index++) {
                    navLi[index].classList.remove('link-active');
                    menuLi[index].classList.remove('active');
                }
                navLi[2].classList.add('link-active');
                menuLi[2].classList.add('active');

            } else
                if (pageYOffset >= sectionList[3] - 48 && pageYOffset < sectionList[4] - 48) {
                    for (let index = 0; index < 5; index++) {
                        navLi[index].classList.remove('link-active');
                        menuLi[index].classList.remove('active');
                    }
                    navLi[3].classList.add('link-active');
                    menuLi[3].classList.add('active');
                } else if (pageYOffset >= sectionList[4]) {
                    for (let index = 0; index < 5; index++) {
                        navLi[index].classList.remove('link-active');
                        menuLi[index].classList.remove('active');
                    }
                    navLi[4].classList.add('link-active');
                    menuLi[4].classList.add('active');
                }
}

