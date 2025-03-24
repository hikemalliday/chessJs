import { API_KEY, BACKEND_URL } from "../config.js";
import { setTokens, clearTokens } from "./localStorageHelpers.js";

export async function getGameState() {
  try {
    const access = localStorage.getItem("access");
    if (!access) throw new Error("getGameState error: No access token found.");

    const response = await fetch(`${BACKEND_URL}/game_state`, {
      headers: { "X-API-Key": API_KEY, Authorization: `Bearer ${access}` },
    });

    if (!response.ok)
      throw new Error(`getGameState http error: Status: ${response.status}`);

    return await response.json();
  } catch (error) {
    throw new Error(`getGameState error: ${error}`);
  }
}

export async function postGameState(payload) {
  try {
    const access = localStorage.getItem("access");
    if (!access) throw new Error("postGameState error: No access token found.");

    const response = await fetch(`${BACKEND_URL}/game_state`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        Authorization: `Bearer ${access}`,
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
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("postRefresh error: No refresh token found.");

    const response = await fetch(`${BACKEND_URL}/refresh`, {
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
    const data = await response.json();
    setTokens(data.access, refresh);
    return data;
  } catch (error) {
    throw new Error(`postRefresh error: ${error}`);
  }
}

export async function postSignUp(payload) {
  try {
    const response = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`postSignUp http error: Status: ${response.status}`);
    }
    const data = await response.json();
    setTokens(data.access, data.refresh);
    return data;
  } catch (error) {
    throw new Error(`postSignUp error: ${error}`);
  }
}

export async function postLogin(payload) {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`postLogin http error: Status: ${response.status}`);
    const data = await response.json();
    setTokens(data.access, data.refresh);
  } catch (error) {
    throw new Error(`postLogin error: ${error}`);
  }
}
