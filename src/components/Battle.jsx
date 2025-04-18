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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiPokemon, setAiPokemon] = useState(null);
  const [pokemonStats, setPokemonStats] = useState({});
  const [battleLog, setBattleLog] = useState([]);
  const [score, setScore] = useState({ you: 0, ai: 0 });
  const [battleHistory, setBattleHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const initialize = async () => {
      await fetchTeam();
      await generateAIPokemon();
      await fetchBattleHistory();
    };
    initialize();
  }, []);

  const fetchTeam = async () => {
    const res = await getTeam();
    if (res.data.length < 6) {
      alert("You must have 6 Pokémon in your team to battle!");
      return;
    }
    setTeam(res.data);

    for (const pokemon of res.data) {
      const details = await getPokemonDetails(pokemon.name);
      setPokemonStats((prev) => ({
        ...prev,
        [pokemon.id]: {
          stats: details.data.stats,
          sprite: details.data.sprites.front_default,
        },
      }));
    }
  };

  const generateAIPokemon = async () => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const res = await getPokemonDetails(randomId);
    setAiPokemon({
      id: res.data.id,
      name: res.data.name,
      sprite: res.data.sprites.front_default,
      stats: res.data.stats,
    });
  };

  const fetchBattleHistory = async () => {
    const res = await getBattles();
    setBattleHistory(res.data);
  };

  const endBattle = async (winnerName) => {
    setBattleEnded(true);
    setWinner(winnerName);

    const finalBattles = battleLog.map((log) => ({
      timestamp: new Date().toISOString(),
      player1: log.user,
      player2: log.ai,
      winner: log.result,
    }));

    for (const battle of finalBattles) {
      await saveBattle(battle);
    }

    setBattleHistory((prev) => [...finalBattles, ...prev]);
  };

  const handleBattle = async () => {
    if (!aiPokemon || battleEnded || currentIndex >= team.length) return;

    const userPokemon = team[currentIndex];
    const ai = aiPokemon;

    const result = simulateBattle(userPokemon, ai);

    const userData = pokemonStats[userPokemon.id];
    const userStats = userData?.stats;
    const aiStats = ai.stats;

    const explanation = `
      ${userPokemon.name} (HP: ${userStats[0].base_stat}, ATK: ${userStats[1].base_stat}, DEF: ${userStats[2].base_stat}) 
      vs 
      ${ai.name} (HP: ${aiStats[0].base_stat}, ATK: ${aiStats[1].base_stat}, DEF: ${aiStats[2].base_stat}) — 
      Winner: ${result}
    `;

    const logEntry = {
      user: userPokemon.name,
      ai: ai.name,
      result: result,
      explanation,
    };

    const updatedLog = [...battleLog, logEntry];
    setBattleLog(updatedLog);

    let newScore = { ...score };

    if (result === userPokemon.name) {
      newScore.you += 1;
    } else if (result === ai.name) {
      newScore.ai += 1;
      setCurrentIndex((prev) => prev + 1);
    }

    setScore(newScore);

    if (newScore.you >= 6) {
      await endBattle("You");
      return;
    }

    if (newScore.ai >= 6 || currentIndex + 1 >= team.length) {
      await endBattle("AI");
      return;
    }

    await generateAIPokemon();
  };

  const handleClearHistory = async () => {
    await clearBattles();
    setBattleHistory([]);
  };

  const handleResetBattle = async () => {
    setCurrentIndex(0);
    setBattleLog([]);
    setScore({ you: 0, ai: 0 });
    setBattleEnded(false);
    setWinner("");
    await fetchTeam();
    await generateAIPokemon();
  };

  const renderStats = (stats) => (
    <>
      <p><strong>Hp:</strong> {stats[0].base_stat}</p>
      <p><strong>Attack:</strong> {stats[1].base_stat}</p>
      <p><strong>Defense:</strong> {stats[2].base_stat}</p>
      <p><strong>Special:</strong> {stats[3].base_stat}</p>
    </>
  );

  return (
    <div id="battle" className="bg-[#0f0f0f] min-h-screen text-white p-6">
  {/* Your Team Section */}
  <div className="mb-6">
    <h2 className="text-2xl font-bold mb-4">Your Team</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {team.map((p, i) => (
        <div
          key={p.id}
          className={`bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border border-gray-600 rounded-xl p-4 shadow-md transition-all duration-300 ${
            i === currentIndex ? "ring-2 ring-green-400" : ""
          }`}
        >
          <img
            src={p.sprite}
            alt={p.name}
            className="mx-auto w-20 h-20 animate-bounce"
          />
          <h3 className="capitalize text-center font-semibold mt-2">{p.name}</h3>
        </div>
      ))}
    </div>
    <p className="text-right text-sm text-gray-400 mt-2">
      Remaining Pokémon: {battleEnded && winner === "AI" ? 0 : team.length - currentIndex}/{team.length}
    </p>
  </div>

  {/* Battle Arena Section */}
  <div className="grid grid-cols-2 gap-6 items-center max-md:grid-cols-1">
    {/* Battle Arena */}
    <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-6 rounded-xl shadow-xl">
      <h1 className="text-xl font-bold text-center mb-4">Battle Arena</h1>
      <div className="flex justify-around items-center space-x-6">

        {/* Player Pokémon (User) */}
        <div className="bg-gray-900 h-52 rounded-xl flex items-center justify-center border border-gray-700 w-40">
          {team[currentIndex] && pokemonStats[team[currentIndex].id] ? (
            <div className="text-center">
              <img
                src={pokemonStats[team[currentIndex].id].sprite}
                alt={team[currentIndex].name}
                className="h-24 mx-auto"
              />
              <div className="capitalize font-medium mt-2 text-lg">
                {team[currentIndex].name}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading your Pokémon...</p>
          )}
        </div>

        {/* AI Pokémon */}
        <div className="bg-gray-900 h-52 rounded-xl flex items-center justify-center border border-gray-700 w-40">
          {aiPokemon ? (
            <div className="text-center">
              <img
                src={aiPokemon.sprite}
                alt={aiPokemon.name}
                className="h-24 mx-auto"
              />
              <div className="capitalize font-medium mt-2 text-lg">
                {aiPokemon.name}
              </div>
              <div className="capitalize font-medium text-red-600">
                ( Enemy )
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading opponent...</p>
          )}
        </div>

      </div>

      {/* Battle Controls */}
      <div className="text-center mt-4">
        {battleEnded ? (
          <button
            onClick={handleResetBattle}
            className="bg-gray-700 px-6 py-2 rounded text-white hover:bg-gray-600"
          >
            Reset Battle
          </button>
        ) : (
          <button
            onClick={handleBattle}
            className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
            disabled={currentIndex >= team.length}
          >
            Start!
          </button>
        )}
        <p className="mt-2 text-sm text-gray-400">
          You: {score.you} | Enemy: {score.ai}
        </p>
        {battleEnded && (
          <div className="text-red-500 font-semibold mt-2">
            Battle Ended — Winner: {winner}
          </div>
        )}
      </div>
    </div>

    {/* Battle Log */}
    <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-6 rounded-xl shadow-xl h-full">
      <h3 className="font-bold mb-2 text-lg">Battle Log</h3>
      <div className="bg-gray-900 rounded-lg p-3 shadow-inner max-h-60 overflow-y-auto text-sm border border-gray-700">
        {battleLog.map((log, i) => (
          <div key={i} className="mb-2">
            {log.user} vs {log.ai} —{" "}
            <strong className="text-green-400">{log.result}</strong>
            <p className="text-xs text-gray-400">{log.explanation}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-lg">Battle History</h4>
          <div className="space-x-2">
            <button
              className="text-sm text-red-400 hover:underline"
              onClick={handleClearHistory}
            >
              Clear
            </button>
            <button
              className="text-sm text-blue-400 hover:underline"
              onClick={() => setShowHistory((prev) => !prev)}
            >
              {showHistory ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {showHistory && (
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 shadow-inner max-h-60 overflow-y-auto text-sm">
            {battleHistory.length === 0 ? (
              <p className="text-gray-500">No previous battles.</p>
            ) : (
              <ul className="space-y-2">
                {battleHistory.map((b, i) => (
                  <li key={i}>
                    {b.player1} vs {b.player2} —{" "}
                    <strong className="text-white">{b.winner}</strong>
                    <br />
                    <span className="text-gray-500 text-xs">
                      {new Date(b.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
</div>


  );
};

export default Battle;
