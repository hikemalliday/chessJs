import {
  generateBoard,
  generateBoardState,
  getStartingGameState,
} from "./helpers.js";

generateBoard();
const gameState = getStartingGameState();
generateBoardState(gameState);
addEventListeners();

// Add event listeners for all pieces
function addEventListeners() {
  let draggedImg = null;
  let draggedPiece = null;
  let y_start = null;
  let x_start = null;
  let y_end = null;
  let x_end = null;

  document.querySelectorAll("img").forEach((piece) => {
    piece.addEventListener("dragstart", (e) => {
      draggedImg = e.target;
      if (!draggedImg) {
        console.log("dragstart early return");
        return;
      }

      [y_start, x_start] = draggedImg.dataset.coordinates.split("-");
      draggedPiece = gameState[y_start][x_start];
      if (!draggedPiece) return;
      console.log(draggedPiece);

      setTimeout(() => {
        e.target.style.display = "none"; // Hide the piece while dragging
      }, 0);
    });

    piece.addEventListener("dragend", (e) => {
      setTimeout(() => {
        e.target.style.display = "flex";
        draggedImg = null;
        draggedPiece = null;
      }, 0);
    });
  });

  document.querySelectorAll(".space").forEach((space) => {
    space.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow drop
    });

    space.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedImg || !draggedPiece) {
        console.log("drop early return");
        return;
      }
      [y_end, x_end] = space.id.split("-");
      if (
        !draggedPiece.isMoveValid([y_start, x_start], [y_end, x_end], gameState)
      )
        return;
      gameState[y_end][x_end] = draggedPiece; // Set end to draggedPiece, we might need to just make a copy tbh
      delete gameState[y_start][x_start];
      space.appendChild(draggedImg); // Move the piece to the new space
      draggedImg.dataset.coordinates = `${y_end}-${x_end}`;
    });
  });
}
