const GRID_ROWS = 64;
const GRID_COLLS = 128;
const GAME_SPEED = 100;

let isPlaying = false;

const fieldEl = document.getElementById('field');
const ctx = fieldEl.getContext('2d');

let state, nextState, cellSize;

/**
 * r = y = row = i GRID_ROWS
 * c = x = coll = j GRID_COLLS
 * state[r][c]
 */

function init() {
    fieldEl.addEventListener('click', onFieldClick);
    initStates();
    setInterval(gameTick, 100)
}

function drawGrid() {
    const w = fieldEl.offsetWidth,
        h = fieldEl.offsetHeight,
        relW = w / GRID_COLLS - 2,
        relH = h / GRID_ROWS - 2;

    cellSize = relH > relW ? relW : relH;

    ctx.lineWidth = .5;

    for (let i = 0; i <= GRID_COLLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize + 1, 0);
        ctx.lineTo(i * cellSize + 1, cellSize * GRID_ROWS);
        ctx.stroke();
    }

    for (let i = 0; i <= GRID_ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize + 1);
        ctx.lineTo(cellSize * GRID_COLLS, i * cellSize + 1);
        ctx.stroke();
    }
}

function initStates() {
    state = getEmptyState();
    nextState = getEmptyState();
}

function getEmptyState() {
    const state = [];

    for (let i = 0; i < GRID_ROWS; i++) {
        state.push(Array(GRID_COLLS).fill(0));
    }
    return state;
}

function onFieldClick(event) {
    const cell = getCell(event.layerX, event.layerY);
    state[cell.y][cell.x] = state[cell.y][cell.x] ? 0 : 1;
}

function gameTick() {
    ctx.clearRect(0, 0, fieldEl.offsetWidth, fieldEl.offsetHeight);

    if (isPlaying) updateState();

    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            drawCell(i, j);
        }
    }
    drawGrid();
}

function getCell(cx, cy) {
    return {
        x: Math.floor(cx / cellSize),
        y: Math.floor(cy / cellSize)
    }
}

function drawCell(r, c) {
    ctx.fillStyle = state[r][c] ? 'gray' : 'white';

    const x1 = c * cellSize,
          y1 = r * cellSize;
    ctx.beginPath();
    ctx.fillRect(x1, y1, cellSize, cellSize);
}

function updateState() {
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            nextState[i][j] = willLive(i, j);
        }
    }
    state = nextState;
    nextState = getEmptyState();

}

function willLive(r, c) {
    const neighbors = getNeighbors(r, c);
    if (state[r][c] && (neighbors === 3 || neighbors === 2)) return 1;
    else if (state[r][c] && (neighbors <= 1 || neighbors >= 4)) return 0;
    else if (!state[r][c] && neighbors === 3) return 1;
    else return 0;
}

function getNeighbors(r, c) {
    let count = 0;
    const topLeftX = c - 1 < 0 ? 0 : c - 1,
        topLeftY = r - 1 < 0 ? 0 : r - 1,
        bottomRightX = c + 1 >= GRID_COLLS ? GRID_COLLS - 1 : c + 1,
        bottomRightY = r + 1 >= GRID_ROWS ? GRID_ROWS - 1 : r + 1;

    for (let i = topLeftY; i <= bottomRightY; i++) {
        for (let j = topLeftX; j <= bottomRightX; j++) {
            if (r !== i || c !== j) count += state[i][j];
        }
    }
    return count;
}

init();