import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Pages/Dashboard"; // Correct path
import RegisterPage from "./components/Pages/RegisterPage"; // Correct path
import Chores from "./components/Pages/Chores";
import GroceryPage from "./components/Pages/GroceryPage/GroceryPage";
import QuietHoursSettings from "./components/Pages/QuietHoursSettings/QuietHoursSettings"; // Uncommented import

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to RegisterPage */}
        <Route path="/" element={<RegisterPage />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/*chores page route */}
        <Route path="/chores" element={<Chores />} />

        {/* Grocery page route */}
        <Route path="/grocery" element={<GroceryPage />} />

        {/* Quiet Hours Settings route */}
        <Route path="/quiet-hours" element={<QuietHoursSettings />} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;