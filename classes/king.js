import { Piece } from "./piece.js";

export class King extends Piece {
  constructor(type, color, board, y, x) {
    super(type, color, board, y, x);
    this.MOVE_LOOKUP = this.#isMoveValidKing.bind(this);
  }

  #isMoveValidKing(coords, gameState) {
    const { y_start, x_start, y_end, x_end, y_abs, x_abs } = coords;
    const landingSpace = gameState[y_end][x_end];
    // Check for castle
    if (this.hasMoved == false && x_abs == 2 && x_end > x_start)
      return this.#isCastleRightValid(y_end, gameState);
    if (this.hasMoved == false && x_abs == 2 && x_end < x_start)
      return this.#isCastleLeftValid(y_end, gameState);
    if (y_abs > 1 || x_abs > 1) {
      return 0;
    }
    if (landingSpace && landingSpace.color == this.color) {
      return 0;
    }
    if (!landingSpace) {
      return 1;
    }
    return 1;
  }

  #isCastleRightValid(y_end, gameState) {
    const firstSpace = gameState[y_end][this.x + 1];
    const secondSpace = gameState[y_end][this.x + 2];
    if (firstSpace || secondSpace) return 0;
    const cornerPiece = gameState[y_end][7];
    if (!cornerPiece) return 0;
    if (cornerPiece.type != "rook") return 0;
    if (cornerPiece.hasMoved) return 0;
    return 3;
  }

  #isCastleLeftValid(y_end, gameState) {
    const firstSpace = gameState[y_end][this.x - 1];
    const secondSpace = gameState[y_end][this.x - 2];
    if (firstSpace || secondSpace) return 0;
    const cornerPiece = gameState[y_end][0];
    if (!cornerPiece) return 0;
    if (cornerPiece.type != "rook") return 0;
    if (cornerPiece.hasMoved) return 0;
    return 2;
  }

  getThreatPath(threat, spacesSet) {
    if (threat.type == "knight") {
      spacesSet.add([threat.y, threat.x]);
      return;
    }
    let direction = null;
    if (threat.y > this.y && threat.x < this.x) direction = "DOWN_LEFT";
    else if (threat.y > this.y && threat.x > this.x) direction = "DOWN_RIGHT";
    else if (threat.y < this.y && threat.x < this.x) direction = "UP_LEFT";
    else if (threat.y < this.y && threat.x > this.x) direction = "UP_RIGHT";
    else if (threat.y > this.y) direction = "UP";
    else if (threat.y < this.y) direction = "DOWN";
    else if (threat.x < this.x) direction = "LEFT";
    else if (threat.x > this.x) direction = "RIGHT";

    let y = this.y;
    let x = this.x;

    while (true) {
      switch (direction) {
        case "UP":
          y = y - 1;
          break;
        case "DOWN":
          y = y + 1;
          break;
        case "LEFT":
          x = x - 1;
          break;
        case "RIGHT":
          x = x + 1;
          break;
        case "DOWN_LEFT":
          y = y + 1;
          x = x - 1;
          break;
        case "DOWN_RIGHT":
          y = y + 1;
          x = x + 1;
          break;
        case "UP_LEFT":
          y = y - 1;
          x = x - 1;
          break;
        case "UP_RIGHT":
          y = y - 1;
          x = x + 1;
          break;
      }
      spacesSet.add([y, x]);
      if (y == threat.y && x == threat.x) break;
    }
  }

  canMoveOutOfCheck(gameState, color) {
    const king = this;
    const possibleMoves = {
      UP: {
        is_valid: king.isMoveValid(king.y - 1, king.x, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y - 1,
          x_end: king.x,
        },
      },
      DOWN: {
        is_valid: king.isMoveValid(king.y + 1, king.x, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y + 1,
          x_end: king.x,
        },
      },
      LEFT: {
        is_valid: king.isMoveValid(king.y, king.x - 1, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y,
          x_end: king.x - 1,
        },
      },
      RIGHT: {
        is_valid: king.isMoveValid(king.y, king.x + 1, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y,
          x_end: king.x + 1,
        },
      },
      UP_RIGHT: {
        is_valid: king.isMoveValid(king.y - 1, king.x + 1, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y - 1,
          x_end: king.x + 1,
        },
      },
      UP_LEFT: {
        is_valid: king.isMoveValid(king.y - 1, king.x - 1, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y - 1,
          x_end: king.x - 1,
        },
      },
      DOWN_RIGHT: {
        is_valid: king.isMoveValid(king.y + 1, king.x + 1, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y + 1,
          x_end: king.x + 1,
        },
      },
      DOWN_LEFT: {
        is_valid: king.isMoveValid(king.y + 1, king.x - 1, gameState, color),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y + 1,
          x_end: king.x - 1,
        },
      },
    };
    const validMoves = [];
    // We need to loop over all directions and perform those moves if valid
    for (const direction in possibleMoves) {
      const { y_start, x_start, y_end, x_end } =
        possibleMoves[direction]["coords"];

      if (!possibleMoves[direction]["is_valid"]) continue;
      const moveIsSafe = king.isMoveSafe(y_end, x_end, gameState);
      validMoves.push(moveIsSafe);
    }

    for (const bool of validMoves) if (bool) return true;
    return false;
  }
  // Helper used by getThreats
  #findPiece(direction, gameState) {
    let y = this.y;
    let x = this.x;
    // Find Knight
    const knightMoves = new Set([
      "UP_TWO_LEFT_ONE",
      "UP_ONE_LEFT_TWO",
      "UP_TWO_RIGHT_ONE",
      "UP_ONE_RIGHT_TWO",
      "DOWN_TWO_RIGHT_ONE",
      "DOWN_ONE_RIGHT_TWO",
      "DOWN_TWO_LEFT_ONE",
      "DOWN_ONE_LEFT_TWO",
    ]);
    // Not sure why theses need to be disjointed but whatever
    if (knightMoves.has(direction)) {
      switch (direction) {
        case "UP_TWO_LEFT_ONE":
          y = y - 2;
          x = x - 1;
          break;
        case "UP_ONE_LEFT_TWO":
          y = y - 1;
          x = x - 2;
          break;
        case "UP_TWO_RIGHT_ONE":
          y = y - 2;
          x = x + 1;
          break;
        case "UP_ONE_RIGHT_TWO":
          y = y - 1;
          x = x + 2;
          break;
        case "DOWN_TWO_RIGHT_ONE":
          y = y + 2;
          x = x + 1;
          break;
        case "DOWN_ONE_RIGHT_TWO":
          y = y + 1;
          x = x + 2;
          break;
        case "DOWN_ONE_LEFT_TWO":
          y = y + 1;
          x = x - 2;
          break;
        case "DOWN_TWO_LEFT_ONE":
          y = y + 2;
          x = x - 1;
          break;
      }
      if (y < 0 || y > 7 || x < 0 || x > 7) return null;
      const piece = gameState[y][x];
      return piece;
    }
    while (true) {
      // Move first
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
      // Check bounds before accessing the game state
      if (y < 0 || y > 7 || x < 0 || x > 7) break;

      const piece = gameState[y][x];
      if (piece) return piece;
    }
    return null;
  }

  getThreats(gameState, color) {
    const enemyColor = color == "white" ? "black" : "white";

    const directions = [
      "UP",
      "DOWN",
      "LEFT",
      "RIGHT",
      "UP_RIGHT",
      "UP_LEFT",
      "DOWN_RIGHT",
      "DOWN_LEFT",
      "UP_TWO_LEFT_ONE",
      "UP_ONE_LEFT_TWO",
      "UP_TWO_RIGHT_ONE",
      "UP_ONE_RIGHT_TWO",
      "DOWN_TWO_RIGHT_ONE",
      "DOWN_ONE_RIGHT_TWO",
      "DOWN_TWO_LEFT_ONE",
      "DOWN_ONE_LEFT_TWO",
    ];

    const threats = [];

    for (const direction of directions) {
      // Could this be moved to the King class?
      const foundPiece = this.#findPiece(direction, gameState);
      if (foundPiece) {
        const piece = foundPiece; // This assignement is useless I think
        if (piece.color !== this.color) {
          const isValid = piece.isMoveValid(
            this.y,
            this.x,
            gameState,
            enemyColor
          );
          if (isValid) threats.push(piece);
        }
      }
    }
    return threats;
  }

  canBlockOrKillThreat(threats, gameState, color) {
    const spacesSet = new Set();
    for (const threat of threats) {
      this.getThreatPath(threat, spacesSet);
    }
    // We now have the set of spaces we must block.
    const pieces = [];
    for (const row of gameState) {
      for (const piece of row) {
        if (piece?.color == color && piece?.type != "king") pieces.push(piece);
      }
    }

    const validMoves = [];
    for (const space of spacesSet) {
      let y = space[0];
      let x = space[1];
      for (const piece of pieces) {
        const isValid = piece.isMoveValid(y, x, gameState, color);
        if (isValid) {
          validMoves.push([piece, [y, x]]);
        }
      }
    }

    for (const [piece, [y, x]] of validMoves) {
      const moveIsSafe = piece.isMoveSafe(y, x, gameState);
      if (moveIsSafe) return true;
    }
    return false;
  }
}
