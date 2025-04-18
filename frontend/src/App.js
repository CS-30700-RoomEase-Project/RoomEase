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
import Disputes from "./components/Pages/Disputes/Disputes";
import MasterRoom from "./components/Pages/MasterRoom/MasterRoom"; // Import MasterRoom components
import MasterRoomState from "./components/Pages/MasterRoom/MasterPages/RoomState/MasterRoomState"; // Import MasterRoomState component
import NotesPopup from "./components/Shared_components/BulletinPopup/NotesPopup";
import Clauses from "./components/Pages/RoomClauses/RoomClauses";

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
        <Route path="/quiet-hours/:roomId" element={<QuietHoursSettings />} />
        
        {/* Clauses Route */}
        <Route path="/clauses/:roomId" element={<Clauses />} />

        {/* Disputes route */}
        <Route path="/disputes/:roomId" element={<Disputes />} />

        {/* Room page route */}
        <Route path="/room/:roomId" element={<Room />}/>

        {/* Room State route */}
        <Route path="/room-state/:roomId" element={<RoomState />} />

        {/* Invite page route */}
        <Route path="/room/:roomId/invite" element={<InvitePage />} />

        {/* Room notes page route */}
        <Route path="/notes" element={<NotesPopup />} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* Bills/Expenses Settings route */}
        <Route path="/room/:roomId/bills" element={<BillsExpenses/>} />

        {/* Notifications route */}
        <Route path="/notifications" element={<Notifications/>} />

        {/* Master Room route */}
        <Route path="/room/master-room" element={<MasterRoom />} />

        {/* Master Room State route */}
        <Route path="/master-room/room-state" element={<MasterRoomState />} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;