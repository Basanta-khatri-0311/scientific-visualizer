import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SolarSystem from "./pages/SolarSystem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solar-system" element={<SolarSystem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
