import {
  generateBoard,
  generateBoardState,
  getStartingGameState,
} from "./helpers.js";

console.log("YO WHATS UP");
generateBoard();
const gameState = getStartingGameState();
console.log(gameState);
generateBoardState(gameState);
