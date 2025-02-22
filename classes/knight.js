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
    if (y_abs > 2 || x_abs > 2) return 0;
    if (y_abs == 0 || x_abs == 0) return 0;
    if (y_abs == 1 && x_abs != 2) return 0;
    if (y_abs == 2 && x_abs != 1) return 0;
    // Handle valid move to empty space
    if (!landingSpace) return 1;
    // Handle attempt to land on own color
    if (landingSpace.color == this.color) return 0;
    return 1;
  }
}
