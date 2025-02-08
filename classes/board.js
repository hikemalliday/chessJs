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
    //console.log(`$isInCheck.king: ${JSON.stringify(king)}`);
    // const possibleThreats = {
    //   up: new Set(["queen", "rook", "king"]),
    //   down: new Set(["queen", "rook", "king"]),
    //   left: new Set(["queen", "rook", "king"]),
    //   right: new Set(["queen", "rook", "king"]),
    //   upRight: new Set(["queen", "bishop", "king", "pawn"]),
    //   upLeft: new Set(["queen", "bishop", "king", "pawn"]),
    //   downRight: new Set(["queen", "bishop", "king", "pawn"]),
    //   downLeft: new Set(["queen", "bishop", "king", "pawn"]),
    // };

    const enemyColor =
      this.activePlayer["color"] == "white"
        ? { color: "black" }
        : { color: "white" };
    // Must be set to enemies color, for 'isMoveValid'
    let king = null;
    let y_king = null;
    let x_king = null;

    // Boomer loop over 'gameState' and find King
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

    const isThreat = [];
    const up = this.#findPiece([y_king, x_king], "UP");
    const down = this.#findPiece([y_king, x_king], "DOWN");
    const left = this.#findPiece([y_king, x_king], "LEFT");
    const right = this.#findPiece([y_king, x_king], "RIGHT");
    const upRight = this.#findPiece([y_king, x_king], "UP_RIGHT");
    const upLeft = this.#findPiece([y_king, x_king], "UP_LEFT");
    const downRight = this.#findPiece([y_king, x_king], "DOWN_RIGHT");
    const downLeft = this.#findPiece([y_king, x_king], "DOWN_LEFT");

    // Check if moves are valid from the perspective of the enemy piece
    if (up) {
      const { piece, y_piece, x_piece } = up;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    if (down) {
      const { piece, y_piece, x_piece } = down;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    if (left) {
      const { piece, y_piece, x_piece } = left;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    if (right) {
      const { piece, y_piece, x_piece } = right;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    if (upRight) {
      const { piece, y_piece, x_piece } = upRight;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    if (upLeft) {
      const { piece, y_piece, x_piece } = upLeft;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    if (downRight) {
      const { piece, y_piece, x_piece } = downRight;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    if (downLeft) {
      const { piece, y_piece, x_piece } = downLeft;
      if (piece.color != king.color) {
        isThreat.push(
          piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor,
            true
          )
        );
      }
    }

    console.log(`isThread array: ${JSON.stringify(isThreat)}`);
    // #^ If anything in here is true, we need to return true
    for (const bool of isThreat) {
      if (bool) return true;
    }
    return false;
  }
  // Theres gotta be a way to refactor this
  #getPiece(y, x) {
    const piece = new Piece();
    // Black
    if (y == 0 && x == 0) {
      piece.color = "black";
      piece.type = "rook";
      piece.board = this;
      return piece;
    }
    if (y == 0 && x == 1) {
      piece.color = "black";
      piece.type = "knight";
      piece.board = this;
      return piece;
    }
    if (y == 0 && x == 2) {
      piece.color = "black";
      piece.type = "bishop";
      piece.board = this;
      return piece;
    }
    if (y == 0 && x == 3) {
      piece.color = "black";
      piece.type = "queen";
      piece.board = this;
      return piece;
    }
    if (y == 0 && x == 4) {
      piece.color = "black";
      piece.type = "king";
      piece.board = this;
      return piece;
    }
    if (y == 0 && x == 5) {
      piece.color = "black";
      piece.type = "bishop";
      piece.board = this;
      return piece;
    }
    if (y == 0 && x == 6) {
      piece.color = "black";
      piece.type = "knight";
      piece.board = this;
      return piece;
    }
    if (y == 0 && x == 7) {
      piece.color = "black";
      piece.type = "rook";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 0) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 1) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 2) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 3) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 4) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 5) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 6) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 1 && x == 7) {
      piece.color = "black";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    // White
    if (y == 6 && x == 0) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 6 && x == 1) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 6 && x == 2) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 6 && x == 3) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 6 && x == 4) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 6 && x == 5) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 6 && x == 6) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 6 && x == 7) {
      piece.color = "white";
      piece.type = "pawn";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 0) {
      piece.color = "white";
      piece.type = "rook";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 1) {
      piece.color = "white";
      piece.type = "knight";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 2) {
      piece.color = "white";
      piece.type = "bishop";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 3) {
      piece.color = "white";
      piece.type = "queen";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 4) {
      piece.color = "white";
      piece.type = "king";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 5) {
      piece.color = "white";
      piece.type = "bishop";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 6) {
      piece.color = "white";
      piece.type = "knight";
      piece.board = this;
      return piece;
    }
    if (y == 7 && x == 7) {
      piece.color = "white";
      piece.type = "rook";
      piece.board = this;
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
        // console.log("draggedPiece, first event listener:");
        // console.log(draggedPiece);
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
        // console.log("draggedPiece, drop event listener:");
        // console.log(draggedPiece);
        if (
          !draggedPiece.isMoveValid(
            [y_start, x_start],
            [y_end, x_end],
            this.gameState,
            this.activePlayer
          )
        )
          return;
        // Handle valid move
        // kill piece
        const killedPiece = this.#killPiece(y_end, x_end); // Could be refactored to return a deep copy of the class
        // Move piece
        this.gameState[y_end][x_end] = draggedPiece;
        // Create deep clone of movedPiece
        const movedPiece = Object.create(Object.getPrototypeOf(draggedPiece));
        Object.assign(movedPiece, draggedPiece);
        // console.log("movedPiece:");
        // console.log(movedPiece);
        // Create deep clone of killedPiece
        // console.log("killedPiece:");
        // console.log(killedPiece);
        delete this.gameState[y_start][x_start];
        // We have moved and killed. We need to see if this puts us in check. If so, revert mutation
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
          // console.log("draggedPiece after move is reverted:");
          // console.log(draggedPiece);
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
}
