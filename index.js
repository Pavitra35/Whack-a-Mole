const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");

const startSound = new Audio("sounds/gamestart.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const clickSound = new Audio("sounds/click.mp3");
const bgMusic = new Audio("sounds/background.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.3;

let score = 0;
let timeLeft = 60;

let gameTimer = null;
let moleTimer = null;

let currentHole = null;
let gameRunning = false;
let isPaused = false;

function randomHole() {
    holes.forEach(hole => {
        hole.classList.remove("up");
    });
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * holes.length);
    } while (holes[randomIndex] === currentHole);
    currentHole = holes[randomIndex];
    currentHole.classList.add("up");
}

function moveMole() {
    moleTimer = setInterval(() => {
        randomHole();
    }, 700);
}

function countdown() {
    gameTimer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function startGame() {
    clearInterval(gameTimer);
    clearInterval(moleTimer);
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    gameRunning = true;
    isPaused = false;
    pauseBtn.textContent = "Pause";
    message.textContent = "";
    startSound.currentTime = 0;
    startSound.play();
    bgMusic.currentTime = 0;
    bgMusic.play();
    moveMole();
    countdown();
}

function endGame() {
    clearInterval(gameTimer);
    clearInterval(moleTimer);
    gameRunning = false;
    isPaused = false;
    holes.forEach(hole => {
        hole.classList.remove("up");
    });
    pauseBtn.textContent = "Pause";
    bgMusic.pause();
    bgMusic.currentTime = 0;
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    message.textContent = "🎉 Game Over! Final Score: " + score;
}

holes.forEach(hole => {
    hole.addEventListener("click", () => {
        if (!gameRunning)
            return;
        if (hole === currentHole) {
            clickSound.currentTime = 0;
            clickSound.play();
            score++;
            scoreDisplay.textContent = score;
            hole.classList.remove("up");
            currentHole = null;
        }
    });
});

startBtn.addEventListener("click", () => {
    if (gameRunning)
        return;
    startGame();
});

pauseBtn.addEventListener("click", () => {
    if (!gameRunning && !isPaused)
        return;
    if (!isPaused) {
        clearInterval(gameTimer);
        clearInterval(moleTimer);
        bgMusic.pause();
        gameRunning = false;
        isPaused = true;
        pauseBtn.textContent = "Resume";
        message.textContent = "⏸ Game Paused";
    } else {
        gameRunning = true;
        isPaused = false;
        moveMole();
        countdown();
        bgMusic.play();
        pauseBtn.textContent = "Pause";
        message.textContent = "";
    }
});

restartBtn.addEventListener("click", () => {
    startGame();
});