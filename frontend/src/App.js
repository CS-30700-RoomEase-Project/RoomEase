import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Pages/Dashboard/Dashboard"; // Correct path
import RegisterPage from "./components/Pages/RegisterPage/RegisterPage"; // Correct path
import Chores from "./components/Pages/Chores/Chores";
import GroceryPage from "./components/Pages/GroceryPage/GroceryPage";
import QuietHoursSettings from "./components/Pages/QuietHours/QuietHoursSettings"; // Uncommented import
import BillsExpenses from "./components/Pages/BillsExpenses/BillsExpenses";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to RegisterPage */}
        <Route path="/" element={<RegisterPage />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chores" element={<Chores />} />

        {/* Grocery page route */}
        <Route path="/grocery" element={<GroceryPage />} />

        {/* Quiet Hours Settings route */}
        <Route path="/quiet-hours" element={<QuietHoursSettings />} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* Grocery page route */}
        <Route path="/grocery" element={<GroceryPage />} />

        {/* Quiet Hours Settings route */}
        <Route path="/quiet-hours" element={<QuietHoursSettings />} />

        {/* Bills/Expenses Settings route */}
        <Route path="/bills" element={<BillsExpenses/>} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;