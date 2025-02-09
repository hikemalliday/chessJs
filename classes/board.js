import { Piece } from "./piece.js";

export class Board {
  constructor() {
    this.gameState = this.#setStartingGameState();
    this.#generateBoard();
    this.activePlayer = { color: "white" };
    this.#generateBoardState();
    this.#addEventListeners();
    this.#isInCheck();
  }

  #findPiece([y_start, x_start], direction) {
    let y = y_start;
    let x = x_start;
    // Find Knight
    const knightMoves = new Set([
      "UP_TWO_LEFT_ONE",
      "UP_ONE_LEFT_TWO",
      "UP_TWO_RIGHT_ONE",
      "UP_ONE_RIGHT_TWO",
      "DOWN_TWO_RIGHT_ONE",
      "DOWN_ONE_RIGHT_TWO",
      "DOWN_TWO_LEFT_ONE",
      "DOWN_ONE_LEFT_TWO",
    ]);

    if (knightMoves.has(direction)) {
      switch (direction) {
        case "UP_TWO_LEFT_ONE":
          y = y - 2;
          x = x - 1;
          break;
        case "UP_ONE_LEFT_TWO":
          y = y - 1;
          x = x - 2;
          break;
        case "UP_TWO_RIGHT_ONE":
          y = y - 2;
          x = x + 1;
          break;
        case "UP_ONE_RIGHT_TWO":
          y = y - 1;
          x = x + 2;
          break;
        case "DOWN_TWO_RIGHT_ONE":
          y = y + 2;
          x = x + 1;
          break;
        case "DOWN_ONE_RIGHT_TWO":
          y = y + 1;
          x = x + 2;
          break;
        case "DOWN_ONE_LEFT_TWO":
          y = y + 1;
          x = x - 2;
          break;
        case "DOWN_TWO_LEFT_ONE":
          y = y + 2;
          x = x - 1;
          break;
      }
      if (y < 0 || y > 7 || x < 0 || x > 7) return null;
      const piece = this.gameState[y][x];
      if (piece) return { piece: piece, y_piece: y, x_piece: x };
      return null;
    }

    while (true) {
      // Move first
      switch (direction) {
        case "UP":
          y -= 1;
          break;
        case "DOWN":
          y += 1;
          break;
        case "LEFT":
          x -= 1;
          break;
        case "RIGHT":
          x += 1;
          break;
        case "UP_LEFT":
          y -= 1;
          x -= 1;
          break;
        case "UP_RIGHT":
          y -= 1;
          x += 1;
          break;
        case "DOWN_LEFT":
          y += 1;
          x -= 1;
          break;
        case "DOWN_RIGHT":
          y += 1;
          x += 1;
          break;
      }
      // Check bounds before accessing the game state
      if (y < 0 || y > 7 || x < 0 || x > 7) break;

      const piece = this.gameState[y][x];
      if (piece) return { piece: piece, y_piece: y, x_piece: x };
    }

    return null;
  }

  #isInCheck() {
    // Need opposite color to find 'check' via 'isMoveValid'
    const enemyColor =
      this.activePlayer["color"] == "white"
        ? { color: "black" }
        : { color: "white" };
    const { king, y_king, x_king } = this.#getKing();
    const directions = [
      "UP",
      "DOWN",
      "LEFT",
      "RIGHT",
      "UP_RIGHT",
      "UP_LEFT",
      "DOWN_RIGHT",
      "DOWN_LEFT",
      "UP_TWO_LEFT_ONE",
      "UP_ONE_LEFT_TWO",
      "UP_TWO_RIGHT_ONE",
      "UP_ONE_RIGHT_TWO",
      "DOWN_TWO_RIGHT_ONE",
      "DOWN_ONE_RIGHT_TWO",
      "DOWN_TWO_LEFT_ONE",
      "DOWN_ONE_LEFT_TWO",
    ];

    const isThreat = [];

    for (const direction of directions) {
      isThreat.push(
        this.#checkDirection(y_king, x_king, direction, king, enemyColor)
      );
    }

    for (const bool of isThreat) {
      if (bool) return true;
    }
    return false;
  }

  #getPiece(y, x) {
    const pieceLookup = {
      "0-0": new Piece("rook", "black", this),
      "0-1": new Piece("knight", "black", this),
      "0-2": new Piece("bishop", "black", this),
      "0-3": new Piece("queen", "black", this),
      "0-4": new Piece("king", "black", this),
      "0-5": new Piece("bishop", "black", this),
      "0-6": new Piece("knight", "black", this),
      "0-7": new Piece("rook", "black", this),
      "1-0": new Piece("pawn", "black", this),
      "1-1": new Piece("pawn", "black", this),
      "1-2": new Piece("pawn", "black", this),
      "1-3": new Piece("pawn", "black", this),
      "1-4": new Piece("pawn", "black", this),
      "1-5": new Piece("pawn", "black", this),
      "1-6": new Piece("pawn", "black", this),
      "1-7": new Piece("pawn", "black", this),
      "6-0": new Piece("pawn", "white", this),
      "6-1": new Piece("pawn", "white", this),
      "6-2": new Piece("pawn", "white", this),
      "6-3": new Piece("pawn", "white", this),
      "6-4": new Piece("pawn", "white", this),
      "6-5": new Piece("pawn", "white", this),
      "6-6": new Piece("pawn", "white", this),
      "6-7": new Piece("pawn", "white", this),
      "7-0": new Piece("rook", "white", this),
      "7-1": new Piece("knight", "white", this),
      "7-2": new Piece("bishop", "white", this),
      "7-3": new Piece("queen", "white", this),
      "7-4": new Piece("king", "white", this),
      "7-5": new Piece("bishop", "white", this),
      "7-6": new Piece("knight", "white", this),
      "7-7": new Piece("rook", "white", this),
    };
    return pieceLookup[`${y}-${x}`];
  }
  // Starting board state. Only called once on app start
  #setStartingGameState() {
    const gameState = [];
    for (let y = 0; y < 8; y++) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        row.push(this.#getPiece(y, x));
      }
      gameState.push(row);
    }
    return gameState;
  }
  // Selects the "board-container" div, then appends the rows and spaces to it.
  #generateBoard() {
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
          space.classList.add("space");
          space.classList.add("white");
        } else {
          space.classList.add("space");
          space.classList.add("beige");
        }

        row.appendChild(space);
        colorIsWhite = !colorIsWhite;
      }
      boardContainer.appendChild(row);
    }
  }
  // Render pieces on board according to 'gameState'
  #generateBoardState() {
    for (let y = 0; y < this.gameState.length; y++) {
      for (let x = 0; x < this.gameState[0].length; x++) {
        const space = document.getElementById(`${y}-${x}`);
        // If gamestate[y][x] is null, remove img
        if (!this.gameState[y][x]) {
          const img = space.querySelector("img");
          if (img) {
            img.remove();
          }
          continue;
        }

        const piece = this.gameState[y][x];
        const img = document.createElement("img");
        img.src = `./pieces/${piece.type}-${piece.color}.svg`;
        img.width = 50;
        img.height = 50;
        img.dataset.coordinates = `${y}-${x}`;
        space.appendChild(img);
      }
    }
  }
  // Possibly refactor this, bad code smell
  #addEventListeners() {
    let draggedImg = null;
    let draggedPiece = null;
    let y_start = null;
    let x_start = null;
    let y_end = null;
    let x_end = null;

    document.querySelectorAll("img").forEach((piece) => {
      piece.addEventListener("dragstart", (e) => {
        draggedImg = e.target;
        if (!draggedImg) return;

        [y_start, x_start] = draggedImg.dataset.coordinates
          .split("-")
          .map(Number);
        draggedPiece = this.gameState[y_start][x_start];

        if (!draggedPiece) return;

        setTimeout(() => {
          e.target.style.display = "none"; // Hide the piece while dragging
        }, 0);
      });

      piece.addEventListener("dragend", (e) => {
        setTimeout(() => {
          e.target.style.display = "flex";
          draggedImg = null;
          draggedPiece = null;
        }, 0);
      });
    });

    document.querySelectorAll(".space").forEach((space) => {
      space.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow drop
      });

      space.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!draggedImg || !draggedPiece) return;

        [y_end, x_end] = space.id.split("-").map(Number);

        if (
          !draggedPiece.isMoveValid(
            [y_start, x_start],
            [y_end, x_end],
            this.gameState,
            this.activePlayer
          )
        )
          return;
        const { killedPiece, movedPiece } = this.#executeMove(
          {
            y_start: y_start,
            x_start: x_start,
            y_end: y_end,
            x_end: x_end,
          },
          draggedPiece
        );
        // Check for check, if true, revert move
        if (this.#isInCheck()) {
          this.#revertMove(
            y_start,
            x_start,
            y_end,
            x_end,
            movedPiece,
            killedPiece
          );
          return;
        }
        // Turn cleanup + check for check for opposing player
        // Remove the killed piece image
        const img = document
          .getElementById(`${y_end}-${x_end}`)
          .querySelector("img");
        if (img) img.remove();
        // Put the dragged image to its resting location
        space.appendChild(draggedImg);
        draggedImg.dataset.coordinates = `${y_end}-${x_end}`;

        // Call 'passTurn()'
        // Change active player
        this.#passTurn();
        // Determine check and mutate dom
      });
    });
  }

  #killPiece(y_end, x_end) {
    console.log(`y_end, x_end: ${y_end}, ${x_end}`);
    const pieceTokill = this.gameState[y_end][x_end];
    if (pieceTokill) {
      Object.assign(pieceTokill, this.gameState[y_end][x_end]);
    }
    delete this.gameState[y_end][x_end];
    return pieceTokill;
  }

  #revertMove(y_start, x_start, y_end, x_end, movedPiece, killedPiece) {
    this.gameState[y_start][x_start] = movedPiece;
    delete this.gameState[y_end][x_end];
    this.gameState[y_end][x_end] = killedPiece;
  }

  #checkDirection(king_y, king_x, direction, king, enemyColor) {
    const foundPiece = this.#findPiece([king_y, king_x], direction);
    if (foundPiece) {
      const { piece, y_piece, x_piece } = foundPiece;
      if (piece.color !== king.color) {
        return piece.isMoveValid(
          [y_piece, x_piece],
          [king_y, king_x],
          this.gameState,
          enemyColor
        );
      }
    }
    return false;
  }

  #canMoveOutOfCheck() {
    console.log("canMoveOutOfCheck call");
    const { king, y_king, x_king } = this.#getKing();
    const possibleMoves = {
      UP: {
        is_valid: king.isMoveValid(
          [y_king, x_king], // start
          [y_king - 1, x_king], // end
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king: x_king,
          y_end: y_king - 1,
          x_end: x_king,
        },
      },
      DOWN: {
        is_valid: king.isMoveValid(
          [y_king, x_king],
          [y_king + 1, x_king],
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king: x_king,
          y_end: y_king + 1,
          x_end: x_king,
        },
      },
      LEFT: {
        is_valid: king.isMoveValid(
          [y_king, x_king],
          [y_king, x_king - 1],
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king: x_king,
          y_end: y_king,
          x_end: x_king - 1,
        },
      },
      RIGHT: {
        is_valid: king.isMoveValid(
          [y_king, x_king],
          [y_king, x_king + 1],
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king: x_king,
          y_end: y_king,
          x_end: x_king + 1,
        },
      },
      UP_RIGHT: {
        is_valid: king.isMoveValid(
          [y_king, x_king],
          [y_king - 1, x_king + 1],
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king: x_king,
          y_end: y_king - 1,
          x_end: x_king + 1,
        },
      },
      UP_LEFT: {
        is_valid: king.isMoveValid(
          [y_king, x_king],
          [y_king - 1, x_king - 1],
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king,
          x_king,
          y_end: y_king - 1,
          x_end: x_king - 1,
        },
      },
      DOWN_RIGHT: {
        is_valid: king.isMoveValid(
          [y_king, x_king],
          [y_king + 1, x_king + 1],
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king,
          x_king,
          y_end: y_king + 1,
          x_end: x_king + 1,
        },
      },
      DOWN_LEFT: {
        is_valid: king.isMoveValid(
          [y_king, x_king],
          [y_king + 1, x_king - 1],
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_king: y_king,
          x_king: x_king,
          y_end: y_king + 1,
          x_end: x_king - 1,
        },
      },
    };
    const validMoves = [];
    for (const direction in possibleMoves) {
      // console.log("direction");
      // console.log(direction);
      // console.log("king:");
      // console.log(king);
      // We need to loop over all directions and perform those moves if valid
      const { y_king, x_king, y_end, x_end } =
        possibleMoves[direction]["coords"];
      if (!possibleMoves[direction]["is_valid"]) continue;
      // console.log(
      //   `canMoveOutOfCheck coords: is_valid: ${is_valid}, y_king: ${y_king}, x_king: ${x_king}, y_end: ${y_end}, x_end: ${x_end}`
      // );
      const { killedPiece, movedPiece } = this.#executeMove(
        {
          y_start: y_king,
          x_start: x_king,
          y_end: y_end,
          x_end: x_end,
        },
        king
      );
      const inCheck = this.#isInCheck();
      if (inCheck) validMoves.push(false);
      else validMoves.push(true);
      this.#revertMove(y_king, x_king, y_end, x_end, movedPiece, killedPiece);
    }
    console.log("can move out of check validMoves:");
    console.log(validMoves);
    for (const bool of validMoves) {
      if (bool) return true;
    }
    return false;
  }

  #getKing() {
    let king = null;
    let y_king = null;
    let x_king = null;

    for (let i = 0; i < this.gameState.length; i++) {
      for (let j = 0; j < this.gameState[0].length; j++) {
        const piece = this.gameState[i][j];
        if (
          piece?.color == this.activePlayer["color"] &&
          piece.type == "king"
        ) {
          king = piece;
          y_king = i;
          x_king = j;
          break;
        }
      }
    }
    return king ? { king: king, y_king: y_king, x_king: x_king } : null;
  }

  #executeMove(coords, draggedPiece) {
    const { y_start, x_start, y_end, x_end } = coords;
    // console.log("executeMove.coords:");
    // console.log(
    //   `y_start: ${y_start}, x_start: ${x_start}, y_end: ${y_end}, x_end: ${x_end}`
    // );
    // kill piece and return deep clone
    const killedPiece = this.#killPiece(y_end, x_end);
    // Move piece
    this.gameState[y_end][x_end] = draggedPiece;
    // Create deep clone of movedPiece
    const movedPiece = Object.create(Object.getPrototypeOf(draggedPiece));
    Object.assign(movedPiece, draggedPiece);
    delete this.gameState[y_start][x_start];

    return {
      killedPiece: killedPiece,
      movedPiece: movedPiece,
    };
  }

  #passTurn() {
    console.log("Pass Turn Call");
    const activePlayerDiv = document.getElementById("active-player-div");
    activePlayerDiv.innerText = "Active player: White";
    this.activePlayer["color"] == "white"
      ? (activePlayerDiv.innerText = "Active player: Black")
      : (activePlayerDiv.innerText = "Active player: White");
    this.activePlayer["color"] == "white"
      ? (this.activePlayer["color"] = "black")
      : (this.activePlayer["color"] = "white");
    const inCheck = this.#isInCheck();
    const checkDiv = document.getElementById("check") ?? false;
    if (!inCheck) {
      checkDiv.innerText = "";
      return;
    }
    const canMoveOutOfCheck = this.#canMoveOutOfCheck();
    checkDiv.innerText = `${this.activePlayer["color"]} king is in check`;
  }
}
