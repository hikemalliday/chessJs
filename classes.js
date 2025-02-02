export class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.MOVE_LOOKUP = {
      pawn: {
        black: this.#isMoveValidPawnBlack.bind(this),
        white: this.#isMoveValidPawnWhite.bind(this),
      },
      rook: {
        black: this.#isMoveValidRookBlack.bind(this),
        white: this.#isMoveValidRookWhite.bind(this),
      },
      knight: {
        black: this.#isMoveValidKnightBlack.bind(this),
        white: this.#isMoveValidKnightWhite.bind(this),
      },
      bishop: {
        black: this.#isMoveValidBishopBlack.bind(this),
        white: this.#isMoveValidBishopWhite.bind(this),
      },
      king: {
        black: this.#isMoveValidKingBlack.bind(this),
        white: this.#isMoveValidKingWhite.bind(this),
      },
      queen: {
        black: this.#isMoveValidQueenBlack.bind(this),
        white: this.#isMoveValidQueenWhite.bind(this),
      },
    };
  }

  isMoveValid(start, end, gameState = {}) {
    console.log("isMoveValid call");
    const coords = {
      y_start: start[0],
      x_start: start[1],
      y_end: end[0],
      x_end: end[1],
      y_abs: Math.abs(start[0] - end[0]),
      x_abs: Math.abs(start[1] - end[1]),
    };
    // TODO: I dont think we need start checks here
    if (
      coords["y_start"] > 7 ||
      coords["y_end"] < 0 ||
      coords["x_start"] < 0 ||
      coords["x_end"] > 7
    )
      return false;
    const bool = this.MOVE_LOOKUP[this.type][this.color](coords, gameState);
    return bool;
  }

  #isMoveValidPawnBlack(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Handle double move
    if (y_start == 1 && y_abs == 2 && x_abs == 0 && !landingSpace) return true;
    // Handle moving too far or in wrong direction
    if (y_abs > 1 || x_abs > 1 || y_end < y_start) return false;
    // Prevent foward kill
    if (x_abs == 0 && landingSpace) return false;
    // Prevent diagonal move
    if (y_abs == 1 && x_abs == 1 && !landingSpace) return false;
    // Prevent sideways move
    if (y_abs == 0 && x_abs == 1) return false;
    // Prevent kill of own color
    if (
      landingSpace &&
      y_end > y_start &&
      x_abs == 1 &&
      landingSpace.color == this.color
    )
      return false;

    // Kill piece logic
    const img = document
      .getElementById(`${y_end}-${x_end}`)
      .querySelector("img");
    if (img) img.remove();
    delete gameState[y_end][x_end];
    return true;
  }

  #isMoveValidPawnWhite(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Handle double move
    if (y_start == 6 && y_abs == 2 && x_abs == 0 && !landingSpace) return true;
    // Handle moving too far or in wrong direction
    if (y_abs > 1 || x_abs > 1 || y_end > y_start) return false;
    // Prevent forward kill
    if (x_abs == 0 && landingSpace) return false;
    // Prevent diagonal move
    if (y_abs == 1 && x_abs == 1 && !landingSpace) return false;
    // Prevent sideways move
    if (y_abs == 0 && x_abs == 1) return false;
    // Prevent kill of own color
    if (
      landingSpace &&
      y_end < y_start &&
      x_abs == 1 &&
      landingSpace.color == this.color
    )
      return false;
    // Kill piece
    const img = document
      .getElementById(`${y_end}-${x_end}`)
      .querySelector("img");
    if (img) img.remove();
    delete gameState[y_end][x_end];
    return true;
  }

  #isMoveValidRookBlack(coords, gameState) {
    console.log("isMoveValidRookBlack");
    return true;
  }

  #isMoveValidRookWhite(coords, gameState) {
    console.log("isMoveValidRookWhite");
    return true;
  }

  #isMoveValidKnightBlack(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Handle non-L movements
    if (y_abs == 0 || x_abs == 0) return false;
    if (y_abs == 1 && x_abs != 2) return false;
    if (y_abs == 2 && x_abs != 1) return false;
    // Handle valid move to empty space
    if (!landingSpace) return true;
    // Handle attempt to land on own color
    if (landingSpace.color == this.color) return false;
    // kill piece
    const img = document
      .getElementById(`${y_end}-${x_end}`)
      .querySelector("img");
    if (img) img.remove();
    delete gameState[y_end][x_end];
    return true;
  }

  #isMoveValidKnightWhite(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Handle non-L movements
    if (y_abs == 0 || x_abs == 0) return false;
    if (y_abs == 1 && x_abs != 2) return false;
    if (y_abs == 2 && x_abs != 1) return false;
    // Handle valid move to empty space
    if (!landingSpace) return true;
    // Handle attempt to land on own color
    if (landingSpace.color == this.color) return false;
    // kill piece
    const img = document
      .getElementById(`${y_end}-${x_end}`)
      .querySelector("img");
    if (img) img.remove();
    delete gameState[y_end][x_end];
    return true;
  }

  #isMoveValidBishopBlack(coords, gameState) {
    console.log("isMoveValidBishopBlack");
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    if (x_abs != y_abs) return false;
    if (y_end < y_start && x_end < x_start)
      return this.#isMoveValidBishopHelper("UP_LEFT", coords, gameState);
    if (y_end < y_start && x_end > x_start)
      return this.#isMoveValidBishopHelper("UP_RIGHT", coords, gameState);
    if (y_end > y_start && x_end < x_start)
      return this.#isMoveValidBishopHelper("DOWN_LEFT", coords, gameState);
    if (y_end > y_start && x_end > x_start)
      return this.#isMoveValidBishopHelper("DOWN_RIGHT", coords, gameState);
    return true;
  }

  #isMoveValidBishopWhite(coords, gameState) {
    console.log("isMoveValidBishopWhite");
    return true;
  }

  #isMoveValidKingBlack(coords, gameState) {
    console.log("isMoveValidKingBlack");
    return true;
  }

  #isMoveValidKingWhite(coords, gameState) {
    console.log("isMoveValidKingWhite");
    return true;
  }

  #isMoveValidQueenBlack(coords, gameState) {
    console.log("isMoveValidQueenBlack");
    return true;
  }
  #isMoveValidQueenWhite(coords, gameState) {
    console.log("isMoveValidQueenWhite");
    return true;
  }

  #isMoveValidBishopHelper(direction, coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    let y = Number(y_start);
    let x = Number(x_start);

    while (x !== Number(x_end) && y !== Number(y_end)) {
      switch (direction) {
        case "UP_LEFT":
          y -= 1;
          x -= 1;
          break;
        case "UP_RIGHT":
          y -= 1;
          x += 1;
          break;
        case "DOWN_LEFT":
          y += 1;
          x -= 1;
          break;
        case "DOWN_RIGHT":
          y += 1;
          x += 1;
          break;
      }
      let nextSpace = gameState[y][x];
      if (nextSpace) return false;
    }
    if (!landingSpace) return true;
    if (landingSpace && landingSpace.color !== this.color) return true;
    return false;
  }
}
