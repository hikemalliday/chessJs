import { Pawn } from "./pawn.js";
import { Rook } from "./rook.js";
import { Bishop } from "./bishop.js";
import { Queen } from "./queen.js";
import { King } from "./king.js";
import { Knight } from "./knight.js";

export class Board {
  constructor() {
    this.gameState = this.#setStartingGameState();
    this.#generateBoard();
    this.activePlayer = { color: "white" };
    this.#generatePieceImages();
    this.#addEventListeners();
  }
  // Array is useless here
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

  #getPiece(y, x) {
    const pieceLookup = {
      "0-0": new Rook("rook", "black", this, y, x),
      "0-1": new Knight("knight", "black", this, y, x),
      "0-2": new Bishop("bishop", "black", this, y, x),
      "0-3": new Queen("queen", "black", this, y, x),
      "0-4": new King("king", "black", this, y, x),
      "0-5": new Bishop("bishop", "black", this, y, x),
      "0-6": new Knight("knight", "black", this, y, x),
      "0-7": new Rook("rook", "black", this, y, x),
      "1-0": new Pawn("pawn", "black", this, y, x),
      "1-1": new Pawn("pawn", "black", this, y, x),
      "1-2": new Pawn("pawn", "black", this, y, x),
      "1-3": new Pawn("pawn", "black", this, y, x),
      "1-4": new Pawn("pawn", "black", this, y, x),
      "1-5": new Pawn("pawn", "black", this, y, x),
      "1-6": new Pawn("pawn", "black", this, y, x),
      "1-7": new Pawn("pawn", "black", this, y, x),
      "6-0": new Pawn("pawn", "white", this, y, x),
      "6-1": new Pawn("pawn", "white", this, y, x),
      "6-2": new Pawn("pawn", "white", this, y, x),
      "6-3": new Pawn("pawn", "white", this, y, x),
      "6-4": new Pawn("pawn", "white", this, y, x),
      "6-5": new Pawn("pawn", "white", this, y, x),
      "6-6": new Pawn("pawn", "white", this, y, x),
      "6-7": new Pawn("pawn", "white", this, y, x),
      "7-0": new Rook("rook", "white", this, y, x),
      "7-1": new Knight("knight", "white", this, y, x),
      "7-2": new Bishop("bishop", "white", this, y, x),
      "7-3": new Queen("queen", "white", this, y, x),
      "7-4": new King("king", "white", this, y, x),
      "7-5": new Bishop("bishop", "white", this, y, x),
      "7-6": new Knight("knight", "white", this, y, x),
      "7-7": new Rook("rook", "white", this, y, x),
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
  // Prolly rename this to something like, generate piece images
  #generatePieceImages() {
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
    console.log(this.gameState);
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

        if (this.#getThreats().length > 0) {
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
        // Remove img (if killed piece)
        const img = document
          .getElementById(`${y_end}-${x_end}`)
          .querySelector("img");
        if (img) img.remove();
        // Put the dragged image to its resting location
        space.appendChild(draggedImg);
        draggedImg.dataset.coordinates = `${y_end}-${x_end}`;
        this.#passTurn();
      });
    });
  }
  // Move this to Piece?

  // Move this to Piece?
  #revertMove(y_start, x_start, y_end, x_end, movedPiece, killedPiece) {
    console.log("revertMove call");
    console.log(
      `y_start: ${y_start}, x_start: ${x_start}, y_end: ${y_end}, x_end: ${x_end}, movedPiece: ${movedPiece}, killedPiece: ${killedPiece}`
    );
    if (movedPiece) {
      movedPiece.y = y_start;
      movedPiece.x = x_start;
    }
    this.gameState[y_start][x_start] = movedPiece;
    delete this.gameState[y_end][x_end];
    this.gameState[y_end][x_end] = killedPiece;
    if (killedPiece) {
      killedPiece.y = y_end;
      killedPiece.x = x_end;
    }
  }
  // Move this to King?
  #canMoveOutOfCheck() {
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
      // We need to loop over all directions and perform those moves if valid
      const { y_king, x_king, y_end, x_end } =
        possibleMoves[direction]["coords"];
      if (!possibleMoves[direction]["is_valid"]) continue;
      const { killedPiece, movedPiece } = this.#executeMove(
        {
          y_start: y_king,
          x_start: x_king,
          y_end: y_end,
          x_end: x_end,
        },
        king
      );
      const inCheck = this.#getThreats().length > 0;
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
  // Move this to Piece?

  // Move this to King?
  #canBlockOrKillThreat(threats) {
    const { king, y_king, x_king } = this.#getKing();
    const spacesSet = new Set();
    for (const threat of threats) {
      this.#getThreatPath(threat, king, spacesSet);
    }
    // We now have the set of spaces we must block.
    console.log("canBlockOrKillThreat.spacesSet:");
    console.log(spacesSet);
    const pieces = [];
    for (const row of this.gameState) {
      for (const piece of row) {
        if (piece?.color == this.activePlayer["color"] && piece.type != "king")
          pieces.push(piece);
      }
    }

    const validMoves = [];
    for (const space of spacesSet) {
      for (const piece of pieces) {
        const isValid = piece.isMoveValid(
          [piece.y, piece.x],
          space,
          this.gameState,
          this.activePlayer
        );
        if (isValid) validMoves.push(isValid);
      }
    }
    for (const bool of validMoves) {
      if (bool) return true;
    }
    return false;
  }
  // Move this to King?
  #getThreatPath(threat, king, spacesSet) {
    let direction = null;

    if (threat.y > king.y && threat.x < king.x) direction = "DOWN_LEFT";
    else if (threat.y > king.y && threat.x > king.x) direction = "DOWN_RIGHT";
    else if (threat.y < king.y && threat.x < king.x) direction = "UP_LEFT";
    else if (threat.y < king.y && threat.x > king.x) direction = "UP_RIGHT";
    else if (threat.y > king.y) direction = "UP";
    else if (threat.y < king.y) direction = "DOWN";
    else if (threat.x < king.x) direction = "LEFT";
    else if (threat.x > king.x) direction = "RIGHT";

    let y = king.y;
    let x = king.x;

    while (true) {
      switch (direction) {
        case "UP":
          y = y - 1;
          break;
        case "DOWN":
          y = y + 1;
          break;
        case "LEFT":
          x = x - 1;
          break;
        case "RIGHT":
          x = x + 1;
        case "DOWN_LEFT":
          y = y + 1;
          x = x - 1;
          break;
        case "DOWN_RIGHT":
          y = y + 1;
          x = x + 1;
          break;
        case "UP_LEFT":
          y = y - 1;
          x = x - 1;
          break;
        case "UP_RIGHT":
          y = y - 1;
          x = x + 1;
          break;
      }
      spacesSet.add([y, x]);
      if (y == threat.y && x == threat.x) break;
    }
  }
  // Move this to King?
  #getThreats() {
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

    const threats = [];

    for (const direction of directions) {
      const foundPiece = this.#findPiece([y_king, x_king], direction);
      if (foundPiece) {
        const { piece, y_piece, x_piece } = foundPiece;
        if (piece.color !== king.color) {
          const isValid = piece.isMoveValid(
            [y_piece, x_piece],
            [y_king, x_king],
            this.gameState,
            enemyColor
          );
          if (isValid) threats.push(piece);
        }
      }
    }
    // console.log("getThreats.threats:");
    // console.log(threats);
    return threats;
  }
  // Get all pieces for a player (used for determining checkmate)

  #passTurn() {
    const activePlayerDiv = document.getElementById("active-player-div");
    activePlayerDiv.innerText = "Active player: White";
    this.activePlayer["color"] == "white"
      ? (activePlayerDiv.innerText = "Active player: Black")
      : (activePlayerDiv.innerText = "Active player: White");
    this.activePlayer["color"] == "white"
      ? (this.activePlayer["color"] = "black")
      : (this.activePlayer["color"] = "white");
    const inCheck = this.#getThreats().length > 0;
    const checkDiv = document.getElementById("check") ?? false;
    if (!inCheck) {
      checkDiv.innerText = "";
      return;
    }
    const canMoveOutOfCheck = this.#canMoveOutOfCheck();
    console.log(`canMoveOutOfCheck: ${canMoveOutOfCheck}`);
    const canBlockOrKillThreat = this.#canBlockOrKillThreat(this.#getThreats());
    console.log(`canBlockOrKillThreat: ${canBlockOrKillThreat}`);
    checkDiv.innerText = `${this.activePlayer["color"]} king is in check`;
    if (!canBlockOrKillThreat && !canMoveOutOfCheck) {
      checkDiv.innerText = `Checkmate. ${this.activePlayer["color"]} loses!`;
    }
  }
}
