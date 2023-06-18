/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])


/** makeBoard(): This function creates an empty Connect Four board. It initializes the board variable as a 2-dimensional array with HEIGHT rows and WIDTH columns.
 */

const makeBoard = () => {
  for (let y = 0; y < HEIGHT; y++) {
    //assigns the width value to the length.
    board.push(Array.from({ length: WIDTH })) 
  }
}

//After this function runs, the board variable will be an array of HEIGHT rows, each row containing WIDTH cells. The top-left cell is board[0][0], and the bottom-right cell is board[HEIGHT - 1][WIDTH - 1]
//makeBoard() will result in an in-memory board variable representing an empty Connect FOur game board with HEIGHT rows and WIDTH columns, where each cell is initially set to UNDEFINED

/* makeHtmlBoard(): This function creates the HTML representation of the game board. It dynamically generates a table with HEIGHT rows and WIDTH columns, where each cell represents a position on the game board. It also adds event listeners to the top row of the table, allowing players to interact with the game by clicking on the column they want to drop their piece into. */

const makeHtmlBoard = () => {
  const htmlBoard = document.getElementById("board");
    // Color picker inputs
    const player1ColorInput = document.getElementById('player1-color');
    const player2ColorInput = document.getElementById('player2-color');
  
    // Event listener for player 1 color picker
    player1ColorInput.addEventListener('change', () => {
      player1Color = player1ColorInput.value;
    });
  
    // Event listener for player 2 color picker
    player2ColorInput.addEventListener('change', () => {
      player2Color = player2ColorInput.value;
    });

 //const top creates a table row element representing the top row of the game board. The for loop iterates WIDTH times, and for each iteration, it creates a table cell and appends it to the top row. The table row is then appended to the HTML table representing the game board.
  const top = document.createElement("tr");// creates a new table row (<tr>) element and assigns it to a variable top.
  top.setAttribute("id", "column-top");//sets its ID to "column-top" using setAttribute()
  top.addEventListener("click", handleClick);//adds a click event listener to it using addEventListener() that will call the handleClick() function when the row is clicked.

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td"); //loop that iterates over the number of cells in the first row of the game board (which is determined by the WIDTH constant). For each iteration, it creates a new table cell (<td>) and is given an ID using setAttribut and is set equal to the current value of x, and appends it to the top row.
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);//the first row (top) is appended to the HTML board element (htmlBoard) using the append()

  //use another for loop to create the remaining rows of the game board. Just like above.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");// creates a new table row (<tr>) element and assigns it to a variable row.

    //Now we create the cells for each column in the current row. The for loop iterates WIDTH times, and for each iteration, it creates a table cell td and appends it to the current row. The table row is then appended to the HTML table representing the game board.
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);//appends the cell to the current row
    }
    //The current row is then appended to the HTML board element 
    htmlBoard.append(row);
  }
}

/* findSpotForCol(x): Given a column index x, this function finds the top empty row in that column. It iterates over the cells in the column from bottom to top and returns the row index of the first empty cell it finds. If the column is full, it returns null. */

//For loop iterates over the cells in the column (from bottom to top). 
//for each cell, it checks if the cell is empty (i.e. if its value is undefined).
const findSpotForCol = (x) => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      //If it is, the function returns the y coordinate of the cell, which is the row number.
      return y; 
    }
  }
  //If the loop runs without finding an empty cell, the function returns null.
  return null;
  
}

/*placeInTable(y, x): This function updates the DOM (HTML table) to place a game piece in the specified row y and column x. It creates a new <div> element representing the game piece, assigns the appropriate class and color based on the current player, and appends it to the corresponding cell in the HTML table.*/

//creates a new DIV element with class "piece" and p(currPlayer) -where (currPlayer) can be 1 or 2. It also sets the top property to -50 * (y + 2) to animate the piece dropping from the top of the board. The piece is then inserted into the correct table cell in the HTML board.

//This function takes two arguments, y and x, which represent the coordinates of the cell in the game board where the piece should be placed.
const placeInTable = (y, x) => {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.style.backgroundColor = currPlayer === 1 ? player1Color : player2Color;
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);

  // Check for a win and highlight the winning sequence
  if (checkForWin()) {
    const winningCells = getWinningCells();
    if (winningCells) {
      for (const [winY, winX] of winningCells) {
        const winningCell = document.getElementById(`${winY}-${winX}`);
        winningCell.classList.add('winning-cell');
      }
    }
    return endGame(`Player ${currPlayer} won!`);
  }
};

/* getWinningCells(): This function checks the game board for a winning sequence of four pieces. It iterates over each cell in the board and checks four directions: horizontal, vertical, and two diagonals. If it finds a winning sequence, it returns an array of the coordinates of the winning cells. Otherwise, it returns null.*/
const getWinningCells = () => {
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal right
    [-1, 1], // diagonal left
  ];

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const player = board[y][x];
      if (!player) continue;

      for (const [dy, dx] of directions) {
        let winningCells = [[y, x]];

        for (let i = 1; i < 4; i++) {
          const nextY = y + dy * i;
          const nextX = x + dx * i;

          if (
            nextY >= 0 &&
            nextY < HEIGHT &&
            nextX >= 0 &&
            nextX < WIDTH &&
            board[nextY][nextX] === player
          ) {
            winningCells.push([nextY, nextX]);
          } else {
            break;
          }
        }

        if (winningCells.length === 4) {
          return winningCells;
        }
      }
    }
  }

  return null;
};




/*endGame(msg, winningCells): This function handles the end of the game. It displays a message passed as msg to the user, highlights the winning cells (if provided), and disables further interaction with the game board.*/

const endGame = (msg, winningCells) => {
  alert(msg);

  // Highlight the winning cells
  for (let [y, x] of winningCells) {
    const cell = document.getElementById(`${y}-${x}`);
    cell.firstChild.classList.add('highlight');
  }

  // Disable click event on column top to prevent further moves
  const columnTop = document.getElementById('column-top');
  columnTop.removeEventListener('click', handleClick);
};


/*handleClick(evt): This function handles the click event on a column's top row. It gets the column index from the ID of the clicked cell, finds the top empty row in that column using findSpotForCol(), updates the game board with the current player's piece at the chosen position, updates the HTML table with the new piece using placeInTable(), and checks if the current player has won the game or if there is a tie. Finally, it switches the current player to the next player.*/

const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click); it calls the findSpotForCol function to get the top empty row index y in that column. 
  const y = findSpotForCol(x);
  //if column is full, the findSpotForCol() function will return null, and the click should be ignored, and the function should immediately return without doing anything
  if (y === null) {
    return;
  }
  //update in-memory board with the current players piece at the (y.x) position
  board[y][x] = currPlayer;
  // calls placeInTable to Update DOM by adding new peice into HTML table of board (add new peice to correct cell)
  placeInTable(y, x);

  // checks for a win by calling the checkForWin function, and if there is a win, it calls the endGame function with a message indicating the winner. 
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // if there is a tie,check for tie; check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame('Tie!');
  }

  // Finally, the function switches to the next player; switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}//Ternary operator: condition ? expression if true : expression if false. The condition is currPlayer === 1, which checks if the current player is equal to 1.If the condition is true, the value of currPlayer is updated to 2. If the condition is false, the value of currPlayer is updated to 1.

  /* Longhand: if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
  */

/*checkForWin(): This function checks the game board for a win condition. It iterates over each cell in the board and checks all possible winning combinations: horizontal, vertical, and two diagonals. If it finds a winning sequence, it returns true; otherwise, it continues to the next iteration. If no winning sequence is found, it returns false.*/

// Check four cells to see if they're all color of current player
const checkForWin = () => {
  const _win = cells => {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //This nested loop iterates over all the cells in the board, row by row. The outer loop iterates over all the rows in the board, and the inner loop iterates over all the cells in each row. The loop starts at the top left corner of the board (0, 0) and ends at the bottom right corner of the board (HEIGHT-1, WIDTH-1).
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //This code block creates four arrays for each possible winning combination of cells (horizontal, vertical, diagonal right, diagonal left) and then loops through each cell on the board to check if any of these combinations have a winning sequence of pieces (all of the same color).
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //The if statement checks if there is a win condition on the board. It calls the _win function with four different sets of coordinates: horiz, vert, diagDR, and diagDL. Each of these sets of coordinates represent a potential win condition on the board.
      //If any of these calls to _win returns true, then that means that there is a win condition on the board and the function immediately returns true.If none of the calls to _win return true, then the function continues to the next iteration of the loop to check the next set of potential win conditions.

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

//makeBoard() creates the game board array that will be used to keep track of the state of the game. makeHtmlBoard() creates the HTML elements that represent the game board on the screen and adds event listeners to each cell to enable game play. These functions need to be called at the end of the script so that the board is initialized and ready to play when the page is loaded.

// Add event listener to Restart Game button
const restartGameButton = document.getElementById("restart-game");
restartGameButton.addEventListener("click", restartGame);

// Function to restart the game
function restartGame() {
  // Update player colors globally
  player1Color = document.getElementById("player1-color").value;
  player2Color = document.getElementById("player2-color").value;
  // Reset the board memory
  board = [];
  currPlayer = 1;
  // Clear the HTML board
  const htmlBoard = document.getElementById("board");
  htmlBoard.innerHTML = "";
  // Call the functions to create the board and HTML elements
  makeBoard();
  makeHtmlBoard();
}