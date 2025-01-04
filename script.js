// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Black hole initialization
let hole = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
};

// Object storage
let objects = [];
const maxHoleSize = 300; // Maximum size of the black hole
let gamePaused = false;

// Utility functions
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Create objects
function createObjects(count) {
    for (let i = 0; i < count; i++) {
        let radius = Math.random() * 20 + 10;
        let x = Math.random() * (canvas.width - 2 * radius) + radius;
        let y = Math.random() * (canvas.height - 2 * radius) + radius;
        objects.push({
            x,
            y,
            radius,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        });
    }
}

// Collision detection and growth
function isColliding(hole, obj) {
    const dx = hole.x - obj.x;
    const dy = hole.y - obj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < hole.radius - obj.radius * 0.5) {
        hole.radius = Math.min(hole.radius + obj.radius * 0.1, maxHoleSize);
        return true;
    }
    return false;
}

// Move objects for dynamic gameplay
function moveObjects() {
    objects.forEach(obj => {
        obj.x += Math.random() * 2 - 1;
        obj.y += Math.random() * 2 - 1;
        obj.x = clamp(obj.x, obj.radius, canvas.width - obj.radius);
        obj.y = clamp(obj.y, obj.radius, canvas.height - obj.radius);
    });
}

// Draw objects and black hole
function drawObjects() {
    objects.forEach(obj => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fillStyle = obj.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawHole() {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// Game loop
function gameLoop() {
    if (gamePaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHole();
    drawObjects();

    for (let i = objects.length - 1; i >= 0; i--) {
        if (isColliding(hole, objects[i])) {
            objects.splice(i, 1);
        }
    }

    moveObjects();
    requestAnimationFrame(gameLoop);
}

// Input handling
window.addEventListener("mousemove", (e) => {
    hole.x = clamp(e.clientX, hole.radius, canvas.width - hole.radius);
    hole.y = clamp(e.clientY, hole.radius, canvas.height - hole.radius);
});

canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    hole.x = clamp(touch.clientX - rect.left, hole.radius, canvas.width - hole.radius);
    hole.y = clamp(touch.clientY - rect.top, hole.radius, canvas.height - hole.radius);
    e.preventDefault(); // Prevent scrolling
});

// Pause functionality
window.addEventListener("keydown", (e) => {
    if (e.key === "p") {
        gamePaused = !gamePaused;
        if (!gamePaused) gameLoop(); // Resume game if unpaused
    }
});

// Start game
createObjects(50);
gameLoop();  
