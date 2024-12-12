document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('game-grid');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const startButton = document.getElementById('start-button');

    const width = 10; // Grid width
    const height = 20; // Grid height
    const gridArray = [];
    let currentPosition = 4; // Starting position of tetromino
    let currentRotation = 0;
    let timerId;
    let score = 0;
    let level = 1;

    // Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)][currentRotation];

    // Create the grid
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        gridArray.push(square);
    }

    function draw() {
        currentTetromino.forEach(index => {
            gridArray[currentPosition + index].classList.add('tetromino');
            gridArray[currentPosition + index].style.backgroundColor = 'orange';
        });
    }

    function undraw() {
        currentTetromino.forEach(index => {
            gridArray[currentPosition + index].classList.remove('tetromino');
            gridArray[currentPosition + index].style.backgroundColor = '';
        });
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (currentTetromino.some(index => gridArray[currentPosition + index + width].classList.contains('taken'))) {
            currentTetromino.forEach(index => gridArray[currentPosition + index].classList.add('taken'));
            // Start a new tetromino
            currentPosition = 4;
            currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)][currentRotation];
            draw();
            addScore();
            gameOver();
        }
    }

    function addScore() {
        for (let i = 0; i < gridArray.length; i += width) {
            const row = [...Array(width)].map((_, idx) => gridArray[i + idx]);
            if (row.every(square => square.classList.contains('taken'))) {
                score += 10;
                scoreDisplay.textContent = score;
                row.forEach(square => {
                    square.classList.remove('taken', 'tetromino');
                    square.style.backgroundColor = '';
                });
                const squaresRemoved = gridArray.splice(i, width);
                gridArray.unshift(...squaresRemoved);
                gridArray.forEach(square => grid.appendChild(square));
            }
        }
    }

    function gameOver() {
        if (currentTetromino.some(index => gridArray[currentPosition + index].classList.contains('taken'))) {
            clearInterval(timerId);
            alert('Game Over');
        }
    }

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
        }
    });
});