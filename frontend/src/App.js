// App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Dashboard from "./components/Pages/Dashboard"; // Correct path
import MasterRoom from "./components/Pages/MasterRoom"; // Correct path
import RegisterPage from "./components/Pages/RegisterPage"; // Correct path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MasterRoom />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
