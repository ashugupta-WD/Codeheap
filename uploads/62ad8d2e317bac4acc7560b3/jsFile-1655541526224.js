const canvas = document.getElementById(`analogueClock`);
const ctx = canvas.getContext(`2d`);
let stopWatchTime;
let radius = canvas.height / 2;
ctx.translate(radius, radius);
ctx.shadowBlur = 3;
ctx.shadowOffsetY = 6;
ctx.shadowColor = "black";
radius = radius * 0.85;
let setAlarmHour = -1;
let setAlarmMinute = -1;
let setAlarmMeridian = -1;
let timeAlarm;
let timeClock;

clockAppHome();

function clockAppHome() {
    timeClock = setInterval(drawClock, 1000);
    document.querySelector(`.analogueClockHome`).style.display = "flex";
    document.getElementById(`alarmClock`).style.display = "none";
    document.getElementById(`digitalClock`).style.display = "flex";
    document.getElementById(`SWButtons`).style.display = "none";
    document.getElementById(`stopWatch`).style.display = "none";
    document.getElementById(`point`).style.display = "none";
    document.querySelector(`.todayDate`).style.display = "flex";
    document.getElementById(`stopWatchHome`).classList.remove("active");
    document.getElementById(`alarmClockHome`).classList.remove("active");
    document.getElementById(`clockHome`).classList.add("active");
}

function stopWatch() {
    clearInterval(timeClock);
    document.querySelector(`.analogueClockHome`).style.display = "flex";
    document.getElementById(`digitalClock`).style.display = "none";
    document.getElementById(`alarmClock`).style.display = "none";
    document.getElementById(`SWButtons`).style.display = "flex";
    document.getElementById(`stopWatch`).style.display = "flex";
    document.getElementById(`point`).style.display = "flex";
    document.querySelector(`.todayDate`).style.display = "none";
    document.getElementById(`stopWatchHome`).classList.add("active");
    document.getElementById(`alarmClockHome`).classList.remove("active");
    document.getElementById(`clockHome`).classList.remove("active");
    drawFace(ctx, radius);
    drawTicks(ctx, radius);
}

function alarmHome() {
    clearInterval(timeClock);
    document.querySelector(`.analogueClockHome`).style.display = `none`;
    document.getElementById(`alarmClock`).style.display = "flex";
    document.getElementById(`digitalClock`).style.display = "none";
    document.getElementById(`SWButtons`).style.display = "none";
    document.querySelector(`.todayDate`).style.display = "none";
    document.getElementById(`stopWatchHome`).classList.remove("active");
    document.getElementById(`alarmClockHome`).classList.add("active");
    document.getElementById(`clockHome`).classList.remove("active");
}

function save() {
    document.querySelector(`.add`).style.display = "flex";
    setAlarmHour = document.getElementById(`alarmHours`).value;
    setAlarmMinute = document.getElementById(`alarmMinutes`).value;
    setAlarmMeridian = document.getElementById(`alarmMeridian`).value;
    document.getElementById(`setAlarmHour`).innerHTML = setAlarmHour;
    document.getElementById(`setAlarmMinutes`).innerHTML = `:${setAlarmMinute}`;
    document.getElementById(`setAlarmMeridian`).innerHTML = `${setAlarmMeridian} Alarm`;
    document.querySelector(`.setAlarmContainer`).style.display = "none";
    timeAlarm = setInterval(checkAlarm, 1000);
}

function checkAlarm() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    hour = hour % 12;
    digiClock(now, hour, minute, second);
    if (setAlarmHour == Number(document.getElementById(`hour`).innerHTML) && (setAlarmMinute == Number(document.getElementById(`minute`).innerHTML)) &&
        (setAlarmMeridian == document.getElementById(`meridian`).innerHTML)) {
        console.log("Alarm On!");
        document.getElementById(`alarmAudio`).play();
        clearInterval(timeAlarm);
    }
}

function cancel() {
    document.querySelector(`.setAlarmContainer`).style.display = "none";
    document.querySelector(`.add`).style.display = "flex";
}

function displayAlarm() {
    document.querySelector(`.setAlarmContainer`).style.display = "flex";
    document.querySelector(`.add`).style.display = "none";
}

function stopWatchStart() {
    document.getElementById(`SWPause`).style.display = "flex";
    document.getElementById(`SWReset`).style.display = "none";
    document.getElementById(`point`).style.animationPlayState = "running";
    let swMinute = Number(document.getElementById(`SWMinute`).innerHTML);
    let swSecond = Number(document.getElementById(`SWSecond`).innerHTML);
    let swMillisecond = Number(document.getElementById(`SWMillisecond`).innerHTML);
    stopWatchTime = setInterval(() => {
        swMillisecond += 10;
        document.getElementById(`SWMillisecond`).innerHTML = String(Math.round(swMillisecond / 10)).padStart(2, 0);
        if (swSecond == 60) {
            swSecond = 0;
            ++swMinute;
        }
        if (swMinute > 9) {
            document.getElementById(`SWMinute`).innerHTML = swMinute;
        }
        else {
            document.getElementById(`SWMinute`).innerHTML = "0" + swMinute;
        }

        if (swMillisecond >= 1000) {
            swMillisecond = 0;
            document.getElementById(`SWSecond`).innerHTML = String(++swSecond).padStart(2, 0);
        }
        else {
            if (swSecond > 9) {
                document.getElementById(`SWSecond`).innerHTML = swSecond;
            }
            else {
                document.getElementById(`SWSecond`).innerHTML = "0" + swSecond;
            }
        }
    }, 10);
}

function stopWatchPause() {
    document.getElementById(`point`).style.animationPlayState = "paused";
    clearInterval(stopWatchTime);
    document.getElementById(`SWReset`).style.display = "flex";
    document.getElementById(`SWPause`).style.display = "none";
}

function stopWatchReset() {
    document.getElementById(`point`).style.animation = "none";
    document.getElementById(`point`).offsetWidth;
    document.getElementById(`point`).style.animation = "rotate 60s linear infinite";
    document.getElementById(`point`).style.animationPlayState = "paused";
    document.getElementById(`SWReset`).style.display = "none";
    document.getElementById(`SWPause`).style.display = "flex";
    document.getElementById(`SWMinute`).innerHTML = `00`;
    document.getElementById(`SWSecond`).innerHTML = `00`;
    document.getElementById(`SWMillisecond`).innerHTML = `00`;
}

function drawClock() {
    drawFace(ctx, radius);
    drawnumbers(ctx, radius);
    drawTicks(ctx, radius);
    drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    let grad = ctx.createRadialGradient(0, 0, radius, 0, 0, 0);
    grad.addColorStop(0, `#00149e`);
    grad.addColorStop(0, `#050d6c`);
    grad.addColorStop(1, `#1b0098`);
    ctx.fillStyle = grad;
    ctx.fill();
}

function drawnumbers(ctx, radius) {
    let ang;
    let num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
        ang = (num * Math.PI) / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillStyle = "white";
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTicks(ctx, radius) {
    let ang;
    let num;
    ctx.font = radius * 0.03 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 61; num++) {
        ang = (num * Math.PI) / 30;
        ctx.rotate(ang);
        if (num < 10) {
            ctx.font = radius * 0.05 + "px arial";
        }
        else {
            ctx.font = radius * 0.03 + "px arial";
        }
        ctx.translate(0, -radius * 0.97);
        ctx.rotate(-ang);
        ctx.fillStyle = "white";
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.97);
        ctx.rotate(-ang);
    }
}

function drawTime() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    hour = hour % 12;
    digiClock(now, hour, minute);
    todayDate(now);
    hour =
        (hour * Math.PI) / 6 +
        (minute * Math.PI) / (6 * 60) +
        (second * Math.PI) / (360 * 60);
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
    drawHand(ctx, minute, radius * 0.7, radius * 0.06);
    second = (second * Math.PI) / 30;
    drawHand(ctx, second, radius * 0.8, radius * 0.02);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.04, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.strokeStyle = "#99d8ff";
    ctx.stroke();
    ctx.rotate(-pos);
}

function digiClock(now, hour, minute) {
    document.getElementById(`hour`).innerHTML = hour.toString().padStart(2, 0);
    document.getElementById(`minute`).innerHTML = minute.toString().padStart(2, 0);
    if (now.getHours() >= 12) {
        document.getElementById(`meridian`).innerHTML = "PM";
    }
    else {
        document.getElementById(`meridian`).innerHTML = "AM";
    }
}

function todayDate(now) {
    let currentDate = String(now);
    currentDate = currentDate.slice(0, 15);
    document.getElementById(`date`).innerHTML = currentDate;
}