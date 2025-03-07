import React from 'react';
import './ExitRoom.css';

function ExitRoom({ onClick }) {
  return (
    <div className="arrow-container" onClick={onClick} title="Exit Room">
      <div className="arrow-head" />
      <div className="arrow-body" />
    </div>
  );
}
  
export default ExitRoom;