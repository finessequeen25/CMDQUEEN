// Game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const boxSize = 20; // Size of each grid square
let snake = [{ x: 200, y: 200 }]; // Initial snake position
let direction = "RIGHT"; // Initial direction
let food = spawnFood();
let score = 0;
let gameRunning = true; // Whether the game is active
let isPaused = false;   // Whether the game is paused
let gameLoopInterval;   // Interval ID for the game loop

// Neon theme colors
const snakeColor = "#39ff14"; // Neon green
const foodColor = "#f900bf"; // Neon pink
const scoreColor = "#0ef9f9"; // Neon cyan

// Controls for mobile swipe
let touchStartX = 0;
let touchStartY = 0;

// Event listeners
document.addEventListener("keydown", handleKeyPress);
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);

// Start the game loop with a fixed interval
function startGameLoop() {
  if (!gameLoopInterval) {
    gameLoopInterval = setInterval(() => {
      if (!isPaused && gameRunning) {
        gameLoop();
      }
    }, 150); // Game speed
  }
}

// Stop the game loop (used for Game Over)
function stopGameLoop() {
  clearInterval(gameLoopInterval);
  gameLoopInterval = null;
}

// Main game loop
function gameLoop() {
  clearCanvas();
  drawFood();
  moveSnake();
  drawSnake();
  checkCollision();
  drawScore();
}

// Clear the canvas
function clearCanvas() {
  ctx.fillStyle = "#10141d"; // Darker game background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the snake
function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    // Add glow effect
    ctx.strokeStyle = snakeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
  });
}

// Draw the food
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
  // Add glow effect
  ctx.strokeStyle = foodColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(food.x, food.y, boxSize, boxSize);
}

// Draw the score
function drawScore() {
  ctx.fillStyle = scoreColor;
  ctx.font = "20px Arial";
  ctx.shadowColor = scoreColor;
  ctx.shadowBlur = 10;
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Spawn food at a random position
function spawnFood() {
  const foodX = Math.floor((Math.random() * canvas.width) / boxSize) * boxSize;
  const foodY = Math.floor((Math.random() * canvas.height) / boxSize) * boxSize;
  return { x: foodX, y: foodY };
}

// Move the snake
function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case "UP":
      head.y -= boxSize;
      break;
    case "DOWN":
      head.y += boxSize;
      break;
    case "LEFT":
      head.x -= boxSize;
      break;
    case "RIGHT":
      head.x += boxSize;
      break;
  }

  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++; // Increase score
    food = spawnFood(); // Spawn new food
  } else {
    snake.pop(); // Remove the tail
  }
}

// Change direction or pause game
function handleKeyPress(event) {
  const keyPressed = event.key;

  if (keyPressed === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (keyPressed === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  } else if (keyPressed === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (keyPressed === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  } else if (keyPressed === "p" || keyPressed === "P") {
    isPaused = !isPaused; // Toggle pause
  }
}

// Handle swipe start
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

// Handle swipe move
function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) return;

  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "RIGHT") {
      direction = "LEFT";
    } else if (diffX < 0 && direction !== "LEFT") {
      direction = "RIGHT";
    }
  } else {
    if (diffY > 0 && direction !== "DOWN") {
      direction = "UP";
    } else if (diffY < 0 && direction !== "UP") {
      direction = "DOWN";
    }
  }

  touchStartX = 0;
  touchStartY = 0;
}

// Check for collisions
function checkCollision() {
  const head = snake[0];

  // Check wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    endGame();
  }

  // Check self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// End the game
function endGame() {
  gameRunning = false;
  stopGameLoop(); // Stop the game loop
  alert(`Game Over! Your score: ${score}`);
  window.location.reload();
}

// Start the game
startGameLoop();
