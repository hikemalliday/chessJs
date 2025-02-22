import { Piece } from "./piece.js";

export class King extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidKing.bind(this);
  }
  #isMoveValidKing(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Check for castle
    if (this.hasMoved == false && x_abs == 2 && x_end > x_start)
      return this.#isCastleRightValid(y_end, x_end, gameState);
    if (this.hasMoved == false && x_abs == 2 && x_end < x_start)
      return this.#isCastleLeftValid(y_end, x_end, gameState);
    if (y_abs > 1 || x_abs > 1) {
      return 0;
    }
    if (landingSpace && landingSpace.color == this.color) {
      return 0;
    }
    if (!landingSpace) {
      this.hasMoved = true;
      return 1;
    }
    this.hasMoved = true;
    return 1;
  }

  #isCastleRightValid(y_end, x_end, gameState) {
    const firstSpace = gameState[y_end][this.x + 1];
    const secondSpace = gameState[y_end][this.x + 2];
    if (firstSpace || secondSpace) return 0;
    const cornerPiece = gameState[y_end][7];
    if (!cornerPiece) return 0;
    if (cornerPiece.type != "rook") return 0;
    if (cornerPiece.hasMoved) return 0;
    return 3;
  }

  #isCastleLeftValid(y_end, x_end, gameState) {
    const firstSpace = gameState[y_end][this.x - 1];
    const secondSpace = gameState[y_end][this.x - 2];
    if (firstSpace || secondSpace) return 0;
    const cornerPiece = gameState[y_end][0];
    if (!cornerPiece) return 0;
    if (cornerPiece.type != "rook") return 0;
    if (cornerPiece.hasMoved) return 0;
    return 2;
  }
}
