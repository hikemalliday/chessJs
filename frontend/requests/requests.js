import { API_KEY } from "../config.js";

export async function getGameState() {
  try {
    const response = await fetch("http://localhost:8001/game_state", {
      headers: { "X-API-Key": API_KEY },
    });
    if (!response.ok) {
      throw new Error(`getGameState error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function postGameState(payload) {
  try {
    const response = await fetch("http://localhost:8001/game_state", {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
        body: JSON.stringify(payload),
      },
    });
    if (!response.ok) {
      throw new Error(`postGameState error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
