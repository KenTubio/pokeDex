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
      <h1 className="text-2xl font-bold mb-4">My Team</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((p) => (
          <div key={p.id} className="border rounded-xl p-4 shadow">
            <img src={p.sprite} alt={p.name} />
            <h2 className="capitalize font-semibold text-lg">{p.name}</h2>
            <button
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
