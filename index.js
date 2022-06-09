var turn = 0
var one = 'fa-solid fa-o fa-5x';
var two = 'fa-solid fa-xmark fa-6x';
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
var user1 = {
    timer: 15,
    id: 0
}
var user2 = {
    timer: 15,
    id: 0
}
function resetAll() {
    mark = Array(10).fill(Number(-1));
    available = Array(10).fill(true);
    isWon = false;
    turn = 0;
    notDone = true;
    for (let x = 1; x <= 9; x++) {
        const id = x.toString();
        const el = document.getElementById(id);
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'auto';
    }

}

function decreaseCounter(user) {
    user.timer -= 1;
    if (user.timer <= 49) {
        const element = document.getElementById('tblock');
        element.style.color = 'orange';
    }
    console.log(user.timer);
    setTimeValue(user);
}

function start(user) {
    user.id = setInterval(decreaseCounter, 1000, user);
}
function stop(user) {
    clearInterval(user.id);
    setTimeValue(user);
}
function reset(user) {
    clearInterval(user.id);
    user.timer = 15;
    setTimeValue(user);
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
        winningStatus.setAttribute('id', 'winCard');
        winningStatus.innerHTML = (winningID == Number(1) ? "O" : "X") + " has won the game.";
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
        el.appendChild(restartButton);
        restartButton.addEventListener('click', restartTheGame);
            clearInterval(gameTimer.id);

    } else {
        var cnt = 0;
        for (let x = 1; x <= 9; x++) {
            if (mark[x] != -1) {
                cnt++;
            }
        }
        console.log("Cnt is : " + cnt);
        if (cnt == 9) {
            isWon = true;
            const winningStatus = document.createElement('div');
            winningStatus.setAttribute('id', 'winCard');
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
            el.appendChild(restartButton);
            restartButton.addEventListener('click', restartTheGame);
            clearInterval(gameTimer.id);

        }
    }

}



function setTimeValue(user) {
    let timer = user.timer;
    if (timer >= 0) {
    const timerElement = document.getElementById('tblock');
    let hours = Math.floor(timer / 3600);
    timer = timer % 3600
    let minutes = Math.floor(timer / 60);
    timer = timer % 60;
    let seconds = Math.floor(timer);
    let currentValue = seconds.toString(10);
    if (timerElement) timerElement.innerHTML = currentValue;
       
    }

}
var gameTimer = {
    timerUpID: 0,
    notDone: false
} 
function clearSetTimeValue() {
    var user = (turn == 0) ? user1 : user2;
    var timer = (turn == 0) ? user1.timer : user2.timer;
    console.log("What the heck !");
    if (gameTimer.notDone && timer <= 0)
    {
       reset(user);
        gameTimer.notDone = false;
    var el = document.getElementById('turn');
    el.innerHTML = "";
            const winningStatus = document.createElement('div');
            winningStatus.setAttribute('id', 'winCard');
            winningStatus.innerHTML = "Time Up ! " + ((turn == 1) ? "X" : 'O') + " has won the game.";
            winningStatus.style.fontFamily = 'Raleway';
            var el = document.getElementsByClassName('ctn')[0]
            el.appendChild(winningStatus);
            document.getElementById('tblock').innerHTML = "";
        const restartButton = document.createElement('button');
        restartButton.innerHTML = 'Restart'
        restartButton.setAttribute('id', "restartButton");
        restartButton.setAttribute('class', "btn btn-success");
        el.appendChild(restartButton);
        restartButton.addEventListener('click', restartTheGame);
    
    }
}

function place() {
    if (turn == 0) {
        reset(user1);
        stop(user1);
    } else {
        reset(user2);
        stop(user2);
    }
    const el = document.getElementById('turn')
    el.innerHTML = "It's " + (turn == 0 ? "X" : 'O') + " turn now";
    let id = this.getAttribute('id');
    id = parseInt(id);
    if (available[id]) {
        const newIcon = document.createElement("i");
        const newDiv = document.createElement("div");
        newIcon.setAttribute('class', (turn == 0 ? one : two));
        newDiv.appendChild(newIcon);
        // this keyword refers to the element on which event listener is added
        const blockNumber = parseInt(this.getAttribute('id'));
        console.log("Block Number is " + blockNumber);
        mark[blockNumber] = Number(turn + 1);
        checkForWin();
        this.appendChild(newDiv);
        turn = 1 - turn;
        this.style.cursor = "not-allowed";
        available[id] = false;
    }
    if (turn == 1 && isWon == false) {
        reset(user2);
        start(user2);
    } else if (isWon == false){
        reset(user1);
        start(user1);
    }
}
function startTheGame() {
    this.remove();
    if (turn == 0) {
        start(user1);
    } else {
        start(user2);
    }
    const el = document.getElementById('turn')
    el.innerHTML = "It's " + (turn == 0 ? "O" : 'X') + " turn now";
    if (gameTimer.id > 0) clearInterval(gameTimer.id)
    gameTimer.id = setInterval(clearSetTimeValue, 200);
    gameTimer.notDone = true;
    resetAll();
}
function restartTheGame() {
    this.remove();
    for (let x = 1; x <= 9; x++) {
        const id = x.toString();
        const el = document.getElementById(id).firstChild;
        console.log(el)
        if (el) el.remove();
    }
    document.getElementById('winCard').remove();
    if (turn == 0) {
        start(user1);
    } else {
        start(user2);
    }
    const el = document.getElementById('turn')
    el.innerHTML = "It's " + (turn == 0 ? "X" : 'O') + " turn now";
    if (gameTimer.id > 0) clearInterval(gameTimer.id)
    gameTimer.id = setInterval(clearSetTimeValue, 200);
    gameTimer.notDone = true;
    resetAll();
}
for (let x = 1; x <= 9; x++) {
    const id = x.toString();
    console.log(id);
    const el = document.getElementById(id);
    console.log(el)
    el.addEventListener('click', place);
}
document.getElementById('startButton').addEventListener('click', startTheGame);

