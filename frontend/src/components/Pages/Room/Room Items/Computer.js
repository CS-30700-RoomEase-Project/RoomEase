import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./RoomItems.css";

function Computer({ roomId }) {
  const navigate = useNavigate();

  const handleGoToBills = () => {
    navigate(`/room/${roomId}/bills`);
  };

  return (
    <div className="computer-container">
      <button className="bills-button" onClick={handleGoToBills}>
        Bills
      </button>
      <div className="monitor-frame">
        <div className="monitor-screen"></div>
      </div>
      <div className="computer-stand"></div>
      <div className="computer-base"></div>
    </div>
  );
}

export default Computer;
