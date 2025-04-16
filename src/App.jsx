import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PokemonList from "./components/PokemonList";
import Team from "./components/Team";
import Battle from "./components/Battle";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 mb-6 text-blue-600 font-semibold">
          <Link to="/">Home</Link>
          <Link to="/team">My Team</Link>
          <Link to="/battle">Battle</Link>
        </nav>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/team" element={<Team />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
