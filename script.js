// Element references
const welcomeScreen = document.getElementById('welcomeScreen');
const setupScreen = document.getElementById('setupScreen');
const waitingScreen = document.getElementById('waitingScreen');
const roomScreen = document.getElementById('roomScreen');
const chatPanel = document.getElementById('chatPanel');
const gamesPanel = document.getElementById('gamesPanel');
const mediaPanel = document.getElementById('mediaPanel');
const ritualsPanel = document.getElementById('ritualsPanel');
const thoughtsPanel = document.getElementById('thoughtsPanel');

let currentAvatar = '🌟';
let currentMood = 'happy';

function showSetup() {
    welcomeScreen.classList.remove('active');
    setupScreen.classList.add('active');
}

function selectAvatar(avatar) {
    currentAvatar = avatar;
    document.querySelectorAll('.avatar').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
}

function selectMood(mood) {
    currentMood = mood;
    document.querySelectorAll('.mood').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
}

function generateRoomCode() {
    // Placeholder function
    const roomName = document.getElementById('roomName').value || 'Soul Room';
    document.getElementById('roomTitle').innerHTML = roomName;
    setupScreen.classList.remove('active');
    waitingScreen.classList.add('active');
    document.getElementById('roomLink').value = 'https://soulroom.app/join/' + Math.random().toString(36).substr(2, 9);
}

function copyLink() {
    const roomLink = document.getElementById('roomLink');
    roomLink.select();
    document.execCommand('copy');
}

function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));

    document.querySelector(`.nav-item[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Panel`).classList.add('active');
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        messageEl.innerHTML = `<span>${currentAvatar}</span>: ${message}`;
        chatMessages.appendChild(messageEl);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function startGame(game) {
    const gameArea = document.getElementById('gameArea');
    gameArea.style.display = 'block';
    
    switch(game) {
        case 'tictactoe':
            gameArea.innerHTML = createTicTacToe();
            break;
        case 'drawing':
            gameArea.innerHTML = createDrawing();
            setTimeout(initDrawingCanvas, 100); // Allow DOM to update first
            break;
        case 'wordgame':
            gameArea.innerHTML = `
                <h3>Word Duel</h3>
                <p>Think of a word and let your partner guess!</p>
                <input type="text" id="wordInput" placeholder="Enter your word...">
                <button onclick="submitWord()">Submit Word</button>
            `;
            break;
        case 'memory':
            gameArea.innerHTML = createMemoryGame();
            break;
    }
}

function createMemoryGame() {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const gameEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    return `
        <h3>Memory Match</h3>
        <div class="memory-board">
            ${gameEmojis.map((emoji, i) => 
                `<div class="memory-card" data-emoji="${emoji}" onclick="flipCard(${i})">
                    <div class="card-inner">
                        <div class="card-front">?</div>
                        <div class="card-back">${emoji}</div>
                    </div>
                </div>`
            ).join('')}
        </div>
        <p id="memoryStatus">Find all the matching pairs!</p>
    `;
}

function loadVideo() {
    const videoUrl = document.getElementById('videoUrl').value;
    if (videoUrl) {
        const mediaPlayer = document.getElementById('mediaPlayer');
        mediaPlayer.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen style="width:100%; height:100%"></iframe>`;
    }
}

function loadMusic() {
    const musicUrl = document.getElementById('musicUrl').value;
    if (musicUrl) {
        const mediaPlayer = document.getElementById('mediaPlayer');
        mediaPlayer.innerHTML = `<iframe src="${musicUrl}" frameborder="0" allow="autoplay" style="width:100%; height:100%"></iframe>`;
    }
}

function waterPlant() {
    alert('You watered the plant together! 🌱');
}

function lightCandle() {
    document.getElementById('candleFlame').style.display = 'block';
    document.getElementById('lightBtn').style.display = 'none';
    document.getElementById('blowBtn').style.display = 'block';
}

function blowCandle() {
    document.getElementById('candleFlame').style.display = 'none';
    document.getElementById('lightBtn').style.display = 'block';
    document.getElementById('blowBtn').style.display = 'none';
}

function submitThought() {
    const thoughtInput = document.getElementById('thoughtInput');
    const thought = thoughtInput.value.trim();
    if (thought) {
        const thoughtsDisplay = document.getElementById('thoughtsDisplay');
        const thoughtEl = document.createElement('div');
        thoughtEl.className = 'thought';
        thoughtEl.innerHTML = `<p>${thought}</p>`;
        thoughtsDisplay.appendChild(thoughtEl);
        thoughtInput.value = '';
    }
}

function leaveRoom() {
    if (confirm('Are you sure you want to leave the room?')) {
        roomScreen.classList.remove('active');
        welcomeScreen.classList.add('active');
    }
}

// Simulate entering the room after waiting
function simulateRoomEntry() {
    setTimeout(() => {
        waitingScreen.classList.remove('active');
        roomScreen.classList.add('active');
        // Simulate partner joining
        document.getElementById('name2').textContent = 'Partner';
        document.getElementById('avatar2').textContent = '🌙';
    }, 3000);
}

// Enhanced game functionality
function createTicTacToe() {
    return `
        <h3>Tic Tac Toe</h3>
        <div class="tictactoe-board" id="tictactoeBoard">
            ${[...Array(9)].map((_, i) => `<div class="cell" onclick="makeMove(${i})"></div>`).join('')}
        </div>
        <p id="gameStatus">Your turn (X)</p>
        <button onclick="resetTicTacToe()">Reset Game</button>
    `;
}

function createDrawing() {
    return `
        <h3>Draw Together</h3>
        <canvas id="drawingCanvas" width="400" height="300" style="border: 1px solid #ccc;"></canvas>
        <div>
            <button onclick="clearCanvas()">Clear</button>
            <input type="color" id="colorPicker" value="#000000">
        </div>
    `;
}

// Tic Tac Toe game logic
let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let gameActive = true;

function makeMove(cellIndex) {
    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        document.getElementsByClassName('cell')[cellIndex].textContent = currentPlayer;
        
        if (checkWinner()) {
            document.getElementById('gameStatus').textContent = `${currentPlayer} wins!`;
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            document.getElementById('gameStatus').textContent = "It's a tie!";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('gameStatus').textContent = `${currentPlayer}'s turn`;
        }
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function resetTicTacToe() {
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
    document.getElementById('gameStatus').textContent = "Your turn (X)";
}

// Drawing canvas functionality
let isDrawing = false;
let canvas, ctx;

function initDrawingCanvas() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.beginPath();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Enhanced mood system
function toggleMood() {
    const moods = ['happy', 'calm', 'excited', 'thoughtful', 'loving', 'peaceful'];
    const currentIndex = moods.indexOf(currentMood);
    const nextIndex = (currentIndex + 1) % moods.length;
    currentMood = moods[nextIndex];
    
    // Change background based on mood
    const moodColors = {
        happy: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        calm: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        excited: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        thoughtful: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        loving: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        peaceful: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    };
    
    document.body.style.background = moodColors[currentMood];
}

