import { useEffect, useState } from "react";
import { getPokemonList, getPokemonDetails } from "../services/pokeapi";
import { addToTeam, getTeam } from "../services/jsonServer";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetchPokemon();
    fetchTeam();
  }, []);

  const fetchPokemon = async () => {
    const response = await getPokemonList(20, 0);
    const details = await Promise.all(
      response.data.results.map((p) => getPokemonDetails(p.name))
    );
    setPokemonList(details.map((res) => res.data));
  };

  const fetchTeam = async () => {
    const res = await getTeam();
    setTeam(res.data);
  };

  const handleAddToTeam = async (pokemon) => {
    if (team.length >= 6) {
      alert("Team is full (max 6 Pokémon)");
      return;
    }
    const alreadyInTeam = team.find((p) => p.name === pokemon.name);
    if (alreadyInTeam) {
      alert("This Pokémon is already in your team!");
      return;
    }
    await addToTeam({
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      stats: pokemon.stats,
    });
    fetchTeam();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon List</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg"
          >
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h2 className="capitalize font-semibold text-lg">{pokemon.name}</h2>

            {/* Display stats */}
            <div className="mt-2 text-sm">
              <p><strong>HP:</strong> {pokemon.stats[0].base_stat}</p>
              <p><strong>Attack:</strong> {pokemon.stats[1].base_stat}</p>
              <p><strong>Defense:</strong> {pokemon.stats[2].base_stat}</p>
              <p><strong>Speed:</strong> {pokemon.stats[5].base_stat}</p>
            </div>

            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleAddToTeam(pokemon)}
            >
              Add to Team
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
