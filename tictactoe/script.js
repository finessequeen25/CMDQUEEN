const board = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const difficultySelector = document.getElementById('difficulty'); // Dropdown for difficulty level
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

// Function to check for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (
            gameBoard[a] &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {
            status.textContent = `Player ${gameBoard[a]} wins!`;
            gameOver = true;
            return true;
        }
    }

    if (!gameBoard.includes('')) {
        status.textContent = "It's a draw!";
        gameOver = true;
        return true;
    }

    return false;
}

// AI for Easy Level: Random move
function easyAI() {
    const emptyIndices = gameBoard.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
    if (emptyIndices.length > 0) {
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
    return null;
}

// AI for Medium Level: Random move + Blocking
function mediumAI() {
    // Check if AI can block the player
    const blockMove = findWinningMove('X');
    if (blockMove !== null) {
        return blockMove;
    }
    // Otherwise, make a random move
    return easyAI();
}

// AI for Hard Level: Strategic (Win, Block, Random)
function hardAI() {
    // Check if AI can win
    const winMove = findWinningMove('O');
    if (winMove !== null) {
        return winMove;
    }
    // Check if AI can block the player
    const blockMove = findWinningMove('X');
    if (blockMove !== null) {
        return blockMove;
    }
    // Otherwise, make a random move
    return easyAI();
}

// Helper function to find winning moves
function findWinningMove(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (
            gameBoard[a] === player &&
            gameBoard[b] === player &&
            gameBoard[c] === ''
        ) {
            return c;
        }
        if (
            gameBoard[a] === player &&
            gameBoard[c] === player &&
            gameBoard[b] === ''
        ) {
            return b;
        }
        if (
            gameBoard[b] === player &&
            gameBoard[c] === player &&
            gameBoard[a] === ''
        ) {
            return a;
        }
    }

    return null;
}

// Function for the computer to play
function computerPlay() {
    if (gameOver) return;

    let move;
    const difficulty = difficultySelector.value;

    if (difficulty === 'easy') {
        move = easyAI();
    } else if (difficulty === 'medium') {
        move = mediumAI();
    } else if (difficulty === 'hard') {
        move = hardAI();
    }

    if (move !== null) {
        gameBoard[move] = 'O';
        board[move].textContent = 'O';
        board[move].style.pointerEvents = 'none'; // Disable interaction
        checkWinner();
        if (!gameOver) {
            currentPlayer = 'X';
            status.textContent = "Player X's turn";
        }
    }
}

// Function to handle a player's turn
function handlePlayerTurn(index) {
    if (gameBoard[index] === '' && !gameOver) {
        gameBoard[index] = 'X';
        board[index].textContent = 'X';
        board[index].style.pointerEvents = 'none'; // Disable interaction
        if (!checkWinner()) {
            currentPlayer = 'O';
            status.textContent = "Computer's turn";
            setTimeout(computerPlay, 500); // Delay to simulate thinking
        }
    }
}

// Reset the game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    board.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto'; // Re-enable interaction
    });
    currentPlayer = 'X';
    status.textContent = "Player X's turn";
    gameOver = false;
}

// Add event listeners to each cell
board.forEach((cell, index) => {
    cell.addEventListener('click', () => handlePlayerTurn(index));
});

// Add event listener to reset button
resetButton.addEventListener('click', resetGame);
