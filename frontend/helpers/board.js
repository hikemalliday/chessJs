import { postGameState } from "../requests/requests.js";

export function updateActivePlayer(activePlayer) {
  activePlayer["color"] = activePlayer["color"] === "white" ? "black" : "white";
}

export function updateActivePlayerText(activePlayer) {
  const activePlayerDiv = document.getElementById("active-player-div");
  activePlayer["color"] == "white"
    ? (activePlayerDiv.innerText = "Active player: Black")
    : (activePlayerDiv.innerText = "Active player: White");
}

export function determineCheck(board) {
  const king = board.KING[board.activePlayer["color"]];
  const threats = king.getThreats(board.gameState, board.activePlayer["color"]);
  const checkDiv = document.getElementById("check-div");
  if (threats.length == 0) {
    checkDiv.innerText = "";
    return;
  }
  // If threat exists, determine checkmate
  let canBlockOrKillThreat = null;
  let canMoveOutOfCheck = null;
  canMoveOutOfCheck = king.canMoveOutOfCheck(
    board.gameState,
    board.activePlayer["color"]
  );
  if (!canMoveOutOfCheck) {
    canBlockOrKillThreat = king.canBlockOrKillThreat(
      threats,
      board.gameState,
      board.activePlayer["color"]
    );
  }
  checkDiv.innerText = `${board.activePlayer["color"]} king is in check`;
  if (!canBlockOrKillThreat && !canMoveOutOfCheck) {
    checkDiv.innerText = `Checkmate. ${board.activePlayer["color"]} loses!`;
  }
}

export function generateBoard() {
  const boardContainer = document.getElementById("board-container");

  for (let y = 0; y < 8; y++) {
    let row = document.createElement("div");
    let colorIsWhite = true;
    row.classList.add("board-row");

    if (y % 2 != 0) {
      colorIsWhite = false;
    }

    for (let x = 0; x < 8; x++) {
      const space = document.createElement("div");
      space.id = `${y}-${x}`;

      if (colorIsWhite) {
        space.classList.add("space");
        space.classList.add("white");
      } else {
        space.classList.add("space");
        space.classList.add("beige");
      }

      row.appendChild(space);
      colorIsWhite = !colorIsWhite;
    }
    boardContainer.appendChild(row);
  }
}

export function generateStartingImages(gameState) {
  for (let y = 0; y < gameState.length; y++) {
    for (let x = 0; x < gameState[0].length; x++) {
      const piece = gameState[y][x];
      generateImg(y, x, piece);
    }
  }
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

export function handlePostGameState(activePlayer, gameState) {
  const convertedGameState = Array(8)
    .fill()
    .map(() => Array(8).fill(null));
  for (let y = 0; y < gameState.length; y++) {
    for (let x = 0; x < gameState[0].length; x++) {
      const space = gameState[y][x];
      if (!space) continue;
      convertedGameState[y][x] = { type: space["type"], color: space["color"] };
    }
  }
  postGameState({
    activePlayer: activePlayer["color"],
    gameState: convertedGameState,
  });
}
