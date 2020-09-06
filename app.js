document.addEventListener("DOMContentLoaded", () => {
  // Here we have added an element that will run the function as soon as the page is loaded (DOMContentLoaded)
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div")); // Here we have collected all the divs and passed them through Array.from

  const scoreDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start-button"); // querySelector is the same as getElementById (we are using querySelector for a change)
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["orange", "magenta", "red", "lime"];

  // Here are all the shapes, with all their rotations, written with css (complicated stuff)
  const lTetramino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [lTetramino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0; // This ensures that the tetrominoe will appear with its first rotation

  let random = Math.floor(Math.random() * theTetrominoes.length); // Here math.floor will round up the random number of the tetraminoes array to the nearest full number
  let current = theTetrominoes[random][currentRotation]; // This line of code will randomly pick a tetrominoe with its first rotation

  // Draw function
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }
  // Undraw function
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  function control(e) {
    // Assigning functions to keyCodes (Pretty sick)
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  function moveDown() {
    undraw(); // Undraw the shape from its current position
    currentPosition += width; // Add a whole width to it (a whole layer)
    draw(); // Redraw the shape (except now its one layer lower)
    freeze();
  }
  // This function will act like gravity

  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation]; // This function will generate a new tetromino (T) and get it falling
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
    // This loong function basically checks if any (or some) of the boxes below our tetrominoe hava a class of taken,
    // then it will turn all the boxes that form the tetromino to also have a class of taken,
    // therefore making it stop and it hits the bottom of the grid.
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  function rotate() {
    // Rotating tetrominoes
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  // Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2, displayWidth * 2 + 1], //lTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // Setting up the start/pause button
  startButton.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 250);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  function addScore() {
    for (i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        console.log(squaresRemoved);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "The End";
      clearInterval(timerId);
    }
  }
});
