import { useEffect, useState } from "react";
import { getPokemonList, getPokemonDetails } from "../services/pokeApi";
import { addToTeam, getTeam } from "../services/jsonServer";
import { IoIosRefresh } from "react-icons/io";



const PokemonList = ({ selectedType }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [team, setTeam] = useState([]);
  const [addingPokemon, setAddingPokemon] = useState(false); // Track if any Pokémon is being added
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Add search term state

  useEffect(() => {
    fetchPokemon();
    fetchTeam();
  }, []);

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const batchSize = 200;  // Define the batch size (can be adjusted)
      const totalPokemons = 1000; // Total number of Pokémon to fetch
      const batches = Math.ceil(totalPokemons / batchSize); // Number of batches needed

      const allPokemons = [];

      // Fetch Pokémon in parallel in batches
      const requests = [];
      for (let i = 0; i < batches; i++) {
        const offset = i * batchSize;
        requests.push(getPokemonList(batchSize, offset)); // Request each batch
      }

      // Wait for all batch requests to complete in parallel
      const responses = await Promise.all(requests);

      // Process each batch of Pokémon data
      for (const response of responses) {
        const details = await Promise.all(
          response.data.results.map((p) => getPokemonDetails(p.name))
        );
        allPokemons.push(...details.map((res) => res.data)); // Add each batch to the total list
      }

      setPokemonList(allPokemons); // Set the final Pokémon list
    } catch (err) {
      console.error("Failed to load Pokémon:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    const res = await getTeam();
    setTeam(res.data);
  };

  const handleAddToTeam = async (pokemon) => {
    if (team.length >= 6) return alert("Team is full (max 6 Pokémon)");

    const alreadyInTeam = team.find((p) => p.name === pokemon.name);
    if (alreadyInTeam) return alert("This Pokémon is already in your team!");

    setAddingPokemon(true); // Set the state to indicate a Pokémon is being added

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
      setAddingPokemon(false); // Reset the state after the Pokémon is added
    }
  };

  // 🔍 Combine search and type filtering
  const filteredList = pokemonList
    .filter((p) =>
      selectedType === "all"
        ? true
        : p.types.some((t) => t.type.name === selectedType)
    )
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-screen overflow-hidden bg-[#0f0f0f] text-white flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-2xl font-bold mb-2 capitalize">Pokémon List</h1>
        {/* Refresh Button */}
        <button
          onClick={fetchPokemon} // Trigger refresh when clicked
          className="px-4 py-2 bg-slate-600 text-2xl text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          <IoIosRefresh />
        </button>
      </div>

      {/* 🔍 Search Box */}
      <div className="p-4 mb-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center text-gray-400 text-lg mt-10">
            No Pokémon found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredList.map((pokemon) => {
              const alreadyInTeam = team.find((p) => p.name === pokemon.name);

              return (
                <div
                  key={pokemon.id}
                  className={`bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border border-gray-600 rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    alreadyInTeam ? "opacity-50" : ""
                  }`}
                >
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="mx-auto animate-bounce w-40"
                  />
                  <h2 className="capitalize font-semibold text-lg text-center mt-2">
                    {pokemon.name}
                  </h2>

                  <div className="mt-2 text-sm text-center">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.slot}
                        className="bg-gray-600 px-2 py-0.5 rounded-full text-xs mx-1"
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>

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
                    className={`mt-3 px-3 py-1 rounded text-white w-full font-semibold transition duration-300 ease-in-out
                      ${
                        addingPokemon || alreadyInTeam
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-b from-green-300 via-teal-400 to-teal-600 hover:brightness-110 shadow-md"
                      }`}
                    onClick={() => handleAddToTeam(pokemon)}
                    disabled={addingPokemon || alreadyInTeam}
                  >
                    {alreadyInTeam
                      ? "In Team"
                      : addingPokemon
                      ? "Adding..."
                      : "Add to Team"}
                  </button>

                </div>


              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonList;
