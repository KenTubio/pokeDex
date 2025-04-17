import axios from "axios";
const DB_URL = "https://poke-data.onrender.com";

// Fetch the team from the server
export const getTeam = () => axios.get(`${DB_URL}/team`);

// Add a Pokémon to the team
export const addToTeam = (pokemon) => axios.post(`${DB_URL}/team`, pokemon);

// Remove a Pokémon from the team
export const removeFromTeam = (id) => axios.delete(`${DB_URL}/team/${id}`);

// Fetch battles from the server
export const getBattles = () => axios.get(`${DB_URL}/battles`);

// Save a battle result to the server
export const saveBattle = (battle) => axios.post(`${DB_URL}/battles`, battle);

// Clear all battles from the server
export const clearBattles = async () => {
  const res = await getBattles();
  const deleteRequests = res.data.map((battle) =>
    axios.delete(`${DB_URL}/battles/${battle.id}`)
  );
  return Promise.all(deleteRequests);
};
