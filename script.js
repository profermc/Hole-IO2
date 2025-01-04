// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scale = 1; // Scaling factor for responsive design
canvas.width = window.innerWidth * scale;
canvas.height = window.innerHeight * scale;

// Hole initialization
let hole = { x: canvas.width / 2, y: canvas.height / 2, radius: 20 }; // Initial size of the black hole

// Object storage
let objects = [];
let walls = [];
let gameWon = false;
let gameLost = false;
const maxHoleSize = 300; // Maximum size of the black hole
const timeLimit = 120000; // 2 minutes
let startTime = Date.now();
let paused = false;

// Utility functions
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Create objects with collision avoidance
function createObjects(count) {
    for (let i = 0; i < count; i++) {
        let x, y, radius, valid;
        do {
            radius = Math.random() * 20 + 10;
            x = Math.random() * (canvas.width / scale - 2 * radius) + radius;
            y = Math.random() * (canvas.height / scale - 2 * radius) + radius;
            valid = objects.every(obj => {
                const dx = obj.x - x;
                const dy = obj.y - y;
                return Math.sqrt(dx * dx + dy * dy) > obj.radius + radius;
            });
        } while (!valid);
        objects.push({ x, y, radius, color: `hsl(${Math.random() * 360}, 70%, 60%)` });
    }
}

// Create walls for obstacles
function createWalls() {
    walls = [
        { x: 50, y: 100, width: canvas.width - 100, height: 20 },
        { x: 50, y: 100, width: 20, height: canvas.height - 200 },
        { x: 50, y: canvas.height - 120, width: canvas.width - 100, height: 20 },
        { x: canvas.width - 70, y: 100, width: 20, height: canvas.height - 200 },
    ];
}

// Draw walls and handle collisions
function drawWalls() {
    walls.forEach(wall => {
        ctx.fillStyle = "brown";
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

        if (
            hole.x + hole.radius > wall.x &&
            hole.x - hole.radius < wall.x + wall.width &&
            hole.y + hole.radius > wall.y &&
            hole.y - hole.radius < wall.y + wall.height
        ) {
            if (hole.x < wall.x) hole.x = wall.x - hole.radius; // Left collision
            if (hole.x > wall.x + wall.width) hole.x = wall.x + wall.width + hole.radius; // Right collision
            if (hole.y < wall.y) hole.y = wall.y - hole.radius; // Top collision
            if (hole.y > wall.y + wall.height) hole.y = wall.y + wall.height + hole.radius; // Bottom collision
        }
    });
}

// Collision detection, growth, and lose condition
function isColliding(hole, obj) {
    const dx = hole.x - obj.x;
    const dy = hole.y - obj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < hole.radius - obj.radius * 0.5) {
        const growthRate = Math.max(obj.radius * 0.05, 3);
        hole.radius += growthRate * (1 - hole.radius / maxHoleSize);
        objects.forEach(o => (o.radius += growthRate * 0.1)); // Scale food size
        return true;
    }
    if (distance < obj.radius && obj.radius > hole.radius) {
        showLoseScreen();
        return false;
    }
    return false;
}

// Move objects dynamically based on size
function moveObjects() {
    objects.forEach(obj => {
        const dx = hole.x - obj.x;
        const dy = hole.y - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (obj.radius < hole.radius) {
            obj.x -= (dx / distance) * 1.5;
            obj.y -= (dy / distance) * 1.5;
        } else {
            obj.x += (dx / distance) * 1.5;
            obj.y += (dy / distance) * 1.5;
        }

        obj.x = clamp(obj.x, obj.radius, canvas.width / scale - obj.radius);
        obj.y = clamp(obj.y, obj.radius, canvas.height / scale - obj.radius);
    });
}

// Show win screen
function showWinScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Won!", canvas.width / 2, canvas.height / 2);
    setTimeout(() => {
        resetGame();
    }, 3000);
}

// Show lose screen
function showLoseScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Lose!", canvas.width / 2, canvas.height / 2);
    setTimeout(() => {
        resetGame();
    }, 3000);
}

// Reset game
function resetGame() {
    hole.radius = 20;
    objects = [];
    createObjects(50);
    gameWon = false;
    gameLost = false;
    startTime = Date.now();
    createWalls();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (paused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();

    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fillStyle = obj.color;
        ctx.fill();
        ctx.closePath();

        if (isColliding(hole, obj)) objects.splice(i, 1);
    }

    moveObjects();
    checkWin();
    if (!gameWon && !gameLost) requestAnimationFrame(gameLoop);
}

// Check win condition
function checkWin() {
    const timeElapsed = Date.now() - startTime;
    if (hole.radius >= maxHoleSize || timeElapsed >= timeLimit) {
        gameWon = true;
        showWinScreen();
    }
}

// Input handling
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    hole.x = (e.clientX - rect.left) * scale;
    hole.y = (e.clientY - rect.top) * scale;
});

canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    hole.x = (touch.clientX - rect.left) * scale;
    hole.y = (touch.clientY - rect.top) * scale;
    e.preventDefault();
});

window.addEventListener("keydown", (e) => {
    if (e.key === "p") paused = !paused;
    if (!paused) gameLoop();
});

// Initialize game
createObjects(50);
createWalls();
gameLoop();
