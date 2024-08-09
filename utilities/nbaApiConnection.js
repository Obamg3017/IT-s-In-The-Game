const baseUrl = "https://api.balldontlie.io/v1";

// GET /players
const getAllPlayers = async () => {
  const path = "/players";
  const response = await fetch(baseUrl + path, {
    headers: {
      Authorization: process.env.NBA_API_KEY,
    },
  });
  return response.json();
};

// /search players
const getSearchPlayers = async (search) => {
  const path = `/players?search=${search}`;
  const response = await fetch(baseUrl + path, {
    headers: {
      Authorization: process.env.NBA_API_KEY,
    },
  });

  return response.json();
};
const getSinglePlayer = async (playerId) => {
  const path = `/players/${playerId}`;
  const response = await fetch(baseUrl + path, {
    headers: {
      Authorization: process.env.NBA_API_KEY,
    },
  });

  return response.json();
};
// GET /stats
const getPlayerStats = async (playerID) => {
  console.log(playerID)
  const path = `/season_averages?season=2023&player_ids[]=${playerID}`;
  const response = await fetch(baseUrl + path, {
    headers: {
      Authorization: process.env.NBA_API_KEY,
    },
  });
  console.log(response)
  return response.json();
};

export { getAllPlayers, getSearchPlayers, getPlayerStats, getSinglePlayer };
