import { Piece } from "./piece.js";

export class Bishop extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidBishop.bind(this);
  }
  #isMoveValidBishop(coords, gameState) {
    //.log("isMoveValidBishopBlack");
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    if (x_abs != y_abs) return 0;
    if (y_end < y_start && x_end < x_start)
      return this.isMoveValidBishopHelper("UP_LEFT", coords, gameState);
    if (y_end < y_start && x_end > x_start)
      return this.isMoveValidBishopHelper("UP_RIGHT", coords, gameState);
    if (y_end > y_start && x_end < x_start)
      return this.isMoveValidBishopHelper("DOWN_LEFT", coords, gameState);
    if (y_end > y_start && x_end > x_start)
      return this.isMoveValidBishopHelper("DOWN_RIGHT", coords, gameState);
  }
}
