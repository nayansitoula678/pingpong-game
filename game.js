// Select canvas and set up context
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 12, paddleHeight = 80;
const ballSize = 14;

const leftPaddle = {
  x: 0,
  y: canvas.height/2 - paddleHeight/2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#fff"
};

const rightPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height/2 - paddleHeight/2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#fff"
};

const ball = {
  x: canvas.width/2 - ballSize/2,
  y: canvas.height/2 - ballSize/2,
  size: ballSize,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "#fff"
};

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, "#111");

  // Draw paddles
  drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
  drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color);

  // Draw ball
  drawCircle(ball.x, ball.y, ball.size/2, ball.color);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - leftPaddle.height/2;

  // Clamp paddle within bounds
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  if (leftPaddle.y + leftPaddle.height > canvas.height)
    leftPaddle.y = canvas.height - leftPaddle.height;
});

// Simple AI for right paddle
function moveAIPaddle() {
  let target = ball.y - rightPaddle.height/2;
  // Move smoothly toward the ball
  rightPaddle.y += (target - rightPaddle.y) * 0.08;

  // Clamp within bounds
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y + rightPaddle.height > canvas.height)
    rightPaddle.y = canvas.height - rightPaddle.height;
}

// Collision detection
function collision(paddle, ball) {
  return (
    ball.x - ball.size/2 < paddle.x + paddle.width &&
    ball.x + ball.size/2 > paddle.x &&
    ball.y - ball.size/2 < paddle.y + paddle.height &&
    ball.y + ball.size/2 > paddle.y
  );
}

// Ball reset
function resetBall() {
  ball.x = canvas.width/2 - ball.size/2;
  ball.y = canvas.height/2 - ball.size/2;
  // Randomize serve direction
  ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
  ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

// Update game state
function update() {
  // Move ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Top and bottom wall collision
  if (ball.y - ball.size/2 < 0 || ball.y + ball.size/2 > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  // Paddle collision
  if (collision(leftPaddle, ball)) {
    ball.x = leftPaddle.x + leftPaddle.width + ball.size/2; // avoid sticking
    ball.velocityX = -ball.velocityX;
    // Add some "english" based on hit position
    let collidePoint = (ball.y - (leftPaddle.y + leftPaddle.height/2)) / (leftPaddle.height/2);
    ball.velocityY = ball.speed * collidePoint;
  }

  if (collision(rightPaddle, ball)) {
    ball.x = rightPaddle.x - ball.size/2; // avoid sticking
    ball.velocityX = -ball.velocityX;
    let collidePoint = (ball.y - (rightPaddle.y + rightPaddle.height/2)) / (rightPaddle.height/2);
    ball.velocityY = ball.speed * collidePoint;
  }

  // Score check: If ball goes out left or right, reset
  if (ball.x - ball.size/2 < 0 || ball.x + ball.size/2 > canvas.width) {
    resetBall();
  }

  // Move AI paddle
  moveAIPaddle();
}

// Main game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start game
resetBall();
loop();