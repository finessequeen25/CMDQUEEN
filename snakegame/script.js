const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score
let gameRunning = true;
let isPaused = false;
let gameLoopInterval;

// Neon theme colors
const snakeColor = "#39ff14";
const foodColor = "#f900bf";
const scoreColor = "#0ef9f9";

// Swipe gesture variables
let touchStartX = 0;
let touchStartY = 0;

// Add event listeners
document.addEventListener("keydown", handleKeyPress);
document.getElementById("pauseButton").addEventListener("click", togglePause);

// Add touch event listeners for swipe detection
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchend", handleTouchEnd);
canvas.addEventListener("touchmove", (e) => e.preventDefault()); // Prevent scrolling during swipes

// Start the game loop
function startGameLoop() {
  if (!gameLoopInterval) {
    gameLoopInterval = setInterval(() => {
      if (!isPaused && gameRunning) {
        gameLoop();
      }
    }, 150);
  }
}

// Stop the game loop
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
  ctx.fillStyle = "#10141d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the snake
function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    ctx.strokeStyle = snakeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
  });
}

// Draw the food
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
  ctx.strokeStyle = foodColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(food.x, food.y, boxSize, boxSize);
}

// Draw the score and high score
function drawScore() {
  ctx.fillStyle = scoreColor;
  ctx.font = "20px Arial";
  ctx.shadowColor = scoreColor;
  ctx.shadowBlur = 10;
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 40);
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

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore); // Save high score
    }
  } else {
    snake.pop();
  }
}

// Handle keypress events
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
    togglePause();
  }
}

// Handle swipe start
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

// Handle swipe end
function handleTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Determine the swipe direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && direction !== "LEFT") {
      direction = "RIGHT"; // Swipe right
    } else if (deltaX < 0 && direction !== "RIGHT") {
      direction = "LEFT"; // Swipe left
    }
  } else {
    // Vertical swipe
    if (deltaY > 0 && direction !== "UP") {
      direction = "DOWN"; // Swipe down
    } else if (deltaY < 0 && direction !== "DOWN") {
      direction = "UP"; // Swipe up
    }
  }
}

// Pause/unpause the game
function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseButton").innerText = isPaused ? "Resume" : "Pause";
}

// Check collisions
function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    endGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// End the game
function endGame() {
  gameRunning = false;
  stopGameLoop();
  alert(`Game Over! Your score: ${score}`);
  window.location.reload();
}

// Start the game
startGameLoop();
