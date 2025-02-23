import { Pawn } from "./pawn.js";
import { Rook } from "./rook.js";
import { Bishop } from "./bishop.js";
import { Queen } from "./queen.js";
import { King } from "./king.js";
import { Knight } from "./knight.js";
import { doubleCheck, castle } from "../alternate-board-states/board-states.js";
import {
  executeRegularMove,
  executeCastleLeft,
  executeCastleRight,
} from "../helpers/movement.js";

export class Board {
  constructor() {
    this.gameState = this.#setStartingGameState();
    this.#generateBoard();
    this.activePlayer = { color: "white" }; // switch back to white after testing double checl
    this.#generatePieceImages(this.gameState);
    this.#addEventListeners();
    this.EXECUTE_MOVE = {
      1: executeRegularMove,
      2: executeCastleLeft,
      3: executeCastleRight,
    };
    this.KING = {
      black: this.getKing(this.gameState, "black"),
      white: this.getKing(this.gameState, "white"),
    };
  }

  getKing(gameState, color) {
    let king = null;
    for (let i = 0; i < gameState.length; i++) {
      for (let j = 0; j < gameState[0].length; j++) {
        const piece = gameState[i][j];
        if (piece?.color == color && piece.type == "king") {
          king = piece;
          break;
        }
      }
    }
    return king;
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
        //row.push(this.#getPiece(y, x));
        row.push(doubleCheck(y, x, this));
        //row.push(castle(y, x, this));
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
  // Render images on board according to 'gameState'
  #generatePieceImages(gameState) {
    for (let y = 0; y < gameState.length; y++) {
      for (let x = 0; x < gameState[0].length; x++) {
        const space = document.getElementById(`${y}-${x}`);
        // If gamestate[y][x] is null, remove img
        if (!gameState[y][x]) {
          const img = space.querySelector("img");
          if (img) {
            img.remove();
          }
          continue;
        }

        const piece = gameState[y][x];
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
        const isMoveValid = draggedPiece.isMoveValid(
          y_end,
          x_end,
          this.gameState,
          this.activePlayer["color"]
        );
        if (!isMoveValid) return;
        const moveIsSafe = draggedPiece.isMoveSafe(
          y_end,
          x_end,
          this.gameState
        );
        if (!moveIsSafe) return;
        const moveWasSuccessful = this.EXECUTE_MOVE[isMoveValid](
          y_end,
          x_end,
          this.gameState,
          space,
          draggedPiece,
          draggedImg
        );
        if (moveWasSuccessful) this.#passTurn();
        else return;
      });
    });
  }

  #passTurn() {
    const activePlayerDiv = document.getElementById("active-player-div");
    activePlayerDiv.innerText = "Active player: White";
    this.activePlayer["color"] == "white"
      ? (activePlayerDiv.innerText = "Active player: Black")
      : (activePlayerDiv.innerText = "Active player: White");
    this.activePlayer["color"] == "white"
      ? (this.activePlayer["color"] = "black")
      : (this.activePlayer["color"] = "white");
    const king = this.KING[this.activePlayer["color"]];
    const threats = king.getThreats(this.gameState, this.activePlayer["color"]);
    const checkDiv = document.getElementById("check") ?? false;
    if (threats.length == 0) {
      checkDiv.innerText = "";
      return;
    }
    let canMoveOutOfCheck = null;
    let canBlockOrKillThreat = null;
    canMoveOutOfCheck = king.canMoveOutOfCheck(
      this.gameState,
      this.activePlayer["color"]
    );
    if (!canMoveOutOfCheck) {
      canBlockOrKillThreat = king.canBlockOrKillThreat(
        threats,
        this.gameState,
        this.activePlayer["color"]
      );
    }
    checkDiv.innerText = `${this.activePlayer["color"]} king is in check`;
    if (!canBlockOrKillThreat && !canMoveOutOfCheck) {
      checkDiv.innerText = `Checkmate. ${this.activePlayer["color"]} loses!`;
    }
  }
}
