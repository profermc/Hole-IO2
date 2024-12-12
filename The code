<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hole.io Game</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; background-color: #f2f2f2; }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script>
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Set the size of the canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Game variables
        let holeX = canvas.width / 2;
        let holeY = canvas.height / 2;
        let holeRadius = 50;
        let holeSpeed = 5;
        let objects = [];
        let score = 0;

        // Object class for the items the hole will consume
        class GameObject {
            constructor(x, y, radius) {
                this.x = x;
                this.y = y;
                this.radius = radius;
            }

            // Draw the object on the canvas
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.closePath();
            }

            // Check if the hole intersects with this object
            isConsumed(holeX, holeY, holeRadius) {
                const dx = this.x - holeX;
                const dy = this.y - holeY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < holeRadius + this.radius;
            }
        }

        // Generate random objects for the hole to consume
        function generateObjects() {
            for (let i = 0; i < 10; i++) {
                let radius = Math.random() * 20 + 10; // random size between 10 and 30
                let x = Math.random() * (canvas.width - radius * 2) + radius;
                let y = Math.random() * (canvas.height - radius * 2) + radius;
                objects.push(new GameObject(x, y, radius));
            }
        }

        // Update the game state (move hole, check for collisions, etc.)
        function update() {
            // Clear the canvas for the next frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw hole
            ctx.beginPath();
            ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();

            // Draw objects
            for (let i = 0; i < objects.length; i++) {
                objects[i].draw();
                if (objects[i].isConsumed(holeX, holeY, holeRadius)) {
                    // Increase score and hole size when an object is consumed
                    score++;
                    holeRadius += 0.5; // Hole grows when consuming objects
                    objects.splice(i, 1); // Remove the consumed object
                    i--; // Adjust the index after removal
                }
            }

            // Display the score
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("Score: " + score, 20, 40);

            // Repeat the game loop
            requestAnimationFrame(update);
        }

        // Handle player movement with arrow keys

        function moveHole(event) {
            if (event.key === "ArrowLeft") {
                holeX -= holeSpeed;
            } else if (event.key === "ArrowRight") {
                holeX += holeSpeed;
            } else if (event.key === "ArrowUp") {
                holeY -= holeSpeed;
            } else if (event.key === "ArrowDown") {
                holeY += holeSpeed;
            }
        }

        // Initialize the game
        generateObjects();
        update();

        // Listen for key presses to move the hole
        window.addEventListener('keydown', moveHole);
    </script>
</body>
</html>
