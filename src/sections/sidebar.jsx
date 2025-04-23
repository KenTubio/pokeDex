import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { GrHomeRounded } from "react-icons/gr";
import { CgPokemon } from "react-icons/cg";

const Sidebar = ({ selectedType, setSelectedType }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const types = [
    "all", "fire", "dark","steel","ice", "dragon", "water", "grass", "electric", "bug", "poison",
    "normal", "ground", "flying", "fairy", "fighting", "psychic", "rock", "ghost"
  ];

  return (
    <>
     
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-[#1444f3] p-2 rounded text-white"
        >
          <Menu />
        </button>
      )}

    
      <aside
        className={`fixed top-0 left-0 max-sm:h-screen max-sm:overflow-y-auto w-64 bg-[#0f0f0f] text-white p-4 border-r border-gray-700 z-40 transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0 z-50" : "-translate-x-full"} 
        md:static md:translate-x-0`}
      >
       
        <div className="absolute right-3 md:hidden mb-4">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <X />
          </button>
        </div>

       
        <nav className="mb-6 space-y-2 mt-7">
          <span className="flex items-center gap-2 text-xl mb-4">
            <GrHomeRounded /> 
            <h1 className=" font-bold"> Dashboard</h1>
          </span>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded ${
              location.pathname === "/" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Pokemons
          </Link>
          <Link
            to="/team"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded ${
              location.pathname === "/team" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            My Team
          </Link>

         
          <Link
            to="/instructions"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded ${
              location.pathname === "/instructions" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Instructions
          </Link>
        </nav>

      
        <span className="flex items-center gap-2 text-xl mb-4 mt-10">
          <CgPokemon />
          <h1 className=" font-bold"> Types</h1>
        </span>
        <ul className="space-y-1">
          {types.map((type) => (
            <li
              key={type}
              onClick={() => {
                setSelectedType(type);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-3 py-1 rounded capitalize ${
                selectedType === type
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {type}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
