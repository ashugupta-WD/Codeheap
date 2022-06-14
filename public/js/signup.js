let i = 0;
let num = 0;
let unique = {
    isUniqueMail: null,
    passMatch: null
}

setInterval(() => {
    if (unique.isUniqueMail && unique.passMatch) {
        document.getElementById('signup').disabled = false;
        return;
    }
}, 10);

const codeSnippets = [
    { language: `C Programming`, statement: `#include <stdio.h>\nint main() {\n    printf("Hello World!");\n    return 0;\n}` },
    { language: `JavaScript`, statement: `console.log("Hello World!");` },
    { language: `C++ Programming`, statement: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello World!";\n    return 0;\n}` },
    { language: `Java`, statement: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!);\n    }\n}` },
    { language: `Python`, statement: `print("Hello World!")` }
];


setTimeout(startPrinting, 1000);

function startPrinting() {
    document.getElementById(`language`).innerText = `${codeSnippets[num].language}`;
    if (i < codeSnippets[num].statement.length) {
        document.getElementById(`statement`).innerText += codeSnippets[num].statement.charAt(i);
        i++;
    }
    else {
        return;
    }
    setTimeout(startPrinting, 60);
}

let clearCodeSnippets = setInterval(() => {
    document.getElementById(`statement`).innerText = "";
    i = 0;
    num++;
    if (num == codeSnippets.length) {
        num = 0;
    }
    startPrinting();

}, 15000);

function toggleVisibility() {
    let userPassword = document.getElementById(`userPassword`);
    let confirmPassword = document.getElementById(`confirmPassword`);
    if (document.getElementById(`passwordVisibility`).checked == true) {
        userPassword.type = `text`;
        confirmPassword.type = `text`;
    }
    else {
        userPassword.type = `password`;
        confirmPassword.type = `password`;
    }
}

function passwordInfo() {
    document.getElementsByClassName(`alert`)[0].innerHTML = `Password must conatin atleast one digit, smallcase & uppercase letter.`
    document.getElementsByClassName(`alert`)[0].style.background = `var(--alertInfo)`;
    document.getElementsByClassName(`alert`)[0].style.display = `flex`;
    dismissAlert();
}

function passwordValidation() {
    let userPassword = document.getElementById(`userPassword`).value;
    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\.\\\+\*\?\^\$\(\)\{\}\[\]\|`~!@#%&-_=;:"',<>])[a-zA-Z0-9\.\\\+\*\?\^\$\(\)\{\}\[\]\|`~!@#%&-_=;:"',<>]{8,16}$/;
    if (!passwordRegex.test(userPassword)) {
        document.getElementById(`confirmPassword`).disabled = true;
    }
    else {
        document.getElementById(`confirmPassword`).disabled = false;
    }
}

function passwordMatch() {
    let userPassword = document.getElementById(`userPassword`).value;
    document.getElementById(`confirmPassword`).setAttribute('maxLength', `${userPassword.length}`);
    let reEnteredPassword = document.getElementById(`confirmPassword`).value;
    if (userPassword != reEnteredPassword) {
        unique.passMatch = false;
        return;
    }
    else {
        console.log("equal");
        unique.passMatch = true;
        return;
    }
}

async function emailValidation() {
    let fetchResult;
    let userEmail = document.getElementById(`userEmail`).value;
    let emailRegex = /^([a-zA-Z0-9\.\\\+\*\?\^\(\)\{\}\[\]\|`@-_=;:"',<>]+)@([a-zA-Z0-9]+)\.([a-zA-Z]){2,7}$/;
    if (!emailRegex.test(userEmail)) {
        unique.isUniqueMail = false;
        console.log("Not valid");
    }
    else {
        console.log("valid");
        fetchResult = await fetch("/checkmail", {

            method: "POST",
            body: JSON.stringify({ userEmail: userEmail }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(response => response.json()).then(json => fetchResult = json);
        unique.isUniqueMail = !(fetchResult.result);
        if (fetchResult.result) {
            document.getElementsByClassName(`alert`)[0].innerHTML = `<strong>Careful!</strong>User already exists.`
            document.getElementsByClassName(`alert`)[0].style.background = `var(--alertDanger)`;
        }
        else {
            document.getElementsByClassName(`alert`)[0].innerHTML = `<strong>Welcome to codeheap!</strong>`
            document.getElementsByClassName(`alert`)[0].style.background = `var(--alertSuccess)`;
        }
        document.getElementsByClassName(`alert`)[0].style.display = `flex`;
        dismissAlert();
        console.log(unique.isUniqueMail);
        return;
    }
}


