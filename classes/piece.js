import { killPiece } from "../helpers/misc.js";

export class Piece {
  constructor(type, color, board, y, x) {
    this.board = board;
    this.type = type;
    this.color = color;
    this.hasMoved = false;
    this.y = y;
    this.x = x;
  }

  isMoveValid(y_end, x_end, gameState = {}, color) {
    if (color !== this.color) return false;

    const coords = {
      y_start: this.y,
      x_start: this.x,
      y_end: y_end,
      x_end: x_end,
      y_abs: Math.abs(this.y - y_end),
      x_abs: Math.abs(this.x - x_end),
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
          return 1;
        }
        return 0;
      }
    }
    if (!landingSpace) {
      return 1;
    }
    if (landingSpace && landingSpace.color === this.color) return 0;
    if (landingSpace && landingSpace.color !== this.color) {
      return 1;
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
          return 1;

        return 0;
      }
    }
    if (!landingSpace) return 1;

    if (landingSpace && landingSpace.color === this.color) return 0;

    if (landingSpace && landingSpace.color !== this.color) return 1;
  }

  executeMove(y_end, x_end, gameState) {
    gameState[this.y][this.x] = null;
    this.y = y_end;
    this.x = x_end;
    const killedPiece = killPiece(y_end, x_end, gameState);
    // Move piece
    gameState[y_end][x_end] = this;
    this.hasMoved = true;
    return {
      killedPiece: killedPiece,
      movedPiece: this,
    };
  }

  isMoveSafe(y, x, gameState) {
    const deepCopy = gameState.map((row) =>
      row.map((space) =>
        space
          ? new space.constructor(
              space.type,
              space.color,
              space.board,
              space.y,
              space.x
            )
          : null
      )
    );
    const king = this.board.getKing(deepCopy, this.board.activePlayer["color"]);
    const piece = deepCopy[this.y][this.x];
    piece.executeMove(y, x, deepCopy);
    const threats = king.getThreats(deepCopy, this.board.activePlayer["color"]);
    return threats.length == 0;
  }
}
