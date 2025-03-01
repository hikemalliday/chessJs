import { CASTLE_LEFT } from "../constants.js";

export function executeCastle(
  y_end,
  x_end,
  gameState,
  space,
  draggedPiece,
  draggedImg,
  direction,
  board
) {
  let rook_x_start = null;
  let rook_x_end = null;
  let firstMoveOperator = null;
  let secondMoveOperator = null;

  if (direction == CASTLE_LEFT) {
    rook_x_start = 0;
    rook_x_end = 3;
    firstMoveOperator = -1;
    secondMoveOperator = -2;
  } else {
    rook_x_start = 7;
    rook_x_end = 5;
    firstMoveOperator = 1;
    secondMoveOperator = 2;
  }

  const king = draggedPiece;
  const kingImg = draggedImg;
  const kingLandingSpace = document.getElementById(`${y_end}-${x_end}`);
  const rook = gameState[y_end][rook_x_start];
  const rookImg = document.querySelector(
    `img[data-coordinates="${y_end}-${rook_x_start}"]`
  );
  const rookLandingSpace = document.getElementById(`${y_end}-${rook_x_end}`);

  let moveIsSafe = king.isMoveSafe(king.y, king.x, gameState);
  if (!moveIsSafe) return false;
  moveIsSafe = king.isMoveSafe(king.y, king.x + firstMoveOperator, gameState);
  if (!moveIsSafe) return false;
  moveIsSafe = king.isMoveSafe(king.y, king.x + secondMoveOperator, gameState);
  if (!moveIsSafe) return false;
  setLastMove(
    king,
    { y_start: king.y, x_start: king.x, y_end: y_end, x_end: x_end },
    board
  );
  setLastMove(
    rook,
    {
      y_start: rook.y,
      x_start: rook.x,
      y_end: y_end,
      x_end: rook_x_end,
    },
    board
  );
  // Move pieces
  gameState[y_end][x_end] = king;
  gameState[y_end][rook_x_end] = rook;
  // Move images
  kingLandingSpace.append(kingImg);
  rookLandingSpace.append(rookImg);
  // Delete old elements and update pieces + images
  gameState[king.y][king.x] = null;
  gameState[rook.y][rook.x] = null;
  king.y = y_end;
  king.x = x_end;
  rook.y = y_end;
  rook.x = rook_x_end;
  kingImg.dataset.coordinates = `${king.y}-${king.x}`;
  rookImg.dataset.coordinates = `${rook.y}-${rook.x}`;
  king.hasMoved = true;
  rook.hasMoved = true;
  return true;
}

export function executeRegularMove(
  y_end,
  x_end,
  gameState,
  space,
  draggedPiece,
  draggedImg,
  direction,
  board
) {
  setLastMove(
    draggedPiece,
    {
      y_start: draggedPiece.y,
      x_start: draggedPiece.x,
      y_end: y_end,
      x_end: x_end,
    },
    board
  );
  draggedPiece.executeMove(y_end, x_end, gameState);
  // Remove img (if killed piece)
  const img = document.getElementById(`${y_end}-${x_end}`).querySelector("img");
  if (img) img.remove();
  // Put the dragged image to its resting location
  space.appendChild(draggedImg);
  draggedImg.dataset.coordinates = `${y_end}-${x_end}`;
  return true;
}

function setLastMove(piece, coords, board) {
  const { y_start, x_start, y_end, x_end } = coords;
  board.lastMove.push({
    piece: piece,
    y_start: y_start,
    x_start: x_start,
    y_end: y_end,
    x_end: x_end,
  });
}
