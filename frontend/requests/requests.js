export async function getGameState() {
  try {
    const response = await fetch("http://localhost:8001/game_state", {
      headers: { "X-API-Key": API_KEY },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

export async function post(payload) {
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
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Success:`, data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
