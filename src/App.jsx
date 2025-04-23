import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PokemonList from "./components/PokemonList";
import Team from "./components/Team";
import Battle from "./components/Battle";
import Header from "./sections/header";
import Sidebar from "./sections/sidebar";
import BackgroundMusic from "./components/Backgroundmusic";
import Instructions from "./components/Instructions";

const App = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    setHasStarted(true);
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(console.warn);
    }
  };

  return (
    <>
      {!hasStarted && (
        <div className="fixed inset-0 text-white z-50 flex items-center justify-center flex-col bg-[url('/images/Pokeball.gif')] bg-cover bg-center w-full h-screen">
          <button
            onClick={handleStart}
            className={`text-center flex flex-col items-center justify-center absolute bottom-10 text-white font-bold text-lg px-8 py-3 rounded-md 
            bg-gradient-to-b from-green-300 via-teal-400 to-teal-600 shadow-[0_0_10px_rgba(32,178,170,0.8)]
            border border-teal-300 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(32,178,170,1)] 
            transition-transform duration-300 ease-in-out
            before:absolute before:inset-0 before:rounded-md before:border-2 before:border-white/20 before:pointer-events-none `}
          >
            <img className="w-24 mb-2" src="/images/poke-logo.png" alt="" />
            Start Adventure
          </button>

        </div>
      )}

      <Router>
        <Header />
        <div className="flex">
          <BackgroundMusic ref={audioRef} />
          <Sidebar selectedType={selectedType} setSelectedType={setSelectedType} />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<PokemonList selectedType={selectedType} />} />
              <Route path="/team" element={<Team />} />
              <Route path="/battle" element={<Battle />} />
              <Route path="/instructions" element={<Instructions />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
};

export default App;
