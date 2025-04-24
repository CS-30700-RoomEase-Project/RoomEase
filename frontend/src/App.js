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
import SubmitDispute from "./components/Pages/SubmitDispute/SubmitDispute";
import MasterRoom from "./components/Pages/MasterRoom/MasterRoom"; // Import MasterRoom components
import MasterRoomState from "./components/Pages/MasterRoom/MasterPages/RoomState/MasterRoomState"; // Import MasterRoomState component
import NotesPopup from "./components/Shared_components/BulletinPopup/NotesPopup";
import HouseRules from "./components/Pages/HouseRules/HouseRules"; // Import HouseRules component
import Memories from "./components/Pages/Memories/Memories"; // Import Memories component


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
        
        {/* House Rules Route */}
        <Route path="/house-rules/:roomId" element={<HouseRules />} />

        {/* Disputes route */}
        <Route path="/disputes/:roomId" element={<Disputes />} />

        {/* Submit Disputes route */}
        <Route path="/submit-dispute/:roomId" element={<SubmitDispute />}/>

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

        {/* Memories route */}
        <Route path="/room/:roomId/memories" element={<Memories />} />

        {/* Redirect from any other route to the home page (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;