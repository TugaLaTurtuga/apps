let rows = 7;
        let cols = 5;
        let margin = 10;
        let padding = 5;
        let cellSize;
        let virtualBoard = [];
        let buttonRects = [];
        let currentNumber = 0;
        let finished = false;
        let time = 0;
        let startTime = null;
        let extraMarginTop;
        let colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#A633FF", "#33FFF6", "#F6FF33", "#FF8A33", "#8AFF33", "#33FF99"];
        let leaderboard = [];
        let playerName = 'anonymous';
        let TimeSrting = '';
        let leaderboardIsOpen = false;
        let gameStarted = false;
        let drawnedStartGameCanvas = false;
        let canClick = true;

        function start() {
            gameStarted = true;
            rows = parseInt(document.getElementById('rows').value);
            cols = parseInt(document.getElementById('cols').value);
            document.getElementById("time-container").style.display = 'block';
            document.getElementById("stop-container").style.display = 'block';
            virtualBoard = [];
            currentNumber = 0;
            finished = false;
            startTime = null;
            setup();
        }

        function setup() {
            cellSize = 75 - ((cols / 4) + (rows / 2)) * 5;
            extraMarginTop = cellSize;
            let canvasWidth = cellSize * (cols + 1) + padding * (cols - 4) - margin;
            let canvasHeight = cellSize * (rows + 1) + extraMarginTop / 2 + 2 + margin;
            createCanvas(canvasWidth, canvasHeight);
            frameRate(244);
            initializeBoard();
            textFont('Radio Canada');
            loop();
        }

        function draw() {
            if (!gameStarted) {
                if (!drawnedStartGameCanvas) {
                    background(255);
                    createCanvas(100, 100)
                    textSize(16);
                    textAlign(CENTER, CENTER);
                    fill(0);
                    text('Start Game', width / 2, height / 2);
                    drawnedStartGameCanvas = true
                }
                return;
            }
            drawTimer();
            background(255);
            drawGrid();
            drawBalls();
            drawSelectedBall();
            if (finished) {
                drawRestartButton();
                endGame();
            }
        }

        function initializeBoard() {
            let totalCells = rows * cols;
            let maxNumber = cols - 1; // This determines the highest number to be used
            let maxOccurrences = rows;

            let numbers = [];
            for (let num = 1; num <= maxNumber; num++) {
                numbers.push(...Array(maxOccurrences).fill(num));
            }

            numbers = shuffle(numbers);

            for (let col = 0; col < cols; col++) {
                let newRow = [];
                for (let row = 0; row < rows; row++) {
                    if (col === cols - 1) {
                        newRow.push(0); // Last column should be all zeros
                    } else {
                        newRow.push(numbers.pop());
                    }
                }
                virtualBoard.push(newRow);
            }
        }

        function drawGrid() {
            strokeWeight(5);
            stroke(0);
            for (let col = 0; col <= cols; col++) {
                let startY = height - margin;
                let x = margin + col * (cellSize + padding);
                line(x, startY, x, startY - cellSize * rows);
            }
        }

        function drawBalls() {
            buttonRects = [];
            let xStart = margin + cellSize / 2 + 2.5;
            let yStart = margin + extraMarginTop / 1.2 + cellSize;

            // Iterate over columns and rows to draw ellipses
            for (let col = 0; col < cols; col++) {
                let x = xStart + col * (cellSize + padding);
               for (let row = 0; row < rows; row++) {
                   let y = yStart + row * (cellSize);
                   let number = virtualBoard[col][rows - 1 - row];

                   if (number !== 0) {
                      if (colors[number] === undefined) {
                            colors[number] = color(random(255), random(255), random(255));
                        }
                        fill(colors[number]);
                        ellipse(x, y, cellSize - padding, cellSize - padding);
                    }
                }

                // Calculate the rectangle corresponding to this column
                let rectX = margin + col * (cellSize + padding);
                let rectY = margin + extraMarginTop * 1.5;
                let rectW = cellSize;
                let rectH = height - margin * 2 - extraMarginTop * 1.5;

                buttonRects.push(new Rect(rectX, rectY, rectW, rectH));
            }
        }

        function drawSelectedBall() {
            if (currentNumber !== 0) {
                let y = margin + padding + cellSize / 2;
                let x = mouseX;
                fill(colors[currentNumber]);
                ellipse(x, y, cellSize - padding / 2, cellSize - padding / 2);
            }
        }

        function drawTimer() {
            if (startTime !== null) {
                time = (millis() - startTime) / 1000;
            } else {
                time = 0;
            }

            // Define the text to be displayed
            TimeSrting = nf(time, 0, 2);

            let timercontainer = document.getElementById("time-container");
            timercontainer.innerHTML = `<h3>[Time: ${TimeSrting}]</h3>`;
        }

        function drawRestartButton() {
            let buttonWidth = 200;
            let buttonHeight = 50;
            let buttonX = (width - buttonWidth) / 2;
            let buttonY = (height - buttonHeight) / 2;
            let borderRadius = 20;

            // Draw shadow
            let shadowOffsetX = 0;
            let shadowOffsetY = 4;
            let shadowBlur = 8;
            fill(0, 0, 0, 51); // RGBA: 0, 0, 0, 0.2 -> 51 is 20% of 255
            noStroke();
            rect(buttonX + shadowOffsetX, buttonY + shadowOffsetY, buttonWidth, buttonHeight, borderRadius);

            // Draw rounded rectangle button
            let buttonColor = color(255); // Button background color
            fill(buttonColor);
            stroke(buttonColor);
            strokeWeight(0); // Button border width
            rect(buttonX, buttonY, buttonWidth, buttonHeight, borderRadius);

            // Draw button text
            textSize(32);
            textAlign(CENTER, CENTER);
            textStyle(BOLD)
            fill(0); // Text color
            text('Try again', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
        }

        function mousePressed() {
            if (!canClick) {
                return;
            }
            else if (!gameStarted) {
                let buttonWidth = width;
                let buttonHeight = height;
                let buttonX = (width - buttonWidth) / 2;
                let buttonY = (height - buttonHeight) / 2;
                if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                    start();
                }
                return;
            }
            else if (finished) {
                let buttonWidth = 200;
                let buttonHeight = 50;
                let buttonX = (width - buttonWidth) / 2;
                let buttonY = (height - buttonHeight) / 2;
                if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                    start();
                }
                return;
            }
            for (let col = 0; col < buttonRects.length; col++) {
                let rect = buttonRects[col];
                if (rect.contains(mouseX, mouseY)) {
                    if (currentNumber === 0) {
                        for (let row = rows - 1; row >= 0; row--) {
                            let number = virtualBoard[col][row];
                            if (number !== 0) {
                                virtualBoard[col][row] = 0;
                                currentNumber = number;
                                
                                if (startTime === null) {
                                    startTime = millis();
                                }
                                
                                break;
                            }
                        }
                    } else {
                        for (let row = 0; row < rows; row++) {
                            let number = virtualBoard[col][row];
                            if (number === 0) {
                                virtualBoard[col][row] = currentNumber;
                                currentNumber = 0;
                                checkWinCondition();
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }

        function checkWinCondition() {
            let won = true;
            for (let col = 0; col < cols; col++) {
                let number = virtualBoard[col][rows - 1];
                for (let row = 0; row < rows; row++) {
                    if (virtualBoard[col][row] !== number) {
                        won = false;
                        break;
                    }
                }
            }
            if (won) {
                finished = true;
                noLoop();
            }
        }

        function endGame() {
            if (finished) {
                // Save leaderboard for the specific configuration
                let leaderboardKey = `leaderboard_${rows}_${cols}`;
                let playerName = document.getElementById('player-name').value.trim() || 'anonymous';
                let score = TimeSrting;
                
                leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
                leaderboard.push({ name: playerName, score: score });
                leaderboard.sort((a, b) => a.score - b.score);
                leaderboard = leaderboard.slice(0, 10);
                
                localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
            }
        }

        function openOrCloseLeaderboard(){
            if (leaderboardIsOpen) {
                hideLeaderboard()
            }
            else {
                showLeaderboard()
            }
        }

        function showLeaderboard() {
            let leaderboardKey = `leaderboard_${rows}_${cols}`;
            leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
            document.getElementById('leaderboard').style.display = 'block';
            updateLeaderboardDisplay();
            leaderboardIsOpen = true;
            canClick = false;
            
        }

        function hideLeaderboard() {
            document.getElementById('leaderboard').style.display = 'none';
            leaderboardIsOpen = false;

            // Set canClick to true after 10ms
            setTimeout(() => {
                canClick = true;
            }, 10);
        }

        function updateLeaderboardDisplay() {
            let Chossenleaderboard = document.getElementById('chossen-leaderboard');
            Chossenleaderboard.innerHTML = `<h3>[Rows: ${rows}, Cols: ${cols}]</h3>`;

            let leaderboardList = document.getElementById('leaderboard-list');
            leaderboardList.innerHTML = '';
            leaderboard.forEach(entry => {
                let entryDiv = document.createElement('div');
                entryDiv.textContent = `${entry.name}: ${entry.score}`;
                leaderboardList.appendChild(entryDiv);
            });
        }

        class Rect {
            constructor(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            }
            
            contains(px, py) {
                return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
            }
        }

        // Load leaderboard from local storage on page load
        window.onload = function() {
            // No need to initialize leaderboard here anymore
        };