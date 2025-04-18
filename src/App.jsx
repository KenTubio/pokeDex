import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import PokemonList from "./components/PokemonList";
import Team from "./components/Team";
import Battle from "./components/Battle";
import Header from "./sections/header";
import Sidebar from "./sections/sidebar"; // or ./sections/Sidebar
import BackgroundMusic from "./components/Backgroundmusic";

const App = () => {
  const [selectedType, setSelectedType] = useState("all");

  return (
    <Router>
      <BackgroundMusic />
      <Header />
      <div className="flex">
        <Sidebar selectedType={selectedType} setSelectedType={setSelectedType} />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<PokemonList selectedType={selectedType} />} />
            <Route path="/team" element={<Team />} />
            <Route path="/battle" element={<Battle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
