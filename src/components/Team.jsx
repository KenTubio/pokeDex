// src/components/Team.jsx
import { useEffect, useState } from "react";
import { getTeam, removeFromTeam } from "../services/jsonServer";

const Team = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await getTeam();
      setTeam(res.data);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromTeam(id);
      setTeam((prevTeam) => prevTeam.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error removing Pokémon:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">My Team</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((p) => (
          <div
            key={p.id}
            className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border border-gray-600 rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <img
              src={p.sprite}
              alt={p.name}
              className="mx-auto animate-bounce w-40"
            />
            <h2 className="capitalize font-semibold text-lg text-center mt-2 text-white">
              {p.name}
            </h2>

            <div className="mt-2 text-sm text-center">
              {/* Optional: Display stats or type of Pokémon here */}
            </div>

            <button
              className="mt-3 px-3 py-1 rounded text-white w-full bg-red-500 hover:bg-red-600 transition-all duration-200"
              onClick={() => handleRemove(p.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
