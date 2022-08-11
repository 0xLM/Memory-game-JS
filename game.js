
const startButton = document.querySelector('#start');
const feladatleiras = document.querySelector('#feladatleiras');
const eredmenyhirdetes = document.querySelector('#eredmenyhirdetes');
const indicators = document.querySelector('#indicators');
const gridToggle = document.querySelector('#gridtoggle');
const timer = document.querySelector('#timer');
const stepField = document.querySelector('#steps')
const game = document.querySelector('#game');
const buttonsField = document.querySelector('#buttons');

let time = 0;
let steps = 0;
let minutes = '0';
let seconds = '0';
let clicks = 0;
let actualA = 0;
let actualB = 0;
let formattedTime = "";

const gameState = {
    gameRunning: false,
    gridType: gridToggle.value,
    numOfMatches: 0
}

function increaseStep() {
    steps++;
    if (steps < 10) {
        stepField.innerHTML = `Lépések száma: 0${steps}`;
    } else {
        stepField.innerHTML = `Lépések száma: ${steps}`;  
    }
    
}

startButton.addEventListener('click', event => {
    feladatleiras.style.display = "none";
    eredmenyhirdetes.style.display ="none";
    indicators.style.display = "block";
    startGame();
})

gridToggle.addEventListener('click', event => {
    if (gameState.gameRunning === false) {
        if(gridToggle.value === "4") {
        gridToggle.value = "8";
        gridToggle.innerHTML = "Közepes";
        }   else if(gridToggle.value === "8") {
        gridToggle.value = "12";
        gridToggle.innerHTML = "Nehéz";
        }   else {
        gridToggle.value = "4";
        gridToggle.innerHTML = "Könnyű";
        }
        gameState.gridType = Number(gridToggle.value);
    }
})

function timerFunc() {
    timerInterval = setInterval(function () {
        if(time < 60) {
            minutes = '00';
        } else if (time >= 60 && time < 600) {
            minutes = '0' + Math.floor(time/60);
        } else minutes = Math.floor(time/60)

        if(time % 60 < 10) {
            seconds = '0' + `${time % 60}`;
        } else seconds = time % 60;
        formattedTime = `${minutes}:${seconds}`;
        timer.innerHTML = `Eltelt idő: ${formattedTime}`;
        time++;
    }, 1000);
}

function generateNumbers(gridsize) {
    const numbers = [];
    const numberOfPairs = gridsize*gridsize/2;
    for (let i = 1; i <= numberOfPairs; i++) {
        numbers.push(i);
        numbers.push(i);
    }
    const randomizedNumbers = [];
    const allItem = numbers.length;
    let actualNum = 0;
    for (let i = 0; i < allItem; i++) {
        actualNum = Math.floor(Math.random() * numbers.length);
        randomizedNumbers.push(numbers[actualNum]);
        numbers.splice(actualNum,1);
    }
    return randomizedNumbers;
}


function populateField(grid) {

    for(let i = 0; i < grid; i++) {
        const newRow = document.createElement('div');
        newRow.classList.add('cardRow');
        game.appendChild(newRow);
    };

    const rows = document.querySelectorAll('.cardRow');
    rows.forEach(element => {
        for(let i = 0; i < grid; i++) {
            const newCard = document.createElement('div');
            newCard.classList.add('card');
            element.appendChild(newCard);
        };
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach(element => {
        const front = document.createElement('div');
        front.classList.add('cardFront');
        element.appendChild(front);

        const back = document.createElement('div');
        back.classList.add('cardBack');
        element.appendChild(back);
    });

    const numbers = generateNumbers(gameState.gridType);
    const dataHolders = document.querySelectorAll('.cardBack');
    dataHolders.forEach(element => {
        element.innerHTML = numbers.pop();
    });

    cards.forEach(element => {
        if(gameState.gridType <= 4) {
            element.classList.add('cardsize-grid-s');
        } else if(gameState.gridType == 8) {
            element.classList.add('cardsize-grid-m');
        } else {
            element.classList.add('cardsize-grid-l');
        }
        
        element.addEventListener('click', function () {
                element.classList.toggle("flipCard");
                clicks++;
                if (clicks % 2 !== 0) {
                    actualA = element.textContent;
                }
                else {
                    actualB = element.textContent;
                    increaseStep();
                    let selected = document.querySelectorAll('.flipCard');
                    if (actualA == actualB) {
                        setTimeout(() => {
                            selected.forEach(element => {
                                element.classList.add("foundMatch");
                                element.classList.remove("flipCard");
                            });
                        }, 500);
                        newPair();
                    } else {
                        setTimeout(() => {
                            selected.forEach(element => {
                                element.classList.remove("flipCard");
                            });
                        }, 500);
                    };
                    actualA = "";
                    actualB = "";
                    clicks = 0;
                };
            });
    });

}

function startGame() {
    gameState.gameRunning = true;
    gridToggle.classList.add("disableState");
    gridToggle.disabled = true;
    startButton.classList.add("disableState");
    startButton.disabled = true;
    populateField(gameState.gridType);
    timerFunc();
}


function newPair() {
    gameState.numOfMatches++;
    if(gameState.numOfMatches === gameState.gridType*gameState.gridType/2) {
        setTimeout(() => endGame(), 500);
    };
}

function endGame() {
    gameState.gameRunning = false;
    gameState.numOfMatches = 0;
    clearInterval(timerInterval);
    document.querySelectorAll('.cardRow').forEach(element => {element.remove()});
    gridToggle.classList.remove("disableState");
    gridToggle.disabled = false;
    startButton.classList.remove("disableState");
    startButton.disabled = false;
    setTimeout(() => {
        indicators.style.display = "none";
        stepField.innerHTML = `Lépések száma: 00`;
        timer.innerHTML = `Eltelt idő: 00:00`;
        eredmenyhirdetes.style.display = "flex";
        eredmenyhirdetes.innerHTML =`<h3>Gratulálunk, Ön nyert!</h3><p> Teljes játékidő: ${formattedTime}</p>`;
    }, 500);
    time = 0;
    steps = 0;
}
