const BG_COLOUR = '#231f20';
const SNAKE1_COLOUR = '#66ff00';
const SNAKE2_COLOUR = '#04d9ff';
const FOOD_COLOUR = '#FF0000';

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on ('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay')

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);


function newGame() {
    socket.emit('newGame');
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
}

let canvas, ctx;
let playerNumber
let gameActive = false;

function init() {
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d')
    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
    gameActive = true;
}
function keydown (e) {
    socket.emit('keydown', e.keyCode);
}
function paintGame(state) {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, SNAKE1_COLOUR);
    paintPlayer(state.players[1], size, SNAKE2_COLOUR);
}

    function paintPlayer(playerState, size, colour) {

        const snake = playerState.snake;

        ctx.fillStyle = colour;
        for (let cell of snake) {
            ctx.fillRect(cell.x * size, cell.y * size, size, size);
        }
    }
function handleInit (number) {
    playerNumber = number;
}

function handleGameState(gameState) {
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}
function handleGameOver(data) {
    if (!gameActive) {
        return;
    }
    data = JSON.parse(data);

    gameActive = false;

    if (data.winner === playerNumber) {
        alert("You win! :^)");
    } else {
        alert("You lose. :^(")
    }
}
function handleGameCode(gameCode) {
    gameCodeDisplay.textContent = gameCode;
}
function handleUnknownGame() {
    reset();
    alert("Unknown game code")
}

function handleTooManyPlayers() {
reset();
alert("This game is already in progress");
}
function reset() {
    playerNumber = null;
    gameCodeInput.value = '';
    initialScreen.style.display = "block";
    gameScreen.style.display = "none";
}
