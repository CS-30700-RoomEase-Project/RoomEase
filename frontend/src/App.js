import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Pages/Dashboard"; // Correct path
import RegisterPage from "./components/Pages/RegisterPage"; // Correct path
import Chores from "./components/Pages/Chores";
import GroceryPage from "./components/Pages/GroceryPage/GroceryPage";
import QuietHoursSettings from "./components/Pages/QuietHours/QuietHours"; // Uncommented import
import Room from "./components/Pages/Room/Room";
import BillsExpenses from "./components/Pages/BillsExpenses";
import RoomState from "./components/Pages/RoomState/RoomState"; // Import RoomState component
import Notifications from "./components/Pages/Notifications/Notifications"; //import notifications
import InvitePage from "./components/Pages/InvitePage/InvitePage"; // Import InvitePage component
import RoomSettings from "./components/Pages/RoomSettings/RoomSettings"; // Import InvitePage component
import Disputes from "./components/Pages/Disputes/Disputes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to RegisterPage */}
        <Route path="/" element={<RegisterPage />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/*chores page route */}
        <Route path="/chores/:roomId" element={<Chores />} />

        {/* Grocery page route */}
        <Route path="/grocery" element={<GroceryPage />} />

        {/* Quiet Hours Settings route */}
        <Route path="/quiet-hours" element={<QuietHoursSettings />} />
        
        {/* Disputes route */}
        <Route path="/disputes" element={<Disputes />} />

        {/* Room page route */}
        <Route path="/room/:roomId" element={<Room />}/>

        {/* Room State route */}
        <Route path="/room-state" element={<RoomState />} />

        {/* Invite page route */}
        <Route path="/room/:roomId/invite" element={<InvitePage />} />

        {/* Room Settings page route */}
        <Route path="/room/:roomId/settings" element={<RoomSettings />} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* Bills/Expenses Settings route */}
        <Route path="/room/:roomId/bills" element={<BillsExpenses/>} />

        {/* Notifications route */}
        <Route path="/notifications" element={<Notifications/>} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;