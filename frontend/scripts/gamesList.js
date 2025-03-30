import { postCreateGame, getGames } from "../requests/requests.js";
document.getElementById("create-game-button").onclick = async function () {
  await postCreateGame();
};

const { rows } = await getGames({ is_started: 0 });
const list = document.getElementById("games-list");
rows?.forEach((game) => {
  const gameLi = document.createElement("li");
  gameLi.innerText = JSON.stringify(game);
  list.appendChild(gameLi);
});
