import { Piece } from "./classes.js";

// NOTE:
// Im still not exactly sure how we are going to render the pieces on the board. Raw CSS is a way (add a specific class to show a piece)
// but I wonder if its possible to do something else like, iterate over the board state, and call a method that takes in the space coordiantes
// and said method would mutate the dom, im just theory crafting but im thinking CSS is probably the simplest solution
// meaning, CSS that reacts to the 'boardState' array

// Can probably refactor this with swithc case, for example:
// case (y == 0) switch
function getPiece(y, x) {
  const piece = new Piece();
  // Black
  if (y == 0 && x == 0) {
    piece.color = "black";
    piece.type = "rook";
    return piece;
  }
  if (y == 0 && x == 1) {
    piece.color = "black";
    piece.type = "knight";
    return piece;
  }
  if (y == 0 && x == 2) {
    piece.color = "black";
    piece.type = "bishop";
    return piece;
  }
  if (y == 0 && x == 3) {
    piece.color = "black";
    piece.type = "queen";
    return piece;
  }
  if (y == 0 && x == 4) {
    piece.color = "black";
    piece.type = "king";
    return piece;
  }
  if (y == 0 && x == 5) {
    piece.color = "black";
    piece.type = "bishop";
    return piece;
  }
  if (y == 0 && x == 6) {
    piece.color = "black";
    piece.type = "knight";
    return piece;
  }
  if (y == 0 && x == 7) {
    piece.color = "black";
    piece.type = "rook";
    return piece;
  }
  if (y == 1 && x == 0) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  if (y == 1 && x == 1) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  if (y == 1 && x == 2) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  if (y == 1 && x == 3) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  if (y == 1 && x == 4) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  if (y == 1 && x == 5) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  if (y == 1 && x == 6) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  if (y == 1 && x == 7) {
    piece.color = "black";
    piece.type = "pawn";
    return piece;
  }
  // White
  if (y == 6 && x == 0) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 6 && x == 1) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 6 && x == 2) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 6 && x == 3) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 6 && x == 4) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 6 && x == 5) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 6 && x == 6) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 6 && x == 7) {
    piece.color = "white";
    piece.type = "pawn";
    return piece;
  }
  if (y == 7 && x == 0) {
    piece.color = "white";
    piece.type = "rook";
    return piece;
  }
  if (y == 7 && x == 1) {
    piece.color = "white";
    piece.type = "knight";
    return piece;
  }
  if (y == 7 && x == 2) {
    piece.color = "white";
    piece.type = "bishop";
    return piece;
  }
  if (y == 7 && x == 3) {
    piece.color = "white";
    piece.type = "queen";
    return piece;
  }
  if (y == 7 && x == 4) {
    piece.color = "white";
    piece.type = "king";
    return piece;
  }
  if (y == 7 && x == 5) {
    piece.color = "white";
    piece.type = "bishop";
    return piece;
  }
  if (y == 7 && x == 6) {
    piece.color = "white";
    piece.type = "knight";
    return piece;
  }
  if (y == 7 && x == 7) {
    piece.color = "white";
    piece.type = "rook";
    return piece;
  }
  return null;
}

// Starting board state. Only called once on app start
export function getStartingGameState() {
  const gameState = [];
  for (let y = 0; y < 8; y++) {
    const row = [];
    for (let x = 0; x < 8; x++) {
      row.push(getPiece(y, x));
    }
    gameState.push(row);
  }
  return gameState;
}

// Selects the "board-container" div, then appends the rows and spaces to it.
// Spaces are styled via CSS
export function generateBoard() {
  const boardContainer = document.getElementById("board-container");

  for (let y = 0; y < 8; y++) {
    let row = document.createElement("div");
    let colorIsWhite = true;
    row.classList.add("board-row");

    if (y % 2 != 0) {
      colorIsWhite = false;
    }

    for (let x = 0; x < 8; x++) {
      const space = document.createElement("div");
      space.id = `${y}-${x}`;

      if (colorIsWhite) {
        space.classList.add("board-space-white");
      } else {
        space.classList.add("board-space-beige");
      }

      row.appendChild(space);
      colorIsWhite = !colorIsWhite;
    }
    boardContainer.appendChild(row);
  }
}

// This is likely used everytime a piece moves
export function generateBoardState(gameState) {
  // iterate over every piece in the game state grid,
  // and grab elements on the board and update acoordingly
  for (let y = 0; y < gameState.length; y++) {
    for (let x = 0; x < gameState[0].length; x++) {
      const space = document.getElementById(`${y}-${x}`);
      if (!gameState[y][x]) {
        const img = space.querySelector("img");
        if (img) {
          img.remove();
        }
        console.log("continue block");
        continue;
      }

      const piece = gameState[y][x];
      const img = document.createElement("img");
      img.src = `./pieces/${piece.type}-${piece.color}.svg`;
      img.width = 50;
      img.height = 50;
      space.appendChild(img);
    }
  }
}

const validMoveHelpers = {
  pawn: isMoveValidPawn,
  rook: isMoveValidRook,
  knight: isMoveValidKnight,
  bishop: isMoveValidBishop,
  king: isMoveValidKing,
  queen: isMoveValidQueen,
};

function isMoveValidPawn(piece, start, end, gameState) {
  return true;
}

function isMoveValidRook(piece, start, end, gameState) {
  return true;
}

function isMoveValidKnight(piece, start, end, gameState) {
  return true;
}

function isMoveValidBishop(piece, start, end, gameState) {
  return true;
}

function isMoveValidKing(piece, start, end, gameState) {
  return true;
}

function isMoveValidQueen(piece, start, end, gameState) {
  return true;
}
