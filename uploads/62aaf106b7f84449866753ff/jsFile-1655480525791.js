let txt = document.getElementById(`typeText`);
        testStr = document.getElementById(`orgText`).innerHTML;
        let progress = document.getElementsByClassName("progress");
        let num = document.getElementById(`num`);
        let wordCount = 0;
        let charCount = 0;
        let mistakes = 0;
        let accuracy = 0;
        let wpm = 0;
        function typeMaster(event) {
            let c = event.keyCode;
            let str = txt.value;
            charCount = str.length;
            wordCount = 0;
            let doscroll = false;
            document.getElementById(`countC`).innerHTML = str.length;
            if (str.length == 0) {
                document.getElementById(`orgText`).innerHTML = testStr.replace(testStr[0], `<span style="color: #9e9e9e;">${testStr[0]}</span>`);
                document.getElementById(`orgText`).scrollTo(0, 0);
            }

            function checkTest() {
                for (let i = 0; i < str.length; i++) {
                    if (str[i] != testStr[i]) {
                        document.getElementById(`countC`).innerHTML = i;
                        mistakes++;
                        return i;
                    }
                    else {
                        document.getElementById(`orgText`).innerHTML = testStr.replace(testStr.slice(0, i + 1), `<span style="color: white;">${testStr.slice(0, i + 1)}</span>`);
                        doscroll = true;
                    }
                }
                return -1;
            }

            let wrongIndex = checkTest();

            if (wrongIndex != -1) {
                txt.value = str.slice(0, wrongIndex + 1);
                document.getElementById(`orgText`).innerHTML = testStr.replace(testStr.slice(0, wrongIndex + 1), `<span style="color: white;">${testStr.slice(0, wrongIndex)}</span><span style="color: red;">${testStr[wrongIndex]}</span>`);
                return;
            }

            for (let i = 0; i < str.length; i++) {
                if (str[i] == " " || str[i] == "." || str[i] == ",") {
                    if (str[i - 1] == "." || str[i - 1] == ",") {
                        continue;
                    }
                    else {
                        wordCount++;
                    }
                }
            }

            if (doscroll) {
                let moved = document.getElementById(`orgText`).clientWidth;
                if (c == 8) {
                    if (moved < 400) {
                        document.getElementById(`orgText`).scrollTo(str.length * 11, 0);
                    }
                    else {
                        document.getElementById(`orgText`).scrollTo(str.length * 12, 0);
                    }
                }
                else {
                    if (c == 32 || (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || c == 188 || c == 190) {
                        if (moved < 400) {
                            document.getElementById(`orgText`).scrollLeft += 11;
                        }
                        else {
                            document.getElementById(`orgText`).scrollLeft += 12;
                        }
                    }
                }
            }
            document.getElementById(`countW`).innerHTML = wordCount;
        }

        function timer() {
            let setItr = setInterval(() => {
                let min = document.getElementById("min").innerHTML;
                let sec = document.getElementById("sec").innerHTML;
                if (Number(sec) == 0) {
                    min = 0;
                    sec = 60;
                }
                sec--;
                document.getElementById("min").innerHTML = min;
                if (sec < 10) {
                    document.getElementById("sec").innerHTML = String(sec).padStart(2, 0);
                }
                else {
                    document.getElementById("sec").innerHTML = sec;
                }
                if (Number(min) == 0 && Number(sec) == 0) {
                    clearInterval(setItr);
                    document.getElementById("output").style.display = "flex";
                    document.getElementById(`typeText`).disabled = true;
                    txt.removeAttribute("onkeyup");
                    charCount = document.getElementById(`countC`).innerHTML;
                    charCount = Number(charCount);
                    wordCount = document.getElementById(`countW`).innerHTML;
                    wordCount = Number(wordCount);
                    wpm = Math.ceil(wordCount / 1.5);
                    document.getElementById(`wpm`).innerHTML = wpm;
                    accuracy = (charCount / (mistakes + charCount)) * 100;
                    if (accuracy == NaN) {
                        accuracy = 0;
                    }
                    document.getElementById(`accuracy`).innerHTML = accuracy.toFixed(2);
                }
            }, 1000);
        }

        function countdown() {
            document.getElementById(`start`).style.display = "none";
            document.getElementById(`countdown`).style.display = "flex";
            let count = setInterval(() => {
                let sec = num.innerHTML;
                startCountDown();
                if (sec == 1) {
                    num.innerHTML = "GO!";
                    clearInterval(count);
                    setTimeout(() => {
                        document.getElementById(`container`).style.display = "flex";
                        document.getElementById("typeText").focus();
                        document.getElementById(`countdown`).style.display = "none";
                        document.getElementById(`welcome`).style.display = "none";
                        timer();
                        num.innerHTML = 3;
                    }, 1200);
                    return;
                }
                sec--;
                num.innerHTML = sec;
            }, 1050);
        }

        function startCountDown() {
            progress[0].classList.add("activeleft");
            progress[1].classList.add("activeright");
            progress[1].addEventListener("webkitAnimationEnd", () => {
                progress[0].classList.remove("activeleft");
                progress[1].classList.remove("activeright");
            });
        }