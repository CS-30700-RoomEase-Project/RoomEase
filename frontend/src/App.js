// App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import MasterRoom from "./components/Pages/MasterRoom"; // Correct path
import RegisterPage from "./components/Pages/RegisterPage"; // Correct path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MasterRoom />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
