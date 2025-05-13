import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BillsExpenses from "./components/Pages/BillsExpenses";
import Chores from "./components/Pages/Chores";
import Dashboard from "./components/Pages/Dashboard"; // Correct path
import Disputes from "./components/Pages/Disputes/Disputes";
import GroceryPage from "./components/Pages/GroceryPage/GroceryPage";
import HouseRules from "./components/Pages/HouseRules/HouseRules"; // Import HouseRules component
import InvitePage from "./components/Pages/InvitePage/InvitePage"; // Import InvitePage component
import MasterRoomState from "./components/Pages/MasterRoom/MasterPages/RoomState/MasterRoomState"; // Import MasterRoomState component
import MasterRoom from "./components/Pages/MasterRoom/MasterRoom"; // Import MasterRoom components
import Memories from "./components/Pages/Memories/Memories"; // Import Memories component
import Notifications from "./components/Pages/Notifications/Notifications"; //import notifications
import QuietHoursSettings from "./components/Pages/QuietHours/QuietHours"; // Uncommented import
import RegisterPage from "./components/Pages/RegisterPage"; // Correct path
import Room from "./components/Pages/Room/Room";
import RoomState from "./components/Pages/RoomState/RoomState"; // Import RoomState component
import SubmitDispute from "./components/Pages/SubmitDispute/SubmitDispute";
import NotesPopup from "./components/Shared_components/BulletinPopup/NotesPopup";


function App() {
  return (
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
  );
}

export default App;