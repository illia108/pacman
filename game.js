const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('gameContainer');

const TILE_SIZE = 25;
const ROWS = 31;
const COLS = 28;

// Map legend:
// 1 = wall
// 0 = empty path with dot
// 2 = empty path without dot
// 3 = cherry (top-left)
// 4 = apple (top-right)
// 5 = strawberry (bottom-left)
// 6 = banana (bottom-right)
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,4,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,2,2,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,2,2,2,2,2,2,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,2,2,2,2,2,2,1,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,5,0,0,1,1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,1,1,0,0,6,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Game state
let score = 0;
let totalDots = 0;
let collectedDots = 0;
let winSoundPlayed = false;
let pinkModeEndTime = 0;

// Intro state
let gameState = 'intro'; // 'intro' or 'playing'
let introStartTime = 0;
const INTRO_DURATION = 5000; // 5 seconds
const introBgImage = new Image();
introBgImage.src = 'intro-bg.jpg';

// Audio context for sound effects
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Chomp sound for eating dots
function playChompSound() {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
}

// Fruit sound for eating fruits
function playFruitSound() {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
}

// Win sound
function playWinSound() {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

        gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
        gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.15 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);

        oscillator.start(ctx.currentTime + i * 0.15);
        oscillator.stop(ctx.currentTime + i * 0.15 + 0.3);
    });

    // Voice congratulation after the jingle
    setTimeout(() => {
        playVoiceCongrats();
    }, 800);
}

// Voice congratulation audio
const congratsAudio = new Audio('congrats.mp3');
congratsAudio.volume = 1.0;

function playVoiceCongrats() {
    congratsAudio.currentTime = 0;
    congratsAudio.play().catch(e => console.log('Audio play failed:', e));
}

// Pac-Man
const pacman = {
    x: 14,
    y: 23,
    direction: 'right',
    nextDirection: 'right',
    mouthOpen: true,
    mouthAngle: 0.2
};

// Ghosts - friendly ghosts with cute colors
const ghosts = [
    { x: 13, y: 14, direction: 'left', color: '#ff9999', name: 'Pinky', flying: false, flyY: 0, flyStartTime: 0 },
    { x: 14, y: 14, direction: 'up', color: '#99ffff', name: 'Inky', flying: false, flyY: 0, flyStartTime: 0 },
    { x: 13, y: 15, direction: 'right', color: '#ffcc99', name: 'Clyde', flying: false, flyY: 0, flyStartTime: 0 },
    { x: 14, y: 15, direction: 'down', color: '#cc99ff', name: 'Blinky', flying: false, flyY: 0, flyStartTime: 0 }
];

// Giggle sound (hi-hi)
function playKissSound() {
    const ctx = getAudioContext();

    // First "hi"
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(800, ctx.currentTime);
    osc1.frequency.setValueAtTime(1000, ctx.currentTime + 0.05);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.12);

    // Second "hi" (slightly higher)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(900, ctx.currentTime + 0.15);
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.27);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.27);
}

// Draw a ghost
function drawGhost(ghost) {
    // Skip if ghost has flown away completely
    if (ghost.flying && ghost.flyY < -100) {
        return;
    }

    let x = ghost.x * TILE_SIZE + TILE_SIZE / 2;
    let y = ghost.y * TILE_SIZE + TILE_SIZE / 2;
    const size = TILE_SIZE / 2 - 2;

    // Handle flying animation
    if (ghost.flying) {
        const elapsed = Date.now() - ghost.flyStartTime;
        ghost.flyY = -elapsed * 0.15; // Fly upward slower
        y += ghost.flyY;

        // Wiggle side to side
        x += Math.sin(elapsed * 0.015) * 20;

        // Use white color when flying
        ctx.fillStyle = 'white';
        ctx.globalAlpha = Math.max(0, 1 - elapsed / 4000); // Fade out slower
    } else {
        ctx.fillStyle = ghost.color;
        ctx.globalAlpha = 1;
    }

    // Ghost body (rounded top, wavy bottom)
    ctx.beginPath();
    ctx.arc(x, y - 2, size, Math.PI, 0, false);
    ctx.lineTo(x + size, y + size - 2);

    // Wavy bottom
    for (let i = 0; i < 4; i++) {
        const waveX = x + size - (i + 1) * (size / 2);
        const waveY = y + size - 2 + (i % 2 === 0 ? 4 : 0);
        ctx.lineTo(waveX, waveY);
    }

    ctx.lineTo(x - size, y + size - 2);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = ghost.flying ? '#ffcccc' : 'white';
    ctx.beginPath();
    ctx.arc(x - 4, y - 4, 4, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (look up when flying)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    const pupilOffsetY = ghost.flying ? -6 : -4;
    ctx.arc(x - 3, pupilOffsetY + y, 2, 0, Math.PI * 2);
    ctx.arc(x + 5, pupilOffsetY + y, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1; // Reset alpha
}

// Move ghosts
function moveGhosts() {
    ghosts.forEach(ghost => {
        // Skip flying ghosts
        if (ghost.flying) return;

        // Get possible directions
        const directions = ['up', 'down', 'left', 'right'];
        const validDirections = directions.filter(dir => {
            let nextX = ghost.x;
            let nextY = ghost.y;
            switch (dir) {
                case 'up': nextY--; break;
                case 'down': nextY++; break;
                case 'left': nextX--; break;
                case 'right': nextX++; break;
            }
            return isValidPosition(nextX, nextY);
        });

        // Prefer continuing in same direction, otherwise pick random valid direction
        if (validDirections.length > 0) {
            if (!validDirections.includes(ghost.direction) || Math.random() < 0.2) {
                ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
            }
        }

        // Move in current direction
        let nextX = ghost.x;
        let nextY = ghost.y;
        switch (ghost.direction) {
            case 'up': nextY--; break;
            case 'down': nextY++; break;
            case 'left': nextX--; break;
            case 'right': nextX++; break;
        }

        // Handle tunnel wrapping
        if (nextX < 0) nextX = COLS - 1;
        if (nextX >= COLS) nextX = 0;

        if (isValidPosition(nextX, nextY)) {
            ghost.x = nextX;
            ghost.y = nextY;
        }
    });
}

// Check collision with ghosts
function checkGhostCollision() {
    const now = Date.now();
    ghosts.forEach(ghost => {
        if (!ghost.flying && ghost.x === pacman.x && ghost.y === pacman.y) {
            // Start flying animation
            ghost.flying = true;
            ghost.flyStartTime = now;
            ghost.flyY = 0;
            playKissSound();
            pinkModeEndTime = now + 3000; // Turn pink when kissed!

            // Respawn ghost after 5 seconds
            setTimeout(() => {
                ghost.flying = false;
                ghost.flyY = 0;
                ghost.x = 13 + Math.floor(Math.random() * 2);
                ghost.y = 14 + Math.floor(Math.random() * 2);
            }, 5000);
        }
    });
}

// Count total dots
function countDots() {
    totalDots = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const tile = map[row][col];
            if (tile === 0 || tile === 3 || tile === 4 || tile === 5 || tile === 6) {
                totalDots++;
            }
        }
    }
}

// Draw emoji fruit
function drawFruit(x, y, emoji) {
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x + TILE_SIZE / 2, y + TILE_SIZE / 2 + 1);
}

// Draw the map
function drawMap() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const tile = map[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === 1) {
                // Wall
                ctx.fillStyle = '#ff69b4';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

                // Add inner darker shade for 3D effect
                ctx.fillStyle = '#db7093';
                ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            } else {
                // Path
                ctx.fillStyle = '#4a3042';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

                if (tile === 0) {
                    // Regular dot - yellow coin
                    ctx.fillStyle = '#ffd700';
                    ctx.beginPath();
                    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === 3) {
                    drawFruit(x, y, '🍒');
                } else if (tile === 4) {
                    drawFruit(x, y, '🍎');
                } else if (tile === 5) {
                    drawFruit(x, y, '🍓');
                } else if (tile === 6) {
                    drawFruit(x, y, '🍌');
                }
            }
        }
    }
}

// Draw Pac-Man
function drawPacman() {
    const x = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    const y = pacman.y * TILE_SIZE + TILE_SIZE / 2;
    const radius = TILE_SIZE / 2 - 2;

    // Yellow normally, pink after eating fruit
    const isPinkMode = Date.now() < pinkModeEndTime;
    ctx.fillStyle = isPinkMode ? '#ff69b4' : '#ffff00';
    ctx.beginPath();

    let startAngle, endAngle;
    const mouthSize = pacman.mouthOpen ? pacman.mouthAngle : 0.02;

    switch (pacman.direction) {
        case 'right':
            startAngle = mouthSize * Math.PI;
            endAngle = (2 - mouthSize) * Math.PI;
            break;
        case 'left':
            startAngle = (1 + mouthSize) * Math.PI;
            endAngle = (1 - mouthSize) * Math.PI;
            break;
        case 'up':
            startAngle = (1.5 + mouthSize) * Math.PI;
            endAngle = (1.5 - mouthSize) * Math.PI;
            break;
        case 'down':
            startAngle = (0.5 + mouthSize) * Math.PI;
            endAngle = (0.5 - mouthSize) * Math.PI;
            break;
    }

    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
}

// Check if a position is valid (not a wall)
function isValidPosition(x, y) {
    // Handle tunnel wrapping
    if (x < 0 || x >= COLS) {
        return true;
    }
    if (y < 0 || y >= ROWS) {
        return false;
    }
    return map[y][x] !== 1;
}

// Move Pac-Man
function movePacman() {
    // Try to change direction if requested
    let nextX = pacman.x;
    let nextY = pacman.y;

    switch (pacman.nextDirection) {
        case 'left': nextX--; break;
        case 'right': nextX++; break;
        case 'up': nextY--; break;
        case 'down': nextY++; break;
    }

    if (isValidPosition(nextX, nextY)) {
        pacman.direction = pacman.nextDirection;
    }

    // Move in current direction
    nextX = pacman.x;
    nextY = pacman.y;

    switch (pacman.direction) {
        case 'left': nextX--; break;
        case 'right': nextX++; break;
        case 'up': nextY--; break;
        case 'down': nextY++; break;
    }

    // Handle tunnel
    if (nextX < 0) {
        nextX = COLS - 1;
    } else if (nextX >= COLS) {
        nextX = 0;
    }

    if (isValidPosition(nextX, nextY)) {
        pacman.x = nextX;
        pacman.y = nextY;
    }

    // Collect dots
    const currentTile = map[pacman.y][pacman.x];
    if (currentTile === 0) {
        map[pacman.y][pacman.x] = 2;
        score += 10;
        collectedDots++;
        updateScore();
        playChompSound();
    } else if (currentTile >= 3 && currentTile <= 6) {
        // Fruits: cherry=3, apple=4, strawberry=5, banana=6
        map[pacman.y][pacman.x] = 2;
        score += 50;
        collectedDots++;
        updateScore();
        playFruitSound();
        pinkModeEndTime = Date.now() + 3000; // Pink for 3 seconds
    }

    // Check win condition
    if (collectedDots === totalDots) {
        showWinMessage();
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
}

// Show win message
function showWinMessage() {
    if (!winSoundPlayed) {
        playWinSound();
        winSoundPlayed = true;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff69b4';
    ctx.font = 'bold 48px Comic Sans MS, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('YAY! YOU WIN!', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '24px Comic Sans MS, Arial';
    ctx.fillStyle = '#ffb6c1';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 70);
}

// Animate Pac-Man's mouth
function animateMouth() {
    pacman.mouthAngle += 0.01;
    if (pacman.mouthAngle > 0.3) {
        pacman.mouthAngle = 0;
    }
    pacman.mouthOpen = pacman.mouthAngle > 0.15;
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            pacman.nextDirection = 'left';
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            pacman.nextDirection = 'right';
            e.preventDefault();
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            pacman.nextDirection = 'up';
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            pacman.nextDirection = 'down';
            e.preventDefault();
            break;
        case 'r':
        case 'R':
            restartGame();
            break;
        case 'p':
        case 'P':
            playVoiceCongrats();
            break;
    }
});

document.getElementById('btnUp').addEventListener("click", function(e) {
    pacman.nextDirection = 'up';
    e.preventDefault();
});

document.getElementById('btnDown').addEventListener("click", function(e) {
    pacman.nextDirection = 'down';
    e.preventDefault();
});

document.getElementById('btnLeft').addEventListener("click", function(e) {
    pacman.nextDirection = 'left';
    e.preventDefault();
});

document.getElementById('btnRight').addEventListener("click", function(e) {
    pacman.nextDirection = 'right';
    e.preventDefault();
});

document.getElementById('btnRestart').addEventListener("click", function(e) {
    restartGame();
    e.preventDefault();
});

document.getElementById('btnPlay').addEventListener("click", function(e) {
    playVoiceCongrats();
    e.preventDefault();
});

// Restart the game
function restartGame() {
    // Reset map
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (map[row][col] === 2) {
                // Check if it was originally a fruit position
                if (row === 3 && col === 1) {
                    map[row][col] = 3; // Cherry
                } else if (row === 3 && col === 26) {
                    map[row][col] = 4; // Apple
                } else if (row === 23 && col === 1) {
                    map[row][col] = 5; // Strawberry
                } else if (row === 23 && col === 26) {
                    map[row][col] = 6; // Banana
                } else if (isPathTile(row, col)) {
                    map[row][col] = 0;
                }
            }
        }
    }

    // Reset Pac-Man
    pacman.x = 14;
    pacman.y = 23;
    pacman.direction = 'right';
    pacman.nextDirection = 'right';

    // Reset ghosts
    ghosts[0].x = 13; ghosts[0].y = 14; ghosts[0].direction = 'left'; ghosts[0].flying = false; ghosts[0].flyY = 0;
    ghosts[1].x = 14; ghosts[1].y = 14; ghosts[1].direction = 'up'; ghosts[1].flying = false; ghosts[1].flyY = 0;
    ghosts[2].x = 13; ghosts[2].y = 15; ghosts[2].direction = 'right'; ghosts[2].flying = false; ghosts[2].flyY = 0;
    ghosts[3].x = 14; ghosts[3].y = 15; ghosts[3].direction = 'down'; ghosts[3].flying = false; ghosts[3].flyY = 0;

    // Reset score
    score = 0;
    collectedDots = 0;
    winSoundPlayed = false;
    pinkModeEndTime = 0;
    updateScore();
    countDots();
}

// Check if a tile should have a dot
function isPathTile(row, col) {
    const originalMap = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,2,1,1,1,2,2,1,1,1,2,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,2,1,2,2,2,2,2,2,1,2,1,1,0,1,1,1,1,1,1],
        [2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2],
        [1,1,1,1,1,1,0,1,1,2,1,2,2,2,2,2,2,1,2,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
        [1,3,0,0,1,1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,1,1,0,0,3,1],
        [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
        [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    return originalMap[row][col] === 0;
}

// Game loop
let lastMoveTime = 0;
const moveInterval = 300; // ms between moves
let lastGhostMoveTime = 0;
const ghostMoveInterval = 400; // ghosts move slower than Pac-Man

// Draw intro screen
function drawIntro(timestamp) {
    if (introStartTime === 0) {
        introStartTime = timestamp;
    }

    const elapsed = timestamp - introStartTime;
    const progress = Math.min(elapsed / INTRO_DURATION, 1);

    // Draw background image with original aspect ratio
    ctx.fillStyle = '#ffb6c1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (introBgImage.complete && introBgImage.naturalWidth > 0) {
        const imgRatio = introBgImage.naturalWidth / introBgImage.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgRatio > canvasRatio) {
            // Image is wider - fit to width
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
        } else {
            // Image is taller - fit to height
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
        }

        ctx.drawImage(introBgImage, drawX, drawY, drawWidth, drawHeight);
    }

    // Calculate Pac-Man position (left to right)
    const pacmanSize = 80;
    const startX = -pacmanSize;
    const endX = canvas.width + pacmanSize;
    const pacmanX = startX + (endX - startX) * progress;
    const pacmanY = canvas.height / 2;

    // Draw large animated Pac-Man
    const mouthAngle = 0.2 + Math.sin(timestamp / 50) * 0.15;
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(pacmanX, pacmanY, pacmanSize / 2, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
    ctx.lineTo(pacmanX, pacmanY);
    ctx.closePath();
    ctx.fill();

    // Draw dots being eaten
    ctx.fillStyle = '#ffd700';
    for (let i = 0; i < 8; i++) {
        const dotX = (canvas.width / 9) * (i + 1);
        if (dotX > pacmanX + 20) {
            ctx.beginPath();
            ctx.arc(dotX, pacmanY, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Check if intro is done
    if (elapsed >= INTRO_DURATION) {
        gameState = 'playing';
    }
}

function gameLoop(timestamp) {
    if (gameState === 'intro') {
        drawIntro(timestamp);
        requestAnimationFrame(gameLoop);
        return;
    }

    // Clear canvas
    ctx.fillStyle = '#4a3042';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw map
    drawMap();

    // Move Pac-Man at intervals
    if (timestamp - lastMoveTime > moveInterval) {
        if (collectedDots < totalDots) {
            movePacman();
        }
        lastMoveTime = timestamp;
    }

    // Move ghosts slower than Pac-Man
    if (timestamp - lastGhostMoveTime > ghostMoveInterval) {
        moveGhosts();
        lastGhostMoveTime = timestamp;
    }

    // Animate and draw Pac-Man
    animateMouth();
    drawPacman();

    // Draw ghosts
    ghosts.forEach(ghost => drawGhost(ghost));

    // Check for ghost collision
    checkGhostCollision();

    // Toggle rainbow border when in pink mode (ate fruit)
    const isPinkMode = Date.now() < pinkModeEndTime;
    if (isPinkMode) {
        gameContainer.classList.add('rainbow');
    } else {
        gameContainer.classList.remove('rainbow');
    }

    // Check if game is won
    if (collectedDots >= totalDots) {
        showWinMessage();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// Initialize game
countDots();
requestAnimationFrame(gameLoop);
