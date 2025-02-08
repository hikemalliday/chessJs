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
  #isInCheck() {
    // Must be set to enemies color, for 'isMoveValid'
    let king = null;
    let y = null;
    let x = null;

    // Boomer loop over 'gameState' and find King
    for (let i = 0; i < this.gameState.length; i++) {
      for (let j = 0; j < this.gameState[0].length; j++) {
        const piece = this.gameState[i][j];
        if (piece.color == this.activePlayer["color"] && piece.type == "king") {
          king = piece;
          y = i;
          x = j;
          break;
        }
      }
    }
    king.color == "black"
      ? (this.activePlayer["color"] = "white")
      : (this.activePlayer["color"] = "black");
    const isThreat = [];
    const possibleThreats = {
      up: new Set(["knight", "queen", "rook"]),
      down: new Set(["knight", "queen", "rook"]),
      left: new Set(["knight", "queen", "rook"]),
      right: new Set(["knight", "queen", "rook"]),
      upRight: new Set(["knight", "queen", "bishop"]),
      upLeft: new Set(["knight", "queen", "bishop"]),
      downRight: new Set(["knight", "queen", "bishop"]),
      downLeft: new Set(["knight", "queen", "bishop"]),
    };
    // Check adjacent spaces safely using optional chaining
    const up = gameState[y - 1]?.[x] ?? null;
    const down = gameState[y + 1]?.[x] ?? null;
    const left = gameState[y]?.[x - 1] ?? null;
    const right = gameState[y]?.[x + 1] ?? null;
    const upRight = gameState[y - 1]?.[x + 1] ?? null;
    const upLeft = gameState[y - 1]?.[x - 1] ?? null;
    const downRight = gameState[y + 1]?.[x + 1] ?? null;
    const downLeft = gameState[y + 1]?.[x - 1] ?? null;

    if (up && up.color != piece.color && possibleThreats["up"].has(up.type)) {
      isThreat.push(
        up.isMoveValid([y - 1, x], [y, x], this.gameState, this.activePlayer)
      );
    }
    if (
      down &&
      down.color != piece.color &&
      possibleThreats["down"].has(down.type)
    ) {
      isThreat.push(
        down.isMoveValid([y + 1, x], [y, x], this.gameState, this.activePlayer)
      );
    }
    if (
      left &&
      left.color != piece.color &&
      possibleThreats["left"].has(left.type)
    ) {
      isThreat.push(
        left.isMoveValid([y, x - 1], [y, x], this.gameState, this.activePlayer)
      );
    }
    if (
      right &&
      right.color != piece.color &&
      possibleThreats["right"].has(right.type)
    ) {
      isThreat.push(
        right.isMoveValid([y, x + 1], [y, x], this.gameState, this.activePlayer)
      );
    }
    if (
      upRight &&
      upRight.color != piece.color &&
      possibleThreats["upRight"].has(upRight.type)
    ) {
      isThreat.push(
        upRight.isMoveValid(
          [y - 1, x + 1],
          [y, x],
          this.gameState,
          this.activePlayer
        )
      );
    }
    if (
      upLeft &&
      upLeft.color != piece.color &&
      possibleThreats["upLeft"].has(upLeft.type)
    ) {
      isThreat.push(
        upLeft.isMoveValid(
          [y - 1, x - 1],
          [y, x],
          this.gameState,
          this.activePlayer
        )
      );
    }
    if (
      downRight &&
      downRight.color != piece.color &&
      possibleThreats["downRight"].has(downRight.type)
    ) {
      isThreat.push(
        downRight.isMoveValid(
          [y + 1, x + 1],
          [y, x],
          this.gameState,
          this.activePlayer
        )
      );
    }
    if (
      downLeft &&
      downLeft.color != piece.color &&
      possibleThreats["downLeft"].has(downLeft.type)
    ) {
      isThreat.push(
        downLeft.isMoveValid(
          [y + 1, x - 1],
          [y, x],
          this.gameState,
          this.activePlayer
        )
      );
    }
  }
  // Theres gotta be a way to refactor this
  #getPiece(y, x) {
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
  // Spaces are styled via CSS
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
        if (!draggedImg) {
          console.log("dragstart early return");
          return;
        }

        [y_start, x_start] = draggedImg.dataset.coordinates.split("-");
        draggedPiece = this.gameState[y_start][x_start];
        if (!draggedPiece) return;
        console.log(draggedPiece);

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

        this.gameState[y_end][x_end] = draggedPiece; // Set end to draggedPiece, we might need to just make a copy tbh
        delete this.gameState[y_start][x_start];
        space.appendChild(draggedImg); // Move the piece to the new space
        draggedImg.dataset.coordinates = `${y_end}-${x_end}`;
        this.activePlayer["color"] == "white"
          ? (this.activePlayer["color"] = "black")
          : (this.activePlayer["color"] = "white");
        activePlayerDiv.innerText == "Active player: White"
          ? (activePlayerDiv.innerText = "Active player: Black")
          : (activePlayerDiv.innerText = "Active player: White");
      });
    });
  }
}
