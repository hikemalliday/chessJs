export function executeCastleRight(
  y_end,
  x_end,
  gameState,
  space,
  draggedPiece,
  draggedImg
) {
  const king = draggedPiece;
  const kingImg = draggedImg;
  let rook = y_end == 7 ? gameState[7][7] : gameState[0][7];
  let rookImg =
    y_end == 7
      ? document.querySelector(`img[data-coordinates="${7}-${7}"]`)
      : document.querySelector(`img[data-coordinates="${0}-${7}"]`);
  const rookLandingSpace =
    y_end == 7
      ? document.getElementById(`${7}-${5}`)
      : document.getElementById(`${0}-${5}`);
  const kingLandingSpace = document.getElementById(`${y_end}-${x_end}`);
  // Check for threats before move and on first and second space
  let moveIsSafe = king.isMoveSafe(king.y, king.x, gameState);
  if (!moveIsSafe) return false;
  moveIsSafe = king.isMoveSafe(king.y, king.x + 1, gameState);
  if (!moveIsSafe) return false;
  moveIsSafe = king.isMoveSafe(king.y, king.x + 2, gameState);
  if (!moveIsSafe) return false;
  // Moved pieces
  gameState[y_end][x_end] = king;
  if (y_end == 0) {
    gameState[0][5] = rook;
  } else {
    gameState[7][5] = rook;
  }
  // Move images
  kingLandingSpace.append(kingImg);
  rookLandingSpace.append(rookImg);
  // Delete old elements and update pieces + images
  gameState[king.y][king.x] = null;
  gameState[rook.y][rook.x] = null;
  king.y = y_end;
  king.x = x_end;
  rook.y = y_end == 7 ? 7 : 0;
  rook.x = 5;
  king.hasMoved = true;
  rook.hasMoved = true;
  kingImg.dataset.coordinates = `${king.y}-${king.x}`;
  rookImg.dataset.coordinates = `${rook.y}-${rook.x}`;
  return true;
}

export function executeCastleLeft(
  y_end,
  x_end,
  gameState,
  space,
  draggedPiece,
  draggedImg
) {
  // Rook landing space will be x = 3
  const king = draggedPiece;
  const kingImg = draggedImg;
  let rook = y_end == 7 ? gameState[7][0] : gameState[0][0];
  let rookImg =
    y_end == 7
      ? document.querySelector(`img[data-coordinates="${7}-${0}"]`)
      : document.querySelector(`img[data-coordinates="${0}-${0}"]`);
  const rookLandingSpace =
    y_end == 7
      ? document.getElementById(`${7}-${3}`)
      : document.getElementById(`${0}-${3}`);
  const kingLandingSpace = document.getElementById(`${y_end}-${x_end}`);
  // Check for threats before move, and on first and second space

  let moveIsSafe = king.isMoveSafe(king.y, king.x, gameState);
  if (!moveIsSafe) return false;
  moveIsSafe = king.isMoveSafe(king.y, king.x - 1, gameState);
  if (!moveIsSafe) return false;
  moveIsSafe = king.isMoveSafe(king.y, king.x - 2, gameState);
  if (!moveIsSafe) return false;
  // Moved pieces
  gameState[y_end][x_end] = king;
  if (y_end == 0) {
    gameState[0][3] = rook;
  } else {
    gameState[7][3] = rook;
  }
  // Move images
  kingLandingSpace.append(kingImg);
  rookLandingSpace.append(rookImg);
  // Delete old elements and update pieces + images
  gameState[king.y][king.x] = null;
  gameState[rook.y][rook.x] = null;
  king.y = y_end;
  king.x = x_end;
  rook.y = y_end == 7 ? 7 : 0;
  rook.x = 3;
  king.hasMoved = true;
  rook.hasMoved = true;
  kingImg.dataset.coordinates = `${king.y}-${king.x}`;
  rookImg.dataset.coordinates = `${rook.y}-${rook.x}`;
  king.hasMoved = true;
  rook.hasMove = true;
  return true;
}

export function executeRegularMove(
  y_end,
  x_end,
  gameState,
  space,
  draggedPiece,
  draggedImg
) {
  draggedPiece.executeMove(
    {
      y_end: y_end,
      x_end: x_end,
    },
    gameState
  );
  // Remove img (if killed piece)
  const img = document.getElementById(`${y_end}-${x_end}`).querySelector("img");
  if (img) img.remove();
  // Put the dragged image to its resting location
  space.appendChild(draggedImg);
  draggedImg.dataset.coordinates = `${y_end}-${x_end}`;
  return true;
}
