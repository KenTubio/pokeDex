import axios from "axios";
const BASE_URL = "https://pokeapi.co/api/v2";

export const getPokemonList = (limit = 20, offset = 0) =>
  axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

export const getPokemonDetails = (name) =>
  axios.get(`${BASE_URL}/pokemon/${name}`);
