const grid = document.querySelector('.grid');
const status = document.getElementById('status');
const scoreDisplay = document.getElementById('score');
const countdownDisplay = document.getElementById('countdown');
let countdownTimer;
let timeLeft = 60;
let score = 0;
let level = 1;
let currentTheme = 'emojis';

const themes = {
    emojis: ['😀', '😎', '🐱', '🐶', '🌟', '🍎', '🍕', '🏀'],
    animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    colors: ['🔵', '🟢', '🟠', '🟣', '🟡', '🔴', '⚫', '⚪']
};

let selectedCards = [];
let matchedPairs = 0;

// Shuffle array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Generate the cards
function generateCards(gridSize) {
    grid.innerHTML = ''; // Clear the grid
    const themeCards = [...themes[currentTheme], ...themes[currentTheme]].slice(0, (gridSize * gridSize) / 2);
    const cards = shuffle(themeCards.concat(themeCards)); // Duplicate and shuffle
    matchedPairs = 0;

    cards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('cell');
        card.dataset.value = value;
        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });
}

// Flip a card
function flipCard(card) {
    if (selectedCards.length < 2 && !card.classList.contains('matched')) {
        card.textContent = card.dataset.value;
        card.classList.add('flipped');
        selectedCards.push(card);

        if (selectedCards.length === 2) {
            checkMatch();
        }
    }
}

// Check for a match
function checkMatch() {
    const [card1, card2] = selectedCards;

    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        updateScore();
        if (matchedPairs === (level + 3) ** 2 / 2) {
            nextLevel();
        }
    } else {
        setTimeout(() => {
            card1.textContent = '';
            card2.textContent = '';
        }, 1000);
    }

    selectedCards = [];
}

// Update the score
function updateScore() {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
}

// Countdown timer
function updateCountdown() {
    if (timeLeft > 0) {
        timeLeft--;
        countdownDisplay.textContent = `Time Left: ${timeLeft} seconds`;
    } else {
        clearInterval(countdownTimer);
        status.textContent = 'Time is up! Game Over!';
        endGame();
    }
}

function resetTimer() {
    clearInterval(countdownTimer);
    timeLeft = 60;
    countdownDisplay.textContent = `Time Left: ${timeLeft} seconds`;
    countdownTimer = setInterval(updateCountdown, 1000);
}

// Move to the next level
function nextLevel() {
    level++;
    status.textContent = `Level: ${level}`;
    grid.style.gridTemplateColumns = `repeat(${level + 3}, 1fr)`;
    generateCards(level + 3);
}

// Reset the game
function resetGame() {
    score = 0;
    level = 1;
    status.textContent = `Level: ${level}`;
    resetTimer();
    updateScore();
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    generateCards(4);
}

// Select a theme
function selectTheme(theme) {
    currentTheme = theme;
    resetGame();
}

// Initialize the game
resetGame();
function addCardListeners(card) {
    card.addEventListener('click', () => flipCard(card));
    card.addEventListener('touchend', () => flipCard(card)); // Add touch support
}
cards.forEach(value => {
    const card = document.createElement('div');
    card.classList.add('cell');
    card.dataset.value = value;
    addCardListeners(card); // Use the helper function
    grid.appendChild(card);
});
