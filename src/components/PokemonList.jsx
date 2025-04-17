import { useEffect, useState } from "react";
import { getPokemonList, getPokemonDetails } from "../services/pokeApi";
import { addToTeam, getTeam } from "../services/jsonServer";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [team, setTeam] = useState([]);
  const [addingPokemon, setAddingPokemon] = useState(null); // Track adding state

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

    setAddingPokemon(pokemon.name); // disable button for this one

    try {
      const res = await addToTeam({
        name: pokemon.name,
        sprite: pokemon.sprites.front_default,
        stats: pokemon.stats,
      });

      setTeam((prevTeam) => [...prevTeam, res.data]);
    } catch (error) {
      console.error("Failed to add Pokémon:", error);
      alert("Something went wrong!");
    } finally {
      setAddingPokemon(null); // re-enable
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon List</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemonList.map((pokemon) => {
          const alreadyInTeam = team.find((p) => p.name === pokemon.name);

          return (
            <div
              key={pokemon.id}
              className={`border rounded-xl p-4 shadow hover:shadow-lg ${
                alreadyInTeam ? "opacity-50" : ""
              }`}
            >
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <h2 className="capitalize font-semibold text-lg">{pokemon.name}</h2>

              <div className="mt-2 text-sm">
                <p>
                  <strong>HP:</strong> {pokemon.stats[0].base_stat}
                </p>
                <p>
                  <strong>Attack:</strong> {pokemon.stats[1].base_stat}
                </p>
                <p>
                  <strong>Defense:</strong> {pokemon.stats[2].base_stat}
                </p>
                <p>
                  <strong>Speed:</strong> {pokemon.stats[5].base_stat}
                </p>
              </div>

              <button
                className={`mt-2 px-3 py-1 rounded text-white w-full ${
                  addingPokemon === pokemon.name
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => handleAddToTeam(pokemon)}
                disabled={addingPokemon === pokemon.name || alreadyInTeam}
              >
                {alreadyInTeam
                  ? "In Team"
                  : addingPokemon === pokemon.name
                  ? "Adding..."
                  : "Add to Team"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonList;
