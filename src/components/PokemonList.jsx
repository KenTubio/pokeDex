import { useEffect, useState, useCallback } from "react";
import { getPokemonList, getPokemonDetails } from "../services/pokeApi";
import { addToTeam, getTeam } from "../services/jsonServer";
import { IoIosRefresh } from "react-icons/io";
import axios from "axios";
import debounce from "lodash/debounce";

const LIMIT = 150;

const PokemonList = ({ selectedType }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [team, setTeam] = useState([]);
  const [addingPokemon, setAddingPokemon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  // Reset on filter change
  useEffect(() => {
    setPokemonList([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
    fetchPokemon(true);
  }, [selectedType, searchTerm]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const fetchPokemon = async (isNewQuery = false) => {
    if ((loadingMore || !hasMore) && !isNewQuery) return;
    if (!isNewQuery) setLoadingMore(true);

    try {
      const response = await getPokemonList(LIMIT, isNewQuery ? 0 : offset);
      const details = await Promise.all(
        response.data.results.map(async (p) => {
          const pokemonRes = await getPokemonDetails(p.name);
          const speciesRes = await axios.get(pokemonRes.data.species.url);
          return {
            ...pokemonRes.data,
            gen: speciesRes.data.generation.name
              .replace("generation-", "Gen ")
              .toUpperCase(),
            growth_rate: speciesRes.data.growth_rate.name.replace("-", " "),
          };
        })
      );

      setPokemonList((prev) =>
        isNewQuery ? details : [...prev, ...details]
      );
      setOffset((prevOffset) =>
        isNewQuery ? LIMIT : prevOffset + LIMIT
      );

      if (!response.data.next || details.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load Pokémon:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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

    setAddingPokemon(true);
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
      setAddingPokemon(false);
    }
  };

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
        <button
          onClick={() => {
            setSearchTerm("");
            setOffset(0);
            setHasMore(true);
            setPokemonList([]);
            fetchPokemon(true);
          }}
          className="px-4 py-2 bg-slate-600 text-2xl text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          <IoIosRefresh />
        </button>
      </div>

      <div className="p-4 mb-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading && pokemonList.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filteredList.length === 0 ? (
              <div className="text-center text-gray-400 text-lg mt-10">
                No Pokémon found.
              </div>
            ) : (
              <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
                {filteredList.map((pokemon) => {
                  const alreadyInTeam = team.find(
                    (p) => p.name === pokemon.name
                  );
                  return (
                    <div
                      key={pokemon.id}
                      onClick={() => setSelectedPokemon(pokemon)}
                      className="cursor-pointer relative bg-gradient-to-b from-orange-500 to-red-600 rounded-3xl p-4 shadow-lg hover:scale-105 transition-all duration-300 text-white flex flex-col items-center justify-between"
                    >
                      <div className="absolute top-2 left-4 text-white text-xl font-bold drop-shadow-md">
                        {pokemon.base_experience * 10} CP
                      </div>
                      <img
                        src={
                          pokemon.sprites.other["official-artwork"]
                            .front_default
                        }
                        alt={pokemon.name}
                        className="w-32 h-32 object-contain z-10 drop-shadow-md"
                      />
                      <h2 className="capitalize text-2xl font-bold mt-4">
                        {pokemon.name}
                      </h2>
                      <div className="flex gap-2 mt-2">
                        {pokemon.types.map((t) => (
                          <span
                            key={t.slot}
                            className="bg-white text-black px-3 py-0.5 rounded-full text-xs font-semibold"
                          >
                            {t.type.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm w-full mt-4 px-2">
                        <div className="text-center">
                          <p className="font-bold">
                            {(pokemon.weight / 10).toFixed(1)} KG
                          </p>
                          <p className="opacity-70">Weight</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">
                            {(pokemon.height / 10).toFixed(2)} M
                          </p>
                          <p className="opacity-70">Height</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm w-full mt-4 px-2">
                        <div className="text-center">
                          <p className="font-bold">{pokemon.gen}</p>
                          <p className="opacity-70 text-xs">Generation</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold capitalize">
                            {pokemon.growth_rate}
                          </p>
                          <p className="opacity-70 text-xs">Growth Rate</p>
                        </div>
                      </div>
                      <button
                        className={`mt-4 w-full text-sm font-semibold py-2 rounded-xl ${
                          addingPokemon || alreadyInTeam
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-400 hover:bg-green-500"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToTeam(pokemon);
                        }}
                        disabled={addingPokemon || alreadyInTeam}
                      >
                        {alreadyInTeam
                          ? "In Team"
                          : addingPokemon
                          ? "Adding..."
                          : `Add to Team`}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => fetchPokemon()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold"
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading more..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPokemon && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
          onClick={() => setSelectedPokemon(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg text-white p-6 rounded-xl w-full max-w-lg relative transition-all duration-300 hover:scale-[1.02] ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPokemon(null)}
              className="absolute top-3 right-4 text-2xl text-white/60 hover:text-white/90 transition duration-200"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold capitalize mb-4 text-center tracking-wide">
              {selectedPokemon.name}
            </h2>
            <img
              src={
                selectedPokemon.sprites.other["official-artwork"].front_default
              }
              alt={selectedPokemon.name}
              className="w-32 h-32 mx-auto mb-6 drop-shadow-xl"
            />
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 underline text-center">
                  Stats
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-white/90">
                  {selectedPokemon.stats.map((s, i) => (
                    <li key={i}>
                      {s.stat.name}: {s.base_stat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 underline text-center">
                  Top Moves
                </h3>
                <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto text-sm text-white/90 pr-2">
                  {selectedPokemon.moves.slice(0, 10).map((m, i) => (
                    <li key={i}>{m.move.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
