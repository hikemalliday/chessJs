// TODO: Refactor piece.killPiece
export function killPiece(y_end, x_end, gameState) {
  const killedPiece = gameState[y_end][x_end];

  gameState[y_end][x_end] = null;
  if (killedPiece) {
    killedPiece.y = y_end;
    killedPiece.x = x_end;
  }
  return killedPiece;
}

export function deleteImg(y, x) {
  const img = document.querySelector(`img[data-coordinates="${y}-${x}"]`);
  if (img) {
    img.remove();
  }
}

export function generateImg(y, x, piece) {
  if (!piece) return;
  const space = document.getElementById(`${y}-${x}`);
  const img = document.createElement("img");
  img.src = `./pieces/${piece.type}-${piece.color}.svg`;
  img.width = 50;
  img.height = 50;
  img.dataset.coordinates = `${y}-${x}`;
  space.appendChild(img);
}
