import { Piece } from "./piece.js";

export class Pawn extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidPawn.bind(this);
  }
  #isMoveValidPawn(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    if (this.color == "black") {
      // Handle double move
      if (y_start == 1 && y_abs == 2 && x_abs == 0 && !landingSpace) return 1;
      // Handle moving too far or in wrong direction
      if (y_abs > 1 || x_abs > 1 || y_end < y_start) return 0;
      // Prevent foward kill
      if (x_abs == 0 && landingSpace) return 0;
      // Prevent diagonal move
      if (y_abs == 1 && x_abs == 1 && !landingSpace) return 0;
      // Prevent sideways move
      if (y_abs == 0 && x_abs == 1) return 0;
      // Prevent kill of own color
      if (
        landingSpace &&
        y_end > y_start &&
        x_abs == 1 &&
        landingSpace.color == this.color
      )
        return 0;

      return 1;
    } else if (this.color == "white") {
      if (y_start == 6 && y_abs == 2 && x_abs == 0 && !landingSpace) return 1;
      // Handle moving too far or in wrong direction
      if (y_abs > 1 || x_abs > 1 || y_end > y_start) return 0;
      // Prevent forward kill
      if (x_abs == 0 && landingSpace) return 0;
      // Prevent diagonal move
      if (y_abs == 1 && x_abs == 1 && !landingSpace) return 0;
      // Prevent sideways move
      if (y_abs == 0 && x_abs == 1) return 0;
      // Prevent kill of own color
      if (
        landingSpace &&
        y_end < y_start &&
        x_abs == 1 &&
        landingSpace.color == this.color
      )
        return 0;
      return 1;
    }
  }
}
