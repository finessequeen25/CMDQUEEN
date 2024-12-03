const grid = document.querySelector('.grid');
const timer = document.getElementById('timer');
const restartButton = document.getElementById('restart');

let cardsArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [...cardsArray, ...cardsArray]; // Duplicates for matching pairs
let flippedCards = [];
let matchedPairs = 0;
let gameTimer;
let time = 0;

// Shuffle Cards
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start Timer
function startTimer() {
    timer.innerText = `Time: ${time} seconds`;
    gameTimer = setInterval(() => {
        time++;
        timer.innerText = `Time: ${time} seconds`;
    }, 1000);
}

// Create Card Elements
function createCard(cardValue) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="front">${cardValue}</div>
        <div class="back"></div>
    `;
    card.dataset.value = cardValue;
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
}

// Flip Card Logic
function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flip')) return;
    this.classList.add('flip');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check for a Match
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === cardsArray.length) {
            clearInterval(gameTimer);
            alert(`You win! Time: ${time} seconds`);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            flippedCards = [];
        }, 1000);
    }
}

// Initialize Game
function initGame() {
    grid.innerHTML = '';
    shuffledCards = shuffle(cards);
    shuffledCards.forEach(createCard);
    flippedCards = [];
    matchedPairs = 0;
    time = 0;
    clearInterval(gameTimer);
    startTimer();
}

// Restart Game
restartButton.addEventListener('click', initGame);

// Start Game on Load
initGame();
