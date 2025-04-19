import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import PokemonList from "./components/PokemonList";
import Team from "./components/Team";
import Battle from "./components/Battle";
import Header from "./sections/header";
import Sidebar from "./sections/sidebar";
import BackgroundMusic from "./components/Backgroundmusic";
import Instructions from "./components/Instructions"; // Import Instructions

const App = () => {
  const [selectedType, setSelectedType] = useState("all");

  return (
    <Router>
      <Header />
      <div className="flex">
        <BackgroundMusic />
        <Sidebar selectedType={selectedType} setSelectedType={setSelectedType} />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<PokemonList selectedType={selectedType} />} />
            <Route path="/team" element={<Team />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/instructions" element={<Instructions />} /> {/* Add Instructions route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
