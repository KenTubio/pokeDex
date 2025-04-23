import axios from "axios";
const DB_URL = "https://poke-data.onrender.com";


export const getTeam = () => axios.get(`${DB_URL}/team`);
export const addToTeam = (pokemon) => axios.post(`${DB_URL}/team`, pokemon);
export const removeFromTeam = (id) => axios.delete(`${DB_URL}/team/${id}`);
export const getBattles = () => axios.get(`${DB_URL}/battles`);
export const saveBattle = (battle) => axios.post(`${DB_URL}/battles`, battle);


export const clearBattles = async () => {
  const res = await getBattles();
  const deleteRequests = res.data.map((battle) =>
    axios.delete(`${DB_URL}/battles/${battle.id}`)
  );
  return Promise.all(deleteRequests);
};
