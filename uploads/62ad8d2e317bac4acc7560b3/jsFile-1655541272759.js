// This passValue Determines the Difficulty level :
// 0 -> Easy, 1-> Difficult and 3 -> PVP
let passValue = -1;

// playerMode Value helps in Determining the Player's Turn 
// Whether it is X's turn or O's turn : 0 -> for O's Turn and 1 -> for X's turn
let playerMode = 0;

// Whether User Skipped the information part or Not
let isSkipped = 0;

// Number of Clicks on the Tic-Tac-Toe Board
let count = 0;

// ==> VARIABLE TO KEEP RECORD OF INPUT CHOICE ( "O" OR "X" ) AT ANY GIVEN TIME BASED ON PLAYER"S CHOICE
let playerInput = 0;

// Tic-Tac-Toe Board Array
let tac = Array.from(document.getElementsByClassName(`matrix`));

// List of Player Names
let playerName = Array.from(document.getElementsByClassName("playerName"));


// ==> For AI IMPOSSIBLE MODE :
class Move {
    constructor() {
        let row, col;
    }
}

// ==> Player and AI INPUT
let ai = "X";
let player = "O";

// ==> Whether Any Empty Cells Left Or Not
function isMoveLeft() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "")
                return true;
        }
    }
    return false;
}

// ==> CHECK WINNING CONDITIONS
function evaluate(b) {

    for (let i = 0; i < 3; i++) {
        if (b[i][0] == b[i][1] && b[i][1] == b[i][2]) {
            if (b[i][0] == ai)
                return +10;
            else if (b[i][0] == player)
                return -10;
        }
    }

    for (let j = 0; j < 3; j++) {
        if (b[0][j] == b[1][j] && b[1][j] == b[2][j]) {
            if (b[0][j] == ai)
                return +10;
            else if (b[0][j] == player)
                return -10;
        }
    }

    if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
        if (b[0][0] == ai)
            return +10;
        else if (b[0][0] == player)
            return -10;
    }

    if (b[2][0] == b[1][1] && b[1][1] == b[0][2]) {
        if (b[0][2] == ai)
            return +10;
        else if (b[0][2] == player)
            return -10;
    }
    return 0;
}

//  ==> MINIMAX ALGORITHM CODE
function minimax(board, depth, isMax) {
    let score = evaluate(board);
    if (score == 10)
        return score;
    if (score == -10)
        return score;
    if (isMoveLeft(board) == false)
        return 0;
    if (isMax) {
        let best = -1000;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == "") {
                    board[i][j] = ai;
                    best = Math.max(best, minimax(board, depth + 1, !isMax));
                    board[i][j] = "";
                }
            }
        }
        return best;
    }
    else {
        let best = 1000;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == "") {
                    board[i][j] = player;
                    best = Math.min(best, minimax(board, depth + 1, !isMax));
                    board[i][j] = "";
                }
            }
        }
        return best;
    }
}

//  ==> FINDING THE BEST MOVE AVAILABLE
function findBestMove(board) {
    let bestVal = -1000;
    let bestMove = new Move();
    bestMove.row = -1;
    bestMove.col = -1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                board[i][j] = ai;
                let moveVal = minimax(board, 0, false);
                board[i][j] = "";
                if (moveVal > bestVal) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
    return bestMove;
}

//  ==> TIC_TAC_TOE BOARD
let board = [[tac[0].innerHTML, tac[1].innerHTML, tac[2].innerHTML],
[tac[3].innerHTML, tac[4].innerHTML, tac[5].innerHTML],
[tac[6].innerHTML, tac[7].innerHTML, tac[8].innerHTML]];


// Function to Start the game after Choosing Difficulty
function start() {
    document.getElementById(`diffMode`).style.display = "none";
    document.querySelector(`.playerSelect`).style.display = "flex";
    if (passValue != 2) {
        playerName[1].value = "AI";
    }
    return;
}

// ==> Function for playing against AI in IMPOSSIBLE MODE
function aiInput() {
    count++;
    let bestMove = findBestMove(board);
    let ROW = bestMove.row;
    let COL = bestMove.col;
    let n = (2 * ROW) + ROW + COL;
    board[ROW][COL] = ai;
    tac[n].innerHTML = ai;
    tac[n].removeAttribute("onclick");
    document.getElementById(`player-1`).classList.replace(`pUnactive`, `pActive`);
    document.getElementById(`player-2`).classList.replace(`pActive`, `pUnactive`);
    if (isMatch()) {
        setTimeout(() => {
            document.getElementById("win").classList.add("Won");
        }, 1000);
        setTimeout(() => {
            if (playerInput == 1 || playerInput == 2) {
                document.getElementById("win").innerHTML = document.getElementById(`player-1`).innerHTML + " Won";
            }
            else {
                document.getElementById("win").innerHTML = document.getElementById(`player-2`).innerHTML + " Won";
            }
        }, 2500);
        return;
    }
}

// ==> Function for playing against AI in EASY MODE
function aiEasy() {
    count++;
    let isInputted = false;
    if (((tac[0].innerHTML == tac[1].innerHTML && tac[0].innerHTML != "") || (tac[1].innerHTML == tac[2].innerHTML && tac[1].innerHTML != "") || (tac[0].innerHTML == tac[2].innerHTML && tac[2].innerHTML != "")) && (tac[0].innerHTML == player || tac[1].innerHTML == player)) {
        if (tac[0].innerHTML == "") {
            tac[0].innerHTML = ai;
            tac[0].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[1].innerHTML == "") {
            tac[1].innerHTML = ai;
            tac[1].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[2].innerHTML == "") {
            tac[2].innerHTML = ai;
            tac[2].removeAttribute("onclick");
            isInputted = true;
        }
    }
    else if (((tac[3].innerHTML == tac[4].innerHTML && tac[3].innerHTML != "") || (tac[4].innerHTML == tac[5].innerHTML && tac[4].innerHTML != "") || (tac[3].innerHTML == tac[5].innerHTML && tac[5].innerHTML != "")) && (tac[3].innerHTML == player || tac[4].innerHTML == player)) {
        if (tac[3].innerHTML == "") {
            tac[3].innerHTML = ai;
            tac[3].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[4].innerHTML == "") {
            tac[4].innerHTML = ai;
            tac[4].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[5].innerHTML == "") {
            tac[5].innerHTML = ai;
            tac[5].removeAttribute("onclick");
            isInputted = true;
        }
    }
    else if (((tac[6].innerHTML == tac[7].innerHTML && tac[6].innerHTML != "") || (tac[7].innerHTML == tac[8].innerHTML && tac[7].innerHTML != "") || (tac[6].innerHTML == tac[8].innerHTML && tac[8].innerHTML != "")) && (tac[6].innerHTML == player || tac[7].innerHTML == player)) {
        if (tac[6].innerHTML == "") {
            tac[6].innerHTML = ai;
            tac[6].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[7].innerHTML == "") {
            tac[7].innerHTML = ai;
            tac[7].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[8].innerHTML == "") {
            tac[8].innerHTML = ai;
            tac[8].removeAttribute("onclick");
            isInputted = true;
        }
    }
    else if (((tac[0].innerHTML == tac[4].innerHTML && tac[0].innerHTML != "") || (tac[4].innerHTML == tac[8].innerHTML && tac[4].innerHTML != "") || (tac[0].innerHTML == tac[8].innerHTML && tac[8].innerHTML != "")) && (tac[0].innerHTML == player || tac[4].innerHTML == player)) {
        if (tac[0].innerHTML == "") {
            tac[0].innerHTML = ai;
            tac[0].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[4].innerHTML == "") {
            tac[4].innerHTML = ai;
            tac[4].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[8].innerHTML == "") {
            tac[8].innerHTML = ai;
            tac[8].removeAttribute("onclick");
            isInputted = true;
        }
    }
    else if (((tac[6].innerHTML == tac[4].innerHTML && tac[6].innerHTML != "") || (tac[4].innerHTML == tac[2].innerHTML && tac[4].innerHTML != "") || (tac[6].innerHTML == tac[2].innerHTML && tac[2].innerHTML != "")) && (tac[6].innerHTML == player || tac[4].innerHTML == player)) {
        if (tac[6].innerHTML == "") {
            tac[6].innerHTML = ai;
            tac[6].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[4].innerHTML == "") {
            tac[4].innerHTML = ai;
            tac[4].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[2].innerHTML == "") {
            tac[2].innerHTML = ai;
            tac[2].removeAttribute("onclick");
            isInputted = true;
        }
    }
    else if (((tac[0].innerHTML == tac[3].innerHTML && tac[0].innerHTML != "") || (tac[3].innerHTML == tac[6].innerHTML && tac[3].innerHTML != "") || (tac[0].innerHTML == tac[6].innerHTML && tac[6].innerHTML != "")) && (tac[0].innerHTML == player || tac[3].innerHTML == player)) {
        if (tac[0].innerHTML == "") {
            tac[0].innerHTML = ai;
            tac[0].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[3].innerHTML == "") {
            tac[3].innerHTML = ai;
            tac[3].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[6].innerHTML == "") {
            tac[6].innerHTML = ai;
            tac[6].removeAttribute("onclick");
            isInputted = true;
        }
    }
    else if (((tac[1].innerHTML == tac[4].innerHTML && tac[1].innerHTML != "") || (tac[4].innerHTML == tac[7].innerHTML && tac[4].innerHTML != "") || (tac[1].innerHTML == tac[7].innerHTML && tac[7].innerHTML != "")) && (tac[1].innerHTML == player || tac[4].innerHTML == player)) {
        if (tac[1].innerHTML == "") {
            tac[1].innerHTML = ai;
            tac[1].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[4].innerHTML == "") {
            tac[4].innerHTML = ai;
            tac[4].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[7].innerHTML == "") {
            tac[7].innerHTML = ai;
            tac[7].removeAttribute("onclick");
            isInputted = true;
        }
    }
    else if (((tac[2].innerHTML == tac[5].innerHTML && tac[2].innerHTML != "") || (tac[5].innerHTML == tac[8].innerHTML && tac[5].innerHTML != "") || (tac[2].innerHTML == tac[8].innerHTML && tac[8].innerHTML != "")) && (tac[2].innerHTML == player || tac[5].innerHTML == player)) {
        if (tac[2].innerHTML == "") {
            tac[2].innerHTML = ai;
            tac[2].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[5].innerHTML == "") {
            tac[5].innerHTML = ai;
            tac[5].removeAttribute("onclick");
            isInputted = true;
        }
        else if (tac[8].innerHTML == "") {
            tac[8].innerHTML = ai;
            tac[8].removeAttribute("onclick");
            isInputted = true;
        }
    }

    if (!isInputted) {
        let z = 1;
        while (z < 100) {
            let n = Math.floor(Math.random() * tac.length);
            if (tac[n].innerHTML == "") {
                tac[n].innerHTML = ai;
                tac[n].removeAttribute("onclick");
                break;
            }
            else z++;
        }
    }
    document.getElementById(`player-1`).classList.replace(`pUnactive`, `pActive`);
    document.getElementById(`player-2`).classList.replace(`pActive`, `pUnactive`);
    if (isMatch()) {
        setTimeout(() => {
            document.getElementById("win").classList.add("Won");
        }, 1000);
        setTimeout(() => {
            if (playerInput == 1 || playerInput == 2) {
                document.getElementById("win").innerHTML = document.getElementById(`player-2`).innerHTML + " Won";
            }
            else {
                document.getElementById("win").innerHTML = document.getElementById(`player-2`).innerHTML + " Won";
            }
        }, 2500);
        return;
    }
}


// Function to input when clicking on the tic-tac-toe Board
function yourInput(n, r, c) {
    count++;
    if (playerMode == 0) {
        tac[n].innerHTML = "O";
        board[r][c] = "O";
        tac[n].removeAttribute("onclick");
        playerMode = 1;
        if(playerInput == 1 || playerInput == 2) {
            document.getElementById(`player-1`).classList.replace(`pUnactive`, `pActive`);
            document.getElementById(`player-2`).classList.replace(`pActive`, `pUnactive`);
        }
        else {
            document.getElementById(`player-1`).classList.replace(`pActive`, `pUnactive`);
            document.getElementById(`player-2`).classList.replace(`pUnactive`, `pActive`);
        }
        if (isMatch()) {
            setTimeout(() => {
                document.getElementById("win").classList.add("Won");
            }, 1000);
            setTimeout(() => {
                if (playerInput == 1 || playerInput == 2) {
                    document.getElementById("win").innerHTML = document.getElementById(`player-2`).innerHTML + " Won";
                }
                else {
                    document.getElementById("win").innerHTML = document.getElementById(`player-1`).innerHTML + " Won";
                }
            }, 2500);
            return;
        }
        if (passValue == 1) {
            playerMode = 0;
            if (count == 9) {
                if (isDraw()) {
                    setTimeout(() => {
                        document.getElementById("win").classList.add("Won");
                    }, 1000);
                    setTimeout(() => {
                        document.getElementById("win").innerHTML = 'The Match is Draw!';
                    }, 2500);
                    return;
                }
                return;
            }
            else {
                setTimeout(aiInput, 1000);
            }
        }
        if (passValue == 0) {
            playerMode = 0;
            if (count == 9) {
                if (isDraw()) {
                    setTimeout(() => {
                        document.getElementById("win").classList.add("Won");
                    }, 1000);
                    setTimeout(() => {
                        document.getElementById("win").innerHTML = 'The Match is Draw!';
                    }, 2500);
                    return;
                }
                return;
            }
            else {
                setTimeout(aiEasy, 1000);
            }
        }
    }
    else {
        tac[n].innerHTML = "X";
        player = "X";
        ai = "O";
        board[r][c] = player;
        tac[n].removeAttribute("onclick");
        playerMode = 0;
        if(playerInput == 1 || playerInput == 2) {
            document.getElementById(`player-2`).classList.replace(`pUnactive`, `pActive`);
            document.getElementById(`player-1`).classList.replace(`pActive`, `pUnactive`);
        }
        else {
            document.getElementById(`player-1`).classList.replace(`pUnactive`, `pActive`);
            document.getElementById(`player-2`).classList.replace(`pActive`, `pUnactive`);
        }

        if (isMatch()) {
            setTimeout(() => {
                document.getElementById("win").classList.add("Won");
            }, 1000);
            setTimeout(() => {
                if (playerInput == 1 || playerInput == 2) {
                    document.getElementById("win").innerHTML = document.getElementById(`player-1`).innerHTML + " Won";
                }
                else {
                    document.getElementById("win").innerHTML = document.getElementById(`player-2`).innerHTML + " Won";
                }
            }, 2500);
            return;
        }
        if (passValue == 1) {
            playerMode = 1;
            if (count == 9) {
                if (isDraw()) {
                    setTimeout(() => {
                        document.getElementById("win").classList.add("Won");
                    }, 1000);
                    setTimeout(() => {
                        document.getElementById("win").innerHTML = 'The Match is Draw!';
                    }, 2500);
                    return;
                }
                return;
            }
            else {
                setTimeout(aiInput, 1000);
            }
        }
        if (passValue == 0) {
            playerMode = 1;
            if (count == 9) {
                if (isDraw()) {
                    setTimeout(() => {
                        document.getElementById("win").classList.add("Won");
                    }, 1000);
                    setTimeout(() => {
                        document.getElementById("win").innerHTML = 'The Match is Draw!';
                    }, 2500);
                    return;
                }
                return;
            }
            else {
                setTimeout(aiEasy, 1000);
            }
        }
    }
    if (count == 9) {
        if (isDraw()) {
            setTimeout(() => {
                document.getElementById("win").classList.add("Won");
            }, 1000);
            setTimeout(() => {
                document.getElementById("win").innerHTML = 'The Match is Draw!';
            }, 2500);
            return;
        }
    }
}


// Function to Go back to the Difficulty Section
function menu() {
    let diff = document.getElementsByClassName(`diff`);
    let start = document.getElementById(`start`);
    start.style.display = `none`;
    diff[1].classList.replace(`active`, `unactive`);
    diff[2].classList.replace(`active`, `unactive`);
    diff[0].classList.replace(`active`, `unactive`);
    document.getElementById(`diffMode`).style.display = "flex";
    document.getElementById(`game`).style.display = "none";
    isSkipped = 0;
    playerMode = 0;
    count = 0;
    playerInput = 0;
    player = "O";
    ai = "X";

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
            tac[2 * i + (i + j)].innerHTML = "";
            tac[2 * i + (i + j)].setAttribute(`onclick`, `yourInput(${2 * i + (i + j)}, ${i}, ${j})`);
        }
    }

    document.getElementById(`player-1`).classList.replace(`pUnactive`, `pActive`);
    document.getElementById(`player-2`).classList.replace(`pActive`, `pUnactive`);
    let playerChoice = Array.from(document.getElementsByClassName("playerChoice"));
    playerChoice[0].classList.replace("unactive", "btnactive");
    playerChoice[3].classList.replace("unactive", "btnactive");
    playerChoice[1].classList.replace("btnactive", "unactive");
    playerChoice[2].classList.replace("btnactive", "unactive");
    document.getElementById("win").classList.remove("Won");
    document.getElementById("win").innerHTML = "";
    document.getElementById("player-1").innerHTML = "Player - O";
    document.getElementById("player-2").innerHTML = "Player - X";
    playerName[0].value = "";
    playerName[1].value = "";
    document.getElementById("H-1").classList.remove("win-H")
    document.getElementById("H-2").classList.remove("win-H")
    document.getElementById("H-3").classList.remove("win-H")
    document.getElementById("DC").classList.remove("win-D")
    document.getElementById("DAC").classList.remove("win-D")
    document.getElementById("C-1").classList.remove("win-C")
    document.getElementById("H-2").classList.remove("win-C")
    document.getElementById("C-3").classList.remove("win-C")
    return;
}

//  Function to restart the current Difficulty level
function restart() {

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
            tac[2 * i + (i + j)].innerHTML = "";
            tac[2 * i + (i + j)].setAttribute(`onclick`, `yourInput(${2 * i + (i + j)}, ${i}, ${j})`);
        }
    }

    document.getElementById("win").classList.remove("Won");
    document.getElementById("win").innerHTML = "";
    count = 0;
    display(playerInput);
    displayName();
    document.getElementById("H-1").classList.remove("win-H")
    document.getElementById("H-2").classList.remove("win-H")
    document.getElementById("H-3").classList.remove("win-H")
    document.getElementById("DC").classList.remove("win-D")
    document.getElementById("DAC").classList.remove("win-D")
    document.getElementById("C-1").classList.remove("win-C")
    document.getElementById("H-2").classList.remove("win-C")
    document.getElementById("C-3").classList.remove("win-C")
}

// Function to tell what to do after selecting the difficulty
function show(n) {
    passValue = n;
    let diff = document.getElementsByClassName(`diff`);
    if (n == 0) {
        diff[1].classList.replace(`active`, `unactive`);
        diff[2].classList.replace(`active`, `unactive`);
        diff[0].classList.replace(`unactive`, `active`);
    }
    else if (n == 1) {
        diff[2].classList.replace(`active`, `unactive`);
        diff[0].classList.replace(`active`, `unactive`);
        diff[1].classList.replace(`unactive`, `active`);

    }
    else {
        diff[0].classList.replace(`active`, `unactive`);
        diff[1].classList.replace(`active`, `unactive`);
        diff[2].classList.replace(`unactive`, `active`);

    }
    let start = document.getElementById(`start`);
    start.style.display = `block`;
}

// Function to Check the winner of the game
function isMatch() {
    if ((tac[0].innerHTML == tac[1].innerHTML && tac[1].innerHTML == tac[2].innerHTML && tac[0].innerHTML != "")) {
        document.getElementById("H-1").classList.add("win-H");
        return tac[0].innerHTML;
    }
    else if ((tac[3].innerHTML == tac[4].innerHTML && tac[4].innerHTML == tac[5].innerHTML && tac[5].innerHTML != "")) {
        document.getElementById("H-2").classList.add("win-H");
        return tac[3].innerHTML;
    }
    else if ((tac[6].innerHTML == tac[7].innerHTML && tac[7].innerHTML == tac[8].innerHTML && tac[8].innerHTML != "")) {
        document.getElementById("H-3").classList.add("win-H");
        return tac[6].innerHTML
    }
    else if ((tac[0].innerHTML == tac[4].innerHTML && tac[4].innerHTML == tac[8].innerHTML && tac[8].innerHTML != "")) {
        document.getElementById("DC").classList.add("win-D");
        return tac[0].innerHTML;
    }
    else if ((tac[6].innerHTML == tac[4].innerHTML && tac[4].innerHTML == tac[2].innerHTML && tac[2].innerHTML != "")) {
        document.getElementById("DAC").classList.add("win-D");
        return tac[6].innerHTML;
    }
    else if ((tac[0].innerHTML == tac[3].innerHTML && tac[3].innerHTML == tac[6].innerHTML && tac[6].innerHTML != "")) {
        document.getElementById("C-1").classList.add("win-C");
        return tac[6].innerHTML;
    }
    else if ((tac[1].innerHTML == tac[4].innerHTML && tac[4].innerHTML == tac[7].innerHTML && tac[7].innerHTML != "")) {
        document.getElementById("H-2").classList.add("win-C");
        return tac[7].innerHTML;
    }
    else if ((tac[2].innerHTML == tac[5].innerHTML && tac[5].innerHTML == tac[8].innerHTML && tac[8].innerHTML != "")) {
        document.getElementById("C-3").classList.add("win-C");
        return tac[8].innerHTML;
    }
    else {
        return 0;
    }
}

// Function to check if the board is empty
function isEmpty() {
    for (let i = 0; i < 9; i++) {
        if (tac[i].innerHTML == "") {
            continue;
        }
        else {
            return false;
        }
    }
    return true;
}

// Function to check if the match is draw or Not
function isDraw() {
    for (let i = 0; i < 9; i++) {
        if (tac[i].innerHTML != "") {
            continue;
        }
        else {
            return false;
        }
    }
    return true;
}

// function to skip the information section
function skip() {
    if (passValue != 2) {
        document.getElementById("player-2").innerHTML = "AI";
    }
    document.querySelector(".playerSelect").style.display = "none";
    document.getElementById("game").style.display = "flex";
    isSkipped = 1;
    return;
}

// Function to display the information section
function display(n = 0) {
    playerInput = n;
    let playerChoice = Array.from(document.getElementsByClassName("playerChoice"));
    document.getElementById(`player-1`).classList.replace(`pUnactive`, `pActive`);
    document.getElementById(`player-2`).classList.replace(`pActive`, `pUnactive`);
    if (n == 0 || n == 3) {
        playerMode = 0;
        playerChoice[0].classList.replace("unactive", "btnactive");
        playerChoice[3].classList.replace("unactive", "btnactive");
        playerChoice[1].classList.replace("btnactive", "unactive");
        playerChoice[2].classList.replace("btnactive", "unactive");
        return n;
    }
    else {
        playerMode = 1;
        playerChoice[1].classList.replace("unactive", "btnactive");
        playerChoice[2].classList.replace("unactive", "btnactive");
        playerChoice[0].classList.replace("btnactive", "unactive");
        playerChoice[3].classList.replace("btnactive", "unactive");
        return n;
    }
}

// Function to display the information section
function displayName() {
    if (isSkipped) {
        document.getElementById("game").style.display = "flex";
        document.querySelector(`.playerSelect`).style.display = "none";
        return;
    }
    else if (passValue == 2) {
        if (playerName[0].value.length > 3 && playerName[1].value.length > 3) {
            document.getElementById("player-1").innerHTML = playerName[0].value;
            document.getElementById("player-2").innerHTML = playerName[1].value;
            document.getElementById("game").style.display = "flex";
            document.querySelector(`.playerSelect`).style.display = "none";
            return;
        }
        else if (playerName[0].value.length == 0 && playerName[1].value.length == 0) {
            if(playerInput == 1 || playerInput == 2) {
                document.getElementById("player-1").innerHTML = "Player - X";
                document.getElementById("player-2").innerHTML = "Player - O";
            }
            skip();
            return;
        }
    }
    else if (passValue == 1 || passValue == 0) {
        if (playerName[0].value.length > 3) {
            document.getElementById("player-1").innerHTML = playerName[0].value;
            playerName[1].value = "AI";
            document.getElementById("player-2").innerHTML = playerName[1].value;
            document.getElementById("game").style.display = "flex";
            document.querySelector(`.playerSelect`).style.display = "none";
            return;
        }
        else if (playerName[0].value.length == 0) {
            if(playerInput == 1 || playerInput == 2) {
                document.getElementById("player-1").innerHTML = "Player - X";
            }
            skip();
            return;
        }
    }
    else {
        alert("Name Must Consist of More than Three Characters!");
        return;
    }
}