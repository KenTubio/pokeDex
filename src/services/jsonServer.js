import axios from "axios";
const DB_URL = "http://localhost:3001";

export const getTeam = () => axios.get(`${DB_URL}/team`);
export const addToTeam = (pokemon) => axios.post(`${DB_URL}/team`, pokemon);
export const removeFromTeam = (id) => axios.delete(`${DB_URL}/team/${id}`);

export const getBattles = () => axios.get(`${DB_URL}/battles`);
export const saveBattle = (battle) => axios.post(`${DB_URL}/battles`, battle);
