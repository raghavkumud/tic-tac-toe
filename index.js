var turn = 0
var OIconClass = 'fa-solid fa-o fa-5x';
var XIconClass = 'fa-solid fa-xmark fa-6x';
var mark = Array(10).fill(Number(-1))
var available = Array(10).fill(true);
var isWon = false;
var winningCombinations =
    [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 9]
    ]
var player1 = {
    timer: 15,
    id: 0
}
var player2 = {
    timer: 15,
    id: 0
}
var gameTimer = {
    id: 0,
    isRunning: false
}
function resetAll() {
    mark = Array(10).fill(-1);
    available = Array(10).fill(true);
    isWon = false;
    turn = 0;
    gameTimer.isRunning = true;
    for (let x = 1; x <= 9; x++) {
        const id = x.toString();
        const el = document.getElementById(id);
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
    }
}

function decreaseCounter(player) {
    player.timer -= 1;
    if (player.timer <= 49) {
        const element = document.getElementById('tblock');
        element.style.color = 'orange';
    }
    console.log(player.timer);
    updateTimer(player);
}

function startTimer(player) {
    player.id = setInterval(decreaseCounter, 1000, player);
}
function stopTimer(player) {
    clearInterval(player.id);
    updateTimer(player);
}
function resetTimer(player) {
    clearInterval(player.id);
    player.timer = 15;
    updateTimer(player);
}
function checkForWin() {
    var winningID = -1;
    for (let x = 0; x < 8; x++) {
        var comb = winningCombinations[x];
        console.log(comb);
        if (mark[comb[0]] == mark[comb[1]] && mark[comb[1]] == mark[comb[2]] && mark[comb[1]] != -1) {
            isWon = true;
            winningID = mark[comb[0]];
            break;
        }
    }
    if (isWon) {
        const winningStatus = document.createElement('div');
        winningStatus.setAttribute('id', 'winInfo');
        winningStatus.innerHTML = (winningID == 1 ? "O" : "X") + " has won the game.";
        var el = document.getElementsByClassName('ctn')[0]
        el.appendChild(winningStatus);
        const timerBlock = document.getElementById('tblock');
        const turnBlock = document.getElementById('turn');
        timerBlock.innerHTML = "";
        turnBlock.innerHTML = "";
        const restartButton = document.createElement('button');
        restartButton.innerHTML = 'Restart'
        restartButton.setAttribute('id', "restartButton");
        restartButton.setAttribute('class', "btn btn-success");
        restartButton.addEventListener('click', restartTheGame);
        el.appendChild(restartButton);
        clearInterval(gameTimer.id);

    } else {
        var cnt = 0;
        for (let x = 1; x <= 9; x++) {
            if (mark[x] != -1) {
                cnt++;
            }
        }
        if (cnt == 9) {
            isWon = true;
            const winningStatus = document.createElement('div');
            winningStatus.setAttribute('id', 'winInfo');
            winningStatus.innerHTML = "It's a Draw";
            winningStatus.style.fontFamily = 'Raleway';
            var el = document.getElementsByClassName('ctn')[0]
            el.appendChild(winningStatus);
            const timerBlock = document.getElementById('tblock');
            const turnBlock = document.getElementById('turn');
            timerBlock.innerHTML = "";
            turnBlock.innerHTML = "";
            const restartButton = document.createElement('button');
            restartButton.innerHTML = 'Restart'
            restartButton.setAttribute('id', "restartButton");
            restartButton.setAttribute('class', "btn btn-success");
            restartButton.addEventListener('click', restartTheGame);
            el.appendChild(restartButton);
            clearInterval(gameTimer.id);
        }
    }
}

function updateTimer(player) {
    let timer = player.timer;
    if (timer >= 0) {
        const timerElement = document.getElementById('tblock');
        timer = timer % 3600
        timer = timer % 60;
        let seconds = Math.floor(timer);
        let currentValue = seconds.toString(10);
        if (timerElement) timerElement.innerHTML = currentValue;
    }
}
function deleteTimer() {
    var player = (turn == 0) ? player1 : player2;
    var timer = (turn == 0) ? player1.timer : player2.timer;
    if (gameTimer.isRunning && timer <= 0) {
        reset(player);
        gameTimer.isRunning = false;
        var el = document.getElementById('turn');
        el.innerHTML = "";
        const winningStatus = document.createElement('div');
        winningStatus.setAttribute('id', 'winInfo');
        winningStatus.innerHTML = "Time Up ! " + ((turn == 1) ? "X" : 'O') + " has won the game.";
        winningStatus.style.fontFamily = 'Raleway';
        var el = document.getElementsByClassName('ctn')[0]
        el.appendChild(winningStatus);
        var timerBlock = document.getElementById('tblock');
        timerBlock.innerHTML = "";
        var restartButton = document.createElement('button');
        restartButton.innerHTML = 'Restart'
        restartButton.setAttribute('id', "restartButton");
        restartButton.setAttribute('class', "btn btn-success");
        restartButton.addEventListener('click', restartTheGame);
        el.appendChild(restartButton);
    }
}
// update game board according to the player's turn
function updateGameBoard() {
    if (turn == 0) {
        resetTimer(player1);
        stopTimer(player1);
    } else {
        resetTimer(player2);
        stopTimer(player2);
    }
    const el = document.getElementById('turn')
    el.innerHTML = "It's " + (turn == 0 ? "X" : 'O') + " turn now";
    let id = this.getAttribute('id');
    id = parseInt(id);
    if (available[id]) {
        const newIcon = document.createElement("i");
        const newDiv = document.createElement("div");
        newIcon.setAttribute('class', (turn == 0 ? OIconClass : XIconClass));
        newDiv.appendChild(newIcon);
        // this keyword refers to the element on which event listener is added
        const blockNumber = parseInt(this.getAttribute('id'));
        mark[blockNumber] = turn + 1;
        this.appendChild(newDiv);
        turn = 1 - turn;
        this.style.cursor = "not-allowed";
        available[id] = false;
        checkForWin();
    }
    if (turn == 1 && isWon == false) {
        resetTimer(player2);
        startTimer(player2);
    } else if (isWon == false) {
        resetTimer(player1);
        startTimer(player1);
    }
}
// start the game
function startTheGame() {
    this.remove();
    if (turn == 0) {
        startTimer(player1);
    } else {
        startTimer(player2);
    }
    const el = document.getElementById('turn')
    el.innerHTML = "It's " + (turn == 0 ? "O" : 'X') + " turn now";
    if (gameTimer.id > 0) clearInterval(gameTimer.id)
    gameTimer.id = setInterval(deleteTimer, 200);
    gameTimer.isRunning = true;
    resetAll();
}
// restart the game when someone has won
function restartTheGame() {
    this.remove();
    for (let x = 1; x <= 9; x++) {
        const id = x.toString();
        const el = document.getElementById(id).firstChild;
        if (el) el.remove();
    }
    document.getElementById('winInfo').remove();
    if (turn == 0) {
        startTimer(player1);
    } else {
        startTimer(player2);
    }
    const el = document.getElementById('turn')
    el.innerHTML = "It's " + (turn == 0 ? "X" : 'O') + " turn now";
    if (gameTimer.id > 0) clearInterval(gameTimer.id)
    gameTimer.id = setInterval(deleteTimer, 200);
    gameTimer.isRunning = true;
    resetAll();
}
// attaching event listeners to cells
for (let x = 1; x <= 9; x++) {
    const id = x.toString();
    const el = document.getElementById(id);
    el.addEventListener('click', updateGameBoard);
}
document.getElementById('startButton').addEventListener('click', startTheGame);

