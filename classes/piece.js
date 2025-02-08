export class Piece {
  constructor(type, color, board) {
    this.board = board;
    this.type = type;
    this.color = color;
    this.hasMoved = false;
    this.MOVE_LOOKUP = {
      pawn: this.#isMoveValidPawn.bind(this),
      rook: this.#isMoveValidRook.bind(this),
      knight: this.#isMoveValidKnight.bind(this),
      bishop: this.#isMoveValidBishop.bind(this),
      king: this.#isMoveValidKing.bind(this),
      queen: this.#isMoveValidQueen.bind(this),
    };
  }

  isMoveValid(
    start,
    end,
    gameState = {},
    activePlayer = {},
    king_check = false
  ) {
    // console.log("isMoveValid");
    // console.log(`activePlayer[color]: ${activePlayer["color"]}`);
    // console.log(`this.color: ${this.color}`);
    if (activePlayer["color"] !== this.color) return false;
    const coords = {
      y_start: start[0],
      x_start: start[1],
      y_end: end[0],
      x_end: end[1],
      y_abs: Math.abs(start[0] - end[0]),
      x_abs: Math.abs(start[1] - end[1]),
    };
    if (
      // TODO: I dont think we need start checks here
      // coords["y_start"] > 7 ||
      // coords["y_end"] < 0 ||
      coords["x_start"] < 0 ||
      coords["x_end"] > 7
    )
      return false;
    return this.MOVE_LOOKUP[this.type](coords, gameState, king_check);
  }

  #isMoveValidPawn(coords, gameState, king_check = false) {
    console.log("isMoveValidPawn start");
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    if (this.color == "black") {
      // Handle double move
      if (y_start == 1 && y_abs == 2 && x_abs == 0 && !landingSpace)
        return true;
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
      if (!king_check) {
        console.log("isMoveValidPawn kill, this.color == black");
        //this.#killPiece(y_end, x_end, gameState);
      }
      return true;
    } else if (this.color == "white") {
      if (y_start == 6 && y_abs == 2 && x_abs == 0 && !landingSpace)
        return true;
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
      if (!king_check) {
        console.log("isMoveValidPawn kill, this.color == white");
        //this.#killPiece(y_end, x_end, gameState);
      }
      return true;
    }
  }

  #isMoveValidRook(coords, gameState, king_check = false) {
    console.log("isMoveValidRookWhite");
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Handle invalid non-straight line moves
    if (y_abs != 0 && x_abs != 0) return false;
    if (x_abs == 0 && y_end > y_start)
      return this.#isMoveValidRookHelper("DOWN", coords, gameState, king_check);
    if (x_abs == 0 && y_end < y_start)
      return this.#isMoveValidRookHelper("UP", coords, gameState, king_check);
    if (y_abs == 0 && x_end > x_start)
      return this.#isMoveValidRookHelper(
        "RIGHT",
        coords,
        gameState,
        king_check
      );
    if (y_abs == 0 && x_end < x_start)
      return this.#isMoveValidRookHelper("LEFT", coords, gameState, king_check);
  }

  #isMoveValidKnight(coords, gameState, king_check = false) {
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
    if (!king_check) {
      console.log("isMoveValidKnight, kill piece");
      //this.#killPiece(y_end, x_end, gameState);
    }
    return true;
  }

  #isMoveValidBishop(coords, gameState, king_check = false) {
    console.log("isMoveValidBishopBlack");
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    if (x_abs != y_abs) return false;
    if (y_end < y_start && x_end < x_start)
      return this.#isMoveValidBishopHelper(
        "UP_LEFT",
        coords,
        gameState,
        king_check
      );
    if (y_end < y_start && x_end > x_start)
      return this.#isMoveValidBishopHelper(
        "UP_RIGHT",
        coords,
        gameState,
        king_check
      );
    if (y_end > y_start && x_end < x_start)
      return this.#isMoveValidBishopHelper(
        "DOWN_LEFT",
        coords,
        gameState,
        king_check
      );
    if (y_end > y_start && x_end > x_start)
      return this.#isMoveValidBishopHelper(
        "DOWN_RIGHT",
        coords,
        gameState,
        king_check
      );
  }

  #isMoveValidKing(coords, gameState, king_check = false) {
    // console.log("isMoveValidKing.this:");
    // console.log(this);
    //console.log(`king_check: ${king_check}`);
    // console.log("isMoveValidKing");
    //console.log(`coords: ${JSON.stringify(coords)}`);
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    // console.log("isMoveValidKing.coords:");
    // console.log(coords);
    // console.log("gameState:");
    // console.log(gameState);
    const landingSpace = gameState[y_end][x_end];
    // console.log("isMoveValidKing landingSpace:");
    // console.log(landingSpace);
    // console.log(`isMoveValid.landingSpace.color: ${landingSpace?.color}`);
    // console.log(`isMoveValid.this.color: ${this.color}`);
    if (y_abs > 1 || x_abs > 1) {
      console.log("king tries to move too far");
      return false;
    }
    if (landingSpace && landingSpace.color == this.color) {
      console.log("king tries to move to same color");
      return false;
    }
    if (!landingSpace) {
      console.log("king moves to empty space");
      this.hasMoved = true;
      return true;
    }
    if (!king_check) {
      console.log("isMoveValidKing, kill piece");
      //this.#killPiece(y_end, x_end, gameState);
    }
    this.hasMoved = true;
    return true;
  }

  #isMoveValidQueen(coords, gameState, king_check = false) {
    console.log("isMoveValidQueen");
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    let movementType = null;
    if (y_abs == x_abs) movementType = "bishop";
    if ((y_abs == 0 && x_abs !== 0) || (y_abs != 0 && x_abs == 0))
      movementType = "rook";
    if (!movementType) return false;

    if (movementType == "bishop") {
      if (y_end < y_start && x_end < x_start)
        return this.#isMoveValidBishopHelper("UP_LEFT", coords, gameState);
      if (y_end < y_start && x_end > x_start)
        return this.#isMoveValidBishopHelper("UP_RIGHT", coords, gameState);
      if (y_end > y_start && x_end < x_start)
        return this.#isMoveValidBishopHelper("DOWN_LEFT", coords, gameState);
      if (y_end > y_start && x_end > x_start)
        return this.#isMoveValidBishopHelper("DOWN_RIGHT", coords, gameState);
    }
    if (movementType == "rook") {
      if (x_abs == 0 && y_end > y_start)
        return this.#isMoveValidRookHelper("DOWN", coords, gameState);
      if (x_abs == 0 && y_end < y_start)
        return this.#isMoveValidRookHelper("UP", coords, gameState);
      if (y_abs == 0 && x_end > x_start)
        return this.#isMoveValidRookHelper("RIGHT", coords, gameState);
      if (y_abs == 0 && x_end < x_start)
        return this.#isMoveValidRookHelper("LEFT", coords, gameState);
    }
  }

  #isMoveValidBishopHelper(direction, coords, gameState, king_check = false) {
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

      if (nextSpace) {
        if (x == x_end && y == y_end && nextSpace.color !== this.color) {
          if (!king_check) {
            console.log("isMoveValidBishopHelper kill");
            //this.#killPiece(y_end, x_end, gameState);
          }
          return true;
        }
        return false;
      }
    }
    if (!landingSpace) return true;

    if (landingSpace && landingSpace.color === this.color) return false;

    if (landingSpace && landingSpace.color !== this.color) return true;
  }

  #isMoveValidRookHelper(direction, coords, gameState, king_check = false) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    let y = Number(y_start);
    let x = Number(x_start);
    while (x !== Number(x_end) || y !== Number(y_end)) {
      switch (direction) {
        case "UP":
          y -= 1;
          break;
        case "DOWN":
          y += 1;
          break;
        case "LEFT":
          x -= 1;
          break;
        case "RIGHT":
          x += 1;
          break;
      }
      let nextSpace = gameState[y][x];
      if (nextSpace) {
        if (x == x_end && y == y_end && nextSpace.color !== this.color) {
          if (!king_check) {
            console.log("isMoveValidRookHelper kill");
            // this.#killPiece(y_end, x_end, gameState);
          }
          this.hasMoved = true;
          return true;
        }
        return false;
      }
    }
    if (!landingSpace) {
      this.hasMoved = true;
      return true;
    }
    if (landingSpace && landingSpace.color === this.color) return false;
    if (landingSpace && landingSpace.color !== this.color) {
      this.hasMoved = true;
      return true;
    }
  }
}
