import { Piece } from "./piece.js";

export class King extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidKing.bind(this);
  }
  #isMoveValidKing(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];

    if (y_abs > 1 || x_abs > 1) {
      return false;
    }
    if (landingSpace && landingSpace.color == this.color) {
      return false;
    }
    if (!landingSpace) {
      this.hasMoved = true;
      return true;
    }
    this.hasMoved = true;
    return true;
  }
}
