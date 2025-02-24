import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Pages/Dashboard"; // Correct path
import RegisterPage from "./components/Pages/RegisterPage"; // Correct path
import GroceryPage from "./components/Pages/GroceryPage/GroceryPage";
import QuietHoursSettings from "./components/Pages/QuietHoursSettings/QuietHoursSettings"; // Uncommented import
import BillsExpenses from "./components/Pages/BillsExpenses";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to RegisterPage */}
        <Route path="/" element={<RegisterPage />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;