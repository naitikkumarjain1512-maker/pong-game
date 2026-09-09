// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddle = {
    width: 10,
    height: 80,
    x: 10,
    y: canvas.height / 2 - 40,
    dy: 0,
    speed: 6
};

const computerPaddle = {
    width: 10,
    height: 80,
    x: canvas.width - 20,
    y: canvas.height / 2 - 40,
    dy: 0,
    speed: 4.5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 5,
    dy: 5,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

let mouseY = canvas.height / 2;
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle
function updatePlayerPaddle() {
    const moveUp = keys['ArrowUp'];
    const moveDown = keys['ArrowDown'];
    
    if (moveUp && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if (moveDown && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.speed;
    }
    
    // Mouse control
    const targetY = mouseY - paddle.height / 2;
    if (targetY > 0 && targetY < canvas.height - paddle.height) {
        paddle.y = targetY;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const paddleCenter = computerPaddle.y + computerPaddle.height / 2;
    const distance = ball.y - paddleCenter;
    
    if (distance < -35) {
        if (computerPaddle.y > 0) {
            computerPaddle.y -= computerPaddle.speed;
        }
    } else if (distance > 35) {
        if (computerPaddle.y < canvas.height - computerPaddle.height) {
            computerPaddle.y += computerPaddle.speed;
        }
    }
}

// Update ball
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Top and bottom collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }
    
    // Paddle collision detection
    if (checkPaddleCollision(paddle)) {
        ball.dx = -ball.dx;
        ball.x = paddle.x + paddle.width + ball.radius;
        // Add spin based on paddle position
        const deltaY = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        ball.dy += deltaY * 2;
    }
    
    if (checkPaddleCollision(computerPaddle)) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;
        // Add spin based on paddle position
        const deltaY = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
        ball.dy += deltaY * 2;
    }
    
    // Scoring
    if (ball.x - ball.radius < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

// Paddle collision
function checkPaddleCollision(paddle) {
    return ball.x - ball.radius < paddle.x + paddle.width &&
           ball.x + ball.radius > paddle.x &&
           ball.y - ball.radius < paddle.y + paddle.height &&
           ball.y + ball.radius > paddle.y;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    
    // Draw center line
    drawCenterLine();
    
    // Draw paddles
    drawRect(paddle.x, paddle.y, paddle.width, paddle.height, '#00ff00');
    drawRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, '#ff0066');
    
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#00ff00');
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();