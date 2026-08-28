const answer = "CRANE";

let currentRow = 0;
let currentGuess = "";
let gameOver = false;

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const newGameButton = document.getElementById("newGame");

const keyboardRows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACK"]
];

function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < 30; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    board.appendChild(tile);
  }
}

function createKeyboard() {
  keyboard.innerHTML = "";

  keyboardRows.forEach(row => {
    const rowElement = document.createElement("div");
    rowElement.className = "keyboard-row";

    row.forEach(letter => {
      const key = document.createElement("button");
      key.className = "key";
      key.textContent = letter;
      key.dataset.key = letter;

      if (letter === "ENTER" || letter === "BACK")
        key.classList.add("wide");

      key.onclick = () => handleKey(letter);

      rowElement.appendChild(key);
    });

    keyboard.appendChild(rowElement);
  });
}

function handleKey(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key === "BACK") {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
    return;
  }

  if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
    currentGuess += key;
    updateBoard();
  }
}

function updateBoard() {
  const start = currentRow * 5;

  for (let i = 0; i < 5; i++) {
    const tile = board.children[start + i];

    tile.textContent = currentGuess[i] || "";

    tile.classList.toggle("filled", !!currentGuess[i]);
  }
}

function submitGuess() {
  if (currentGuess.length !== 5) {
    message.textContent = "Enter 5 letters";
    return;
  }

  checkGuess(currentGuess);
}

function checkGuess(guess) {
  const start = currentRow * 5;
  const answerLetters = answer.split("");
  const result = Array(5).fill("absent");

  // Correct position
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "correct";
      answerLetters[i] = null;
    }
  }

  // Wrong position
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;

    const index = answerLetters.indexOf(guess[i]);

    if (index !== -1) {
      result[i] = "present";
      answerLetters[index] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    board.children[start + i].classList.add(result[i]);
    updateKeyboard(guess[i], result[i]);
  }

  if (guess === answer) {
    gameOver = true;
    message.textContent = "🎉 You guessed CRANE!";
    return;
  }

  currentRow++;
  currentGuess = "";

  if (currentRow === 6) {
    gameOver = true;
    message.textContent = "The word was CRANE";
  }
}

function updateKeyboard(letter, result) {
  const key = document.querySelector(`[data-key="${letter}"]`);

  if (!key) return;

  if (result === "correct") {
    key.classList.remove("present", "absent");
    key.classList.add("correct");
  } 
  else if (result === "present" &&
           !key.classList.contains("correct")) {
    key.classList.remove("absent");
    key.classList.add("present");
  } 
  else if (result === "absent" &&
           !key.classList.contains("correct") &&
           !key.classList.contains("present")) {
    key.classList.add("absent");
  }
}

document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    handleKey("ENTER");
  } 
  else if (event.key === "Backspace") {
    handleKey("BACK");
  } 
  else {
    const key = event.key.toUpperCase();

    if (/^[A-Z]$/.test(key)) {
      handleKey(key);
    }
  }
});

function newGame() {
  currentRow = 0;
  currentGuess = "";
  gameOver = false;
  message.textContent = "";

  createBoard();
  createKeyboard();
}

newGameButton.onclick = newGame;

newGame();