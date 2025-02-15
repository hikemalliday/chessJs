import { Piece } from "./piece.js";

export class Knight extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidKnight;
  }
  #isMoveValidKnight(coords, gameState) {
    //console.log("isMoveValidKnight");
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Handle non-L movements
    if (y_abs > 2 || x_abs > 2) return false;
    if (y_abs == 0 || x_abs == 0) return false;
    if (y_abs == 1 && x_abs != 2) return false;
    if (y_abs == 2 && x_abs != 1) return false;
    // Handle valid move to empty space
    if (!landingSpace) return true;
    // Handle attempt to land on own color
    if (landingSpace.color == this.color) return false;
    return true;
  }
}
