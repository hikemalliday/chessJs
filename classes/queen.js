import { Piece } from "./piece.js";

export class Queen extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidQueen.bind(this);
  }
  #isMoveValidQueen(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    //console.log(coords);
    let movementType = null;
    if (y_abs == x_abs) movementType = "bishop";
    if ((y_abs == 0 && x_abs !== 0) || (y_abs != 0 && x_abs == 0))
      movementType = "rook";
    if (!movementType) return 0;

    if (movementType == "bishop") {
      if (y_end < y_start && x_end < x_start)
        return this.isMoveValidBishopHelper("UP_LEFT", coords, gameState);
      if (y_end < y_start && x_end > x_start)
        return this.isMoveValidBishopHelper("UP_RIGHT", coords, gameState);
      if (y_end > y_start && x_end < x_start)
        return this.isMoveValidBishopHelper("DOWN_LEFT", coords, gameState);
      if (y_end > y_start && x_end > x_start)
        return this.isMoveValidBishopHelper("DOWN_RIGHT", coords, gameState);
    }
    if (movementType == "rook") {
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
}
