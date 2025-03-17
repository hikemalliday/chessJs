export function syncBoardStateQAButton(syncBoardStateFunc, gameState) {
  const newGameState = [
    [
      { type: "rook", color: "black" },
      { type: "knight", color: "black" },
      { type: "bishop", color: "black" },
      { type: "queen", color: "black" },
      { type: "king", color: "black" },
      { type: "bishop", color: "black" },
      { type: "knight", color: "black" },
      { type: "rook", color: "black" },
    ],
    [
      { type: "pawn", color: "black" },
      { type: "pawn", color: "black" },
      null,
      { type: "pawn", color: "black" },
      { type: "pawn", color: "black" },
      { type: "pawn", color: "black" },
      { type: "pawn", color: "black" },
      { type: "pawn", color: "black" },
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      { type: "pawn", color: "white" },
      { type: "pawn", color: "white" },
      { type: "pawn", color: "white" },
      { type: "pawn", color: "white" },
      { type: "pawn", color: "white" },
      { type: "pawn", color: "white" },
      { type: "pawn", color: "white" },
      { type: "pawn", color: "white" },
    ],
    [
      { type: "rook", color: "white" },
      { type: "knight", color: "white" },
      { type: "bishop", color: "white" },
      { type: "queen", color: "white" },
      { type: "king", color: "white" },
      { type: "bishop", color: "white" },
      { type: "knight", color: "white" },
      { type: "rook", color: "white" },
    ],
  ];
  const qaDiv = document.getElementById("qa-sync-board-state");
  const button = document.createElement("button");
  button.textContent = "sync board state";
  button.addEventListener("click", () =>
    syncBoardStateFunc(gameState, newGameState)
  );
  qaDiv.append(button);
}
