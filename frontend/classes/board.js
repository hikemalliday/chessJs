//import { syncBoardStateQAButton } from "../qa/syncBoardState.js";
//import { doubleCheck, castle, pawnConversion } from "../qa/board-states.js";
import { Pawn } from "./pawn.js";
import { Rook } from "./rook.js";
import { Bishop } from "./bishop.js";
import { Queen } from "./queen.js";
import { King } from "./king.js";
import { Knight } from "./knight.js";
import {
  executeRegularMove,
  executeCastle,
  executeEnPassant,
  killPiece,
} from "../helpers/piece.js";
import {
  updateActivePlayer,
  updateActivePlayerText,
  determineCheck,
  generateBoard,
  generateStartingImages,
  deleteImg,
  generateImg,
  handlePostGameState,
} from "../helpers/board.js";
import { pieceChoices, RETRY_INTERVAL } from "../constants.js";
import { getGameState, postGameState } from "../requests/requests.js";

export class Board {
  constructor(player) {
    this.player = player;
    this.gameState = this.#setStartingGameState();
    generateBoard();
    this.activePlayer = { color: "white" };
    generateStartingImages(this.gameState);
    this.EXECUTE_MOVE = {
      1: executeRegularMove,
      2: executeCastle,
      3: executeCastle,
      4: executeEnPassant,
    };
    this.KING = {
      black: this.getKing(this.gameState, "black"),
      white: this.getKing(this.gameState, "white"),
    };
    // Event listener vars
    this.draggedImg = null;
    this.draggedPiece = null;
    this.y_start = null;
    this.x_start = null;
    this.y_end = null;
    this.x_end = null;
    // Add event listeners
    {
      document.querySelectorAll("img").forEach((img) => {
        this.#addImgEventListeners(img);
      });

      document.querySelectorAll(".space").forEach((space) => {
        this.#addSpaceEventListeners(space);
      });
    }
    this.lastMove = [];
    this.#checkTurn();
    // Debug for jwt
    async function testToken() {
      try {
        const data = await getGameState();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
    testToken();
  }

  async #checkTurn() {
    setInterval(async () => {
      try {
        return;
        if (this.activePlayer["color"] == this.player.color) return;
        const data = await getGameState();
        if (data.activePlayer === this.player.color) {
          console.log("SYNC UP");
          this.#syncBoardState(this.gameState, data.gameState);
          updateActivePlayer(this.activePlayer);
        }
      } catch (err) {
        console.error("checkTurn error:", err);
      }
    }, RETRY_INTERVAL);
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

  #getStartingPiece(y, x) {
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
  // Refactor the duplicated kill logic
  #syncBoardState(gameState, newGameState) {
    for (let y = 0; y < newGameState.length; y++) {
      for (let x = 0; x < newGameState[0].length; x++) {
        const oldPiece = gameState[y][x];
        const newPieceObj = newGameState[y][x];
        if (!newPieceObj) {
          killPiece(y, x, gameState);
          deleteImg(y, x, gameState);
          continue;
        }
        if (
          oldPiece?.color == newPieceObj.color &&
          oldPiece?.type == newPieceObj.type
        )
          continue;
        killPiece(y, x, gameState);
        deleteImg(y, x, gameState);
        const newPiece = this.#createNewPiece(newPieceObj);
        generateImg(y, x, newPiece);
      }
    }
  }

  #createNewPiece(newPieceObj) {
    const { type, color, y, x } = newPieceObj;
    const pieceLookup = {
      rook: new Rook(type, color, this, y, x),
      knight: new Knight(type, color, this, y, x),
      bishop: new Bishop(type, color, this, y, x),
      queen: new Queen(type, color, this, y, x),
      king: new King(type, color, this, y, x),
      pawn: new Pawn(type, color, this, y, x),
    };
    return pieceLookup[type];
  }

  // Starting board state. Only called once on app start
  #setStartingGameState() {
    const gameState = [];
    for (let y = 0; y < 8; y++) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        row.push(this.#getStartingPiece(y, x));
        //row.push(doubleCheck(y, x, this));
        //row.push(castle(y, x, this));
        //row.push(pawnConversion(y, x, this));
      }
      gameState.push(row);
    }
    return gameState;
  }

  #addImgEventListeners(img) {
    img.addEventListener("dragstart", (e) => {
      this.draggedImg = e.target;
      if (!this.draggedImg) return;
      [this.y_start, this.x_start] = this.draggedImg.dataset.coordinates
        .split("-")
        .map(Number);
      this.draggedPiece = this.gameState[this.y_start][this.x_start];
      if (!this.draggedPiece) return;
      setTimeout(() => {
        e.target.style.display = "none"; // Hide the piece while dragging
      }, 0);
    });

    img.addEventListener("dragend", (e) => {
      setTimeout(() => {
        e.target.style.display = "flex";
        this.draggedImg = null;
        this.draggedPiece = null;
      }, 0);
    });
  }

  #addSpaceEventListeners(space) {
    space.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow drop
    });

    space.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!this.draggedImg || !this.draggedPiece) return;

      [this.y_end, this.x_end] = space.id.split("-").map(Number);
      // const 'isMoveValid' is an integer, which tells this.EXECUTE_MOVE which movement function to call
      const isMoveValid = this.draggedPiece.isMoveValid(
        this.y_end,
        this.x_end,
        this.gameState,
        this.activePlayer["color"]
      );
      if (!isMoveValid) return;
      const moveWasSuccessful = this.EXECUTE_MOVE[isMoveValid](
        this.y_end,
        this.x_end,
        this.gameState,
        space,
        this.draggedPiece,
        this.draggedImg,
        isMoveValid,
        this
      );
      if (!moveWasSuccessful) return;
      // this.#passTurn();
      const pawnToConvert = this.#checkPawnConversion();
      if (pawnToConvert) return this.#pawnConversion(pawnToConvert);
      return this.#passTurn();
    });
  }

  #checkPawnConversion() {
    const topRow = this.gameState[0];
    const bottomRow = this.gameState[7];

    for (const piece of topRow) {
      if (piece?.type == "pawn") return piece;
    }

    for (const piece of bottomRow) {
      if (piece?.type == "pawn") return piece;
    }
    return null;
  }

  #handleConvertPawn(pawn, pieceType) {
    const conversionTable = {
      rook: Rook,
      knight: Knight,
      bishop: Bishop,
      queen: Queen,
    };
    const newPiece = new conversionTable[pieceType](
      pieceType,
      pawn.color,
      this,
      pawn.y,
      pawn.x
    );
    this.gameState[newPiece.y][newPiece.x] = newPiece;

    const space = document.getElementById(`${newPiece.y}-${newPiece.x}`);
    // Delete old image
    const img = space.querySelector("img");
    if (img) img.remove();
    // Define new image and append to DOM
    const newImg = document.createElement("img");
    newImg.src = `./pieces/${newPiece.type}-${newPiece.color}.svg`;
    newImg.width = 50;
    newImg.height = 50;
    newImg.dataset.coordinates = `${newPiece.y}-${newPiece.x}`;
    space.appendChild(newImg);
    // Add event listners
    this.#addImgEventListeners(newImg);
    // Clear piece selection interface
    const conversionInterfaceDiv = document.getElementById(
      "conversion-interface"
    );
    conversionInterfaceDiv.replaceChildren();
    this.#passTurn();
  }

  #pawnConversion(pawn) {
    const conversionInterfaceDiv = document.getElementById(
      "conversion-interface"
    );

    const selectText = document.createElement("div");
    selectText.innerText = "Select a piece:";
    const select = document.createElement("select");
    select.id = "piece-choices";
    const button = document.createElement("button");
    button.textContent = "Select";
    button.addEventListener("click", () =>
      this.#handleConvertPawn(pawn, select.value)
    );

    pieceChoices.forEach((piece, i) => {
      const option = document.createElement("option");
      option.value = i === 0 ? "" : piece;
      option.textContent = piece;
      if (i == 0) option.disabled = true;
      select.appendChild(option);
    });
    conversionInterfaceDiv.append(selectText);
    conversionInterfaceDiv.append(select);
    conversionInterfaceDiv.append(button);
  }

  #passTurn() {
    updateActivePlayerText(this.activePlayer);
    updateActivePlayer(this.activePlayer);
    determineCheck(this);
    handlePostGameState(this.activePlayer, this.gameState);
  }
}
