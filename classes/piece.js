export class Piece {
  constructor(type, color, board, y, x) {
    this.board = board;
    this.type = type;
    this.color = color;
    this.hasMoved = false;
    this.y = y;
    this.x = x;
  }

  isMoveValid(start, end, gameState = {}, activePlayer = {}) {
    //console.log("isMoveValid call");
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
      coords["x_start"] < 0 ||
      coords["x_end"] < 0 ||
      coords["y_start"] < 0 ||
      coords["y_end"] < 0 ||
      coords["x_start"] > 7 ||
      coords["x_end"] > 7 ||
      coords["y_start"] > 7 ||
      coords["y_end"] > 7
    )
      return false;
    // Defined in child
    return this.MOVE_LOOKUP(coords, gameState);
  }

  isMoveValidRookHelper(direction, coords, gameState) {
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

  isMoveValidBishopHelper(direction, coords, gameState) {
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
        if (x == x_end && y == y_end && nextSpace.color !== this.color)
          return true;

        return false;
      }
    }
    if (!landingSpace) return true;

    if (landingSpace && landingSpace.color === this.color) return false;

    if (landingSpace && landingSpace.color !== this.color) return true;
  }
  killPiece(y_end, x_end, gameState) {
    const pieceTokill = this.gameState[y_end][x_end];
    if (pieceTokill) {
      Object.assign(pieceTokill, this.gameState[y_end][x_end]);
    }
    delete this.gameState[y_end][x_end];
    if (pieceTokill) {
      pieceTokill.y = y_end;
      pieceTokill.x = x_end;
    }
    return pieceTokill;
  }
  executeMove(coords, gameState) {
    const { y_end, x_end } = coords;

    this.y = y_end;
    this.x = x_end;

    // kill piece and return deep clone
    const killedPiece = this.#killPiece(y_end, x_end);
    // Move piece
    gameState[y_end][x_end] = draggedPiece;
    // Create deep clone of movedPiece
    const movedPiece = Object.create(Object.getPrototypeOf(draggedPiece));
    Object.assign(movedPiece, draggedPiece);

    delete gameState[y_start][x_start];

    return {
      killedPiece: killedPiece,
      movedPiece: movedPiece,
    };
  }
}
