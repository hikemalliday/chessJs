import { API_KEY } from "../config.js";

export async function getGameState() {
  try {
    const response = await fetch("http://localhost:8001/game_state", {
      headers: { "X-API-Key": API_KEY },
    });
    if (!response.ok) {
      throw new Error(`getGameState http error: Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`getGameState error: ${error}`);
  }
}

export async function postGameState(payload) {
  try {
    const response = await fetch("http://localhost:8001/game_state", {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`postGameState http error: Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`postGameState error: ${error}`);
  }
}

export async function postRefresh(payload) {
  try {
    const response = await fetch("http://localhost:8001/refresh", {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`postRefresh http error: Status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`postRefresh error: ${error}`);
  }
}

export async function postSignUp(payload) {
  try {
    const response = await fetch("http://localhost:8001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`postSignUp http error: Status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`postSignUp error: ${error}`);
  }
}
