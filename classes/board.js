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
      console.log("knight direction found");
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
    let king = null;
    let y_king = null;
    let x_king = null;

    // Find King
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
    const activePlayerDiv = document.getElementById("active-player-div");
    activePlayerDiv.innerText = "Active player: White";
    document.querySelectorAll("img").forEach((piece) => {
      piece.addEventListener("dragstart", (e) => {
        draggedImg = e.target;
        if (!draggedImg) return;

        [y_start, x_start] = draggedImg.dataset.coordinates.split("-");
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

        [y_end, x_end] = space.id.split("-");

        if (
          !draggedPiece.isMoveValid(
            [y_start, x_start],
            [y_end, x_end],
            this.gameState,
            this.activePlayer
          )
        )
          return;
        // Handle valid move, then look for 'check'. If check is found, revert move and early return
        // kill piece
        const killedPiece = this.#killPiece(y_end, x_end);
        // Move piece
        this.gameState[y_end][x_end] = draggedPiece;
        // Create deep clone of movedPiece
        const movedPiece = Object.create(Object.getPrototypeOf(draggedPiece));
        Object.assign(movedPiece, draggedPiece);
        delete this.gameState[y_start][x_start];

        let inCheck = this.#isInCheck();
        if (inCheck) {
          this.#revertMove(
            y_start,
            x_start,
            y_end,
            x_end,
            movedPiece,
            killedPiece
          );
          // Early return if move puts us in check
          return;
        }
        // Remove the killed piece image
        const img = document
          .getElementById(`${y_end}-${x_end}`)
          .querySelector("img");
        if (img) img.remove();
        // Put the dragged image to its resting location
        space.appendChild(draggedImg);
        draggedImg.dataset.coordinates = `${y_end}-${x_end}`;
        // Change active player
        this.activePlayer["color"] == "white"
          ? (this.activePlayer["color"] = "black")
          : (this.activePlayer["color"] = "white");
        activePlayerDiv.innerText == "Active player: White"
          ? (activePlayerDiv.innerText = "Active player: Black")
          : (activePlayerDiv.innerText = "Active player: White");
        // Determine check and mutate dom
        inCheck = this.#isInCheck();
        const checkDiv = document.getElementById("check") ?? false;
        if (!inCheck) {
          checkDiv.innerText = "";
          return;
        }
        checkDiv.innerText = `${this.activePlayer["color"]} king is in check`;
      });
    });
  }

  #killPiece(y_end, x_end) {
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
}
