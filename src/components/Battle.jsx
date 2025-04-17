import { useEffect, useState } from "react";
import {
  getTeam,
  getBattles,
  saveBattle,
  clearBattles,
} from "../services/jsonServer";
import { simulateBattle } from "../utils/battleLogic";
import { getPokemonDetails } from "../services/pokeApi";

const Battle = () => {
  const [team, setTeam] = useState([]);
  const [selected, setSelected] = useState([]);
  const [winner, setWinner] = useState(null);
  const [pokemonStats, setPokemonStats] = useState({});
  const [battleHistory, setBattleHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    const res = await getTeam();
    setTeam(res.data);

    res.data.forEach(async (pokemon) => {
      const details = await getPokemonDetails(pokemon.name);
      setPokemonStats((prevStats) => ({
        ...prevStats,
        [pokemon.id]: details.data.stats,
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

  const handleShowHistory = async () => {
    const res = await getBattles();
    setBattleHistory(res.data);
    setShowHistory(true);
  };

  const handleClearHistory = async () => {
    await clearBattles();
    setBattleHistory([]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Battle</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((p) => (
          <div
            key={p.id}
            className={`border rounded-xl p-4 shadow cursor-pointer ${
              selected.find((s) => s.name === p.name)
                ? "ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => toggleSelect(p)}
          >
            <img src={p.sprite} alt={p.name} />
            <h2 className="capitalize font-semibold text-lg">{p.name}</h2>

            {pokemonStats[p.id] && (
              <div className="mt-2 text-sm">
                <p>
                  <strong>HP:</strong> {pokemonStats[p.id][0].base_stat}
                </p>
                <p>
                  <strong>Attack:</strong> {pokemonStats[p.id][1].base_stat}
                </p>
                <p>
                  <strong>Defense:</strong> {pokemonStats[p.id][2].base_stat}
                </p>
                <p>
                  <strong>Speed:</strong> {pokemonStats[p.id][5].base_stat}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleBattle}
          disabled={selected.length !== 2}
        >
          Simulate Battle
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleShowHistory}
        >
          Show Battle History
        </button>
      </div>

      {winner && (
        <div className="mt-4 text-xl font-semibold">
          🏆 Winner: <span className="capitalize">{winner}</span>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Battle History</h2>
              <div className="space-x-2">
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={handleClearHistory}
                >
                  Clear History
                </button>
                <button
                  className="text-xl font-bold"
                  onClick={() => setShowHistory(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {battleHistory.length === 0 ? (
                <p className="text-sm text-gray-600">No battles found.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {[...battleHistory]
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp) - new Date(a.timestamp)
                    )
                    .map((battle, index) => (
                      <li key={index} className="border-b pb-1">
                        <p>
                          <strong>{battle.player1}</strong> vs{" "}
                          <strong>{battle.player2}</strong>
                        </p>
                        <p>
                          🏆 Winner:{" "}
                          <span className="capitalize">{battle.winner}</span>
                        </p>
                        <p className="text-gray-500">
                          {new Date(battle.timestamp).toLocaleString()}
                        </p>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;
