let gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let value = 0;
let gameScore = 0;
let highScore = 0;
const ROW_SIZE = 4;
const COL_SIZE = 4;

const colorMapper = {
  0: 'empty',
  2: 'two',
  4: 'four',
  8: 'eight',
  16: 'sixteen',
  32: 'thirteen',
  64: 'sixty-four',
  128: 'one-twenty-eight',
};

const colorClass = (value) => {
  return `${colorMapper[value]}`;
};

const init = () => {
  const hs = window.localStorage.getItem('high-score');
  if (hs) {
    highScore = +hs;
  }
  document.getElementById('high-score').innerHTML = highScore;
  const container = document.querySelector('.grid-container');
  for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < COL_SIZE; j++) {
      const cellValue = gameBoard[i][j];
      const element = document.createElement('div');
      element.innerHTML = cellValue || '';
      element.id = `${i}-${j}`;
      element.classList.add(`x${cellValue}`);
      //console.log(i, j);
      container.appendChild(element);
    }
  }
  setTwo();
  setTwo();
};

const filterZeros = (board) => {
  return board.filter((e) => e !== 0);
};

const fillColor = (board, index, direction) => {
  for (let i = 0; i < COL_SIZE; i++) {
    const tile = document.getElementById(
      direction === 'LEFT' ? `${index}-${i}` : `${i}-${index}`
    );
    const cellValue =
      direction === 'LEFT' ? gameBoard[index][i] : gameBoard[i][index];
    tile.innerHTML = cellValue || '';
    tile.className = '';
    tile.classList.add(`x${cellValue}`);
  }
};

const slide = (board) => {
  let filterZero = filterZeros(board);
  for (let k = 0; k < filterZero.length - 1; k++) {
    if (filterZero !== 0 && filterZero[k] === filterZero[k + 1]) {
      filterZero[k] = 2 * filterZero[k];
      gameScore += filterZero[k];
      if (filterZero[k] === 2048) val = 2048;
      filterZero[k + 1] = 0;
    }
  }
  filterZero = filterZeros(filterZero);
  while (filterZero.length < ROW_SIZE) {
    filterZero.push(0);
  }
  return filterZero;
};

const slideLeft = () => {
  for (let i = 0; i < ROW_SIZE; i++) {
    gameBoard[i] = slide(gameBoard[i]);
    fillColor(gameBoard[i], i, 'LEFT');
  }
};

const slideRight = () => {
  for (let i = 0; i < ROW_SIZE; i++) {
    gameBoard[i] = slide(gameBoard[i].reverse()).reverse();
    fillColor(gameBoard[i], i, 'LEFT');
  }
};

const slideUp = () => {
  for (let i = 0; i < COL_SIZE; i++) {
    //let filterZero = filterZeros(gameBoard[i]);
    const columnData = new Array(COL_SIZE);
    for (let j = 0; j < ROW_SIZE; j++) {
      columnData.push(gameBoard[j][i]);
    }
    const result = slide(columnData);
    for (let j = 0; j < ROW_SIZE; j++) {
      gameBoard[j][i] = result[j];
    }
    fillColor(gameBoard[i], i, 'UP');
  }
};

const slideDown = () => {
  for (let i = 0; i < COL_SIZE; i++) {
    //let filterZero = filterZeros(gameBoard[i]);
    const columnData = new Array(COL_SIZE);
    for (let j = 0; j < ROW_SIZE; j++) {
      columnData.push(gameBoard[j][i]);
    }
    const result = slide(columnData.reverse()).reverse();
    for (let j = 0; j < ROW_SIZE; j++) {
      gameBoard[j][i] = result[j];
    }
    fillColor(gameBoard[i], i, 'UP');
  }
};

const hasEmpty = (empty) => {
  let isZero = false;
  for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < COL_SIZE; j++) {
      if (gameBoard[i][j] === 0) {
        isZero = true;
        empty.push({ i, j });
      }
    }
  }
  console.log('empty', empty);
  return isZero;
};

const setTwo = () => {
  const empty = [];
  if (!hasEmpty(empty)) {
    console.log('isEMpty');
    return true;
  }

  const position = Math.floor(Math.random() * empty.length);
  console.log('del', position, empty[position]);
  const { i, j } = empty[position];
  gameBoard[i][j] = 2;
  const tile = document.getElementById(`${i}-${j}`);
  const cellValue = 2;
  tile.innerHTML = cellValue || '';
  tile.className = '';
  tile.classList.add('x2');
  return false;
};

const checkForGameEnd = () => {
  let isGameEnded = true;
  for (let i = 0; i < ROW_SIZE; i++) {
    let check = false;
    for (let j = 0; j < COL_SIZE; j++) {
      if (i === ROW_SIZE - 1 && j === COL_SIZE - 1) {
        continue;
      }
      if (i === ROW_SIZE - 1 && j !== COL_SIZE - 1) {
        if (gameBoard[i][j] === gameBoard[i][j + 1]) {
          isGameEnded = false;
          check = true;
          break;
        }
      } else if (j === COL_SIZE - 1 && i !== ROW_SIZE - 1) {
        if (gameBoard[i][j] === gameBoard[i + 1][j]) {
          isGameEnded = false;
          check = true;
          break;
        }
      } else if (
        gameBoard[i][j] === gameBoard[i][j + 1] ||
        gameBoard[i][j] === gameBoard[i + 1][j]
      ) {
        isGameEnded = false;
        check = true;
        break;
      }
    }
    if (check) break;
  }
  return isGameEnded;
};

document.addEventListener('keyup', (e) => {
  if (e.code == 'ArrowLeft') {
    slideLeft();
  } else if (e.code == 'ArrowRight') {
    slideRight();
  } else if (e.code == 'ArrowUp') {
    slideUp();
  } else if (e.code == 'ArrowDown') {
    slideDown();
  }

  if (value === 2048) {
    gameOver();
    return;
  }
  //const status = setTwo();
  if (setTwo() && checkForGameEnd()) {
    alert('game ended');
    gameOver();
    return;
  }
  document.getElementById('score').innerText = gameScore;
});

init();

document.querySelector('.restart-button').addEventListener('click', () => {
  gameOver();
});

function gameOver() {
  console.log(gameScore, highScore);
  if (gameScore > highScore) {
    window.localStorage.setItem('high-score', gameScore);
  }
  document.querySelector('.grid-container').innerHTML = '';
  document.getElementById('score').innerHTML = '0';
  gameBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  value = 0;
  gameScore = 0;
  init();
}
