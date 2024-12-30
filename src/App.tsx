import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import BusinessDetail from "./components/directory/BusinessDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/business/:id" element={<BusinessDetail />} />
    </Routes>
  );
}

export default App;
