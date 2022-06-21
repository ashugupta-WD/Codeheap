
function checkImageExtension(name) {
    let arr = name.split('.');
    let ext = arr[arr.length - 1];
    if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        return false;
    }
    return true;
}

function checkVideoExtension(name) {
    let arr = name.split('.');
    let ext = arr[arr.length - 1];
    if (ext !== 'mp4' && ext !== 'ogg' && ext !== 'webm') {
        return false;
    }
    return true;
}

function checkPythonExtension(name) {
    let arr = name.split('.');
    let ext = arr[arr.length - 1];
    if (ext !== 'py') {
        return false;
    }
    return true;
}

let myForm = document.getElementById(`form`);
myForm.onsubmit = async function (e) {
    e.preventDefault();
    let value;
    let imageFile = document.getElementById(`imageFile`);
    let videoFile = document.getElementById(`videoFile`);
    let pythonFile = document.getElementById(`pythonFile`);

    if (imageFile.files[0].size > (1024 * 1024)) {
        document.getElementsByClassName('alert')[0].innerHTML = "<Strong>Danger! </Strong>Image File Size Greater Than 1 MB";
        document.getElementsByClassName('alert')[0].style.display = "block";
        setTimeout(() => {
            document.getElementsByClassName('alert')[0].style.display = "none";
            document.getElementsByClassName('alert')[0].innerHTML = "";
        }, 5000);
        return;
    }

    if (!checkImageExtension(imageFile.files[0].name)) {
        document.getElementsByClassName('alert')[0].innerHTML = "<Strong>Danger! </Strong>Only jpg, jpeg and png Images are accepted.";
        document.getElementsByClassName('alert')[0].style.display = "block";
        setTimeout(() => {
            document.getElementsByClassName('alert')[0].style.display = "none";
            document.getElementsByClassName('alert')[0].innerHTML = "";
        }, 5000);
        return;
    }

    if (videoFile.files[0].size > (1024 * 1024 * 10)) {
        document.getElementsByClassName('alert')[0].innerHTML = "<Strong>Danger! </Strong>Video File size greater than 10 MB";
        document.getElementsByClassName('alert')[0].style.display = "block";
        setTimeout(() => {
            document.getElementsByClassName('alert')[0].style.display = "none";
            document.getElementsByClassName('alert')[0].innerHTML = "";
        }, 5000);
        return;
    }

    if (!checkVideoExtension(videoFile.files[0].name)) {
        document.getElementsByClassName('alert')[0].innerHTML = "<Strong>Danger! </Strong>Only mp4, ogg and webm videos are accepted.";
        document.getElementsByClassName('alert')[0].style.display = "block";
        setTimeout(() => {
            document.getElementsByClassName('alert')[0].style.display = "none";
            document.getElementsByClassName('alert')[0].innerHTML = "";
        }, 5000);
        return;
    }

    if (!checkPythonExtension(pythonFile.files[0].name)) {
        document.getElementsByClassName('alert')[0].innerHTML = "<Strong>Danger! </Strong>Not an PYTHON File.";
        document.getElementsByClassName('alert')[0].style.display = "block";
        setTimeout(() => {
            document.getElementsByClassName('alert')[0].style.display = "none";
            document.getElementsByClassName('alert')[0].innerHTML = "";
        }, 5000);
        return;
    }

    let formData = new FormData();
    value = await fetch('/upload/uploadpytext', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectTitle: document.getElementById('projectTitle').value,
            projectLanguages: document.getElementById('projectLanguages').value,
            description: document.getElementById('description').value
        })
    }).then(res => res.json()).then((json) => value = json);
    console.log(value);
    if (value.result) {
        let nextValue;
        formData.append('imageFile', imageFile.files[0], imageFile.files[0].name);
        formData.append('videoFile', videoFile.files[0], videoFile.files[0].name);
        formData.append('pythonFile', pythonFile.files[0], pythonFile.files[0].name);
        nextValue = await fetch('/upload/uploadpy', {
            method: "POST",
            body: formData
        }).then(res => res.json()).then((json) => nextValue = json);
        window.location.href = nextValue.nextURL;
    }
}