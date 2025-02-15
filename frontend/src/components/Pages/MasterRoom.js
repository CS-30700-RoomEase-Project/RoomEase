// components/MasterRoom.js
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import BoxButton from "../Shared_components/Box_button"; // Import BoxButton component

function MasterRoom() {
  const navigate = useNavigate();

  const sendMessage = () => {
    axios.post("http://localhost:5001/log-message", { message: "Hello from frontend" })
      .then(response => console.log("Message sent:", response.data))
      .catch(error => console.error("Error sending message:", error));
  };

  const handleRedirect = () => {
    navigate("/register"); // Navigate to the Register page
  };

  return (
    <div className="app-container flex items-center justify-center min-h-screen">
      <div className="flex space-x-4">
        <BoxButton width={90} height={80} onClick={handleRedirect} numComponents={3} message={"Sign Up Page"}/>
        <BoxButton width={90} height={80} onClick={sendMessage} numComponents={3}  message={"Message to Backend"}/>
        <BoxButton width={90} height={80} onClick={sendMessage} numComponents={3} message={"Message to Backend"}/>
      </div>
    </div>
  );
}

export default MasterRoom;
