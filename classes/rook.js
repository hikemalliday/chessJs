import { Piece } from "./piece.js";

export class Rook extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidRook.bind(this);
  }
  #isMoveValidRook(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    // Handle invalid non-straight line moves
    if (y_abs != 0 && x_abs != 0) return false;
    if (x_abs == 0 && y_end > y_start)
      return this.isMoveValidRookHelper("DOWN", coords, gameState);
    if (x_abs == 0 && y_end < y_start)
      return this.isMoveValidRookHelper("UP", coords, gameState);
    if (y_abs == 0 && x_end > x_start)
      return this.isMoveValidRookHelper("RIGHT", coords, gameState);
    if (y_abs == 0 && x_end < x_start)
      return this.isMoveValidRookHelper("LEFT", coords, gameState);
  }
}
