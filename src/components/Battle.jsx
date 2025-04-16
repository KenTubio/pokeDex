import { useEffect, useState } from "react";
import { getTeam, saveBattle } from "../services/jsonServer";
import { simulateBattle } from "../utils/battleLogic";
import { getPokemonDetails } from "../services/pokeApi"; // Import the API function for details

const Battle = () => {
  const [team, setTeam] = useState([]);
  const [selected, setSelected] = useState([]);
  const [winner, setWinner] = useState(null);
  const [pokemonStats, setPokemonStats] = useState({}); // Store stats by Pokémon id

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    const res = await getTeam();
    setTeam(res.data);

    // Fetch stats for each Pokémon in the team
    res.data.forEach(async (pokemon) => {
      const details = await getPokemonDetails(pokemon.name);
      setPokemonStats((prevStats) => ({
        ...prevStats,
        [pokemon.id]: details.data.stats, // Save stats by Pokémon ID
      }));
    });
  };

  const toggleSelect = (pokemon) => {
    setSelected((prev) => {
      if (prev.find((p) => p.name === pokemon.name)) {
        return prev.filter((p) => p.name !== pokemon.name);
      } else if (prev.length < 2) {
        return [...prev, pokemon];
      }
      return prev;
    });
  };

  const handleBattle = () => {
    if (selected.length !== 2) {
      alert("Select 2 Pokémon to battle!");
      return;
    }
    const result = simulateBattle(selected[0], selected[1]);
    setWinner(result);
    saveBattle({
      timestamp: new Date().toISOString(),
      player1: selected[0].name,
      player2: selected[1].name,
      winner: result,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Battle</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((p) => (
          <div
            key={p.id}
            className={`border rounded-xl p-4 shadow cursor-pointer ${
              selected.find((s) => s.name === p.name) ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => toggleSelect(p)}
          >
            <img src={p.sprite} alt={p.name} />
            <h2 className="capitalize font-semibold text-lg">{p.name}</h2>

            {/* Display stats if available */}
            {pokemonStats[p.id] && (
              <div className="mt-2 text-sm">
                <p><strong>HP:</strong> {pokemonStats[p.id][0].base_stat}</p>
                <p><strong>Attack:</strong> {pokemonStats[p.id][1].base_stat}</p>
                <p><strong>Defense:</strong> {pokemonStats[p.id][2].base_stat}</p>
                <p><strong>Speed:</strong> {pokemonStats[p.id][5].base_stat}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleBattle}
        disabled={selected.length !== 2}
      >
        Simulate Battle
      </button>

      {winner && (
        <div className="mt-4 text-xl font-semibold">
          🏆 Winner: <span className="capitalize">{winner}</span>
        </div>
      )}
    </div>
  );
};

export default Battle;
