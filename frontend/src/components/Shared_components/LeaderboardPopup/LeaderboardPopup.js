import React, { useState, useEffect } from 'react';
import Popup from "reactjs-popup";

const LeaderboardPopup = ({ isOpen, onClose }) => {
  const [roomData, setRoomData] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedMap, setSelectedMap] = useState('Chores');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('roomData');
    if (data) {
      const parsed = JSON.parse(data);
      setRoomData(parsed);
      console.log("roomData:", roomData);
    }
    else {
        console.log("no room data");
    }
  }, []);

  useEffect(() => {
    console.log("room: ", roomData);
  }, [roomData]);

  useEffect(() => {
    if (
      roomData &&
      roomData.completedTasks &&
      roomData.completedTasks.length > 0
    ) {
      const selectedTask = roomData.completedTasks[selectedMonthIndex];
      const mapData = selectedTask?.[selectedMap] || [];
  
      // Sort the array directly (highest value first)
      const sortedEntries = [...mapData].sort((a, b) => b.value - a.value);
  
      setLeaderboard(sortedEntries);
    }
  }, [selectedMonthIndex, selectedMap, roomData]);
  

  if (!roomData) {
    return (
    <Popup open={isOpen} onClose={onClose}>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow-xl w-96">
          <p>Loading leaderboard...</p>
        </div>
      </div>
    </Popup>
    );
  }

  return (
    <Popup open={isOpen} onClose={onClose}>
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Monthly Leaderboard</h2>
          <button onClick={onClose} className="text-red-500 text-lg font-semibold">X</button>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Select Month:</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedMonthIndex}
            onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
          >
            {roomData.completedTasks.map((task, index) => {
              const date = new Date(task.date);
              const monthName = date.toLocaleString('default', { month: 'long' });
              const year = date.getFullYear();
              return (
                <option key={index} value={index}>
                  {monthName} {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Select Metric:</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedMap}
            onChange={(e) => setSelectedMap(e.target.value)}
          >
            <option value="Chores">Chores</option>
            <option value="Groceries">Groceries</option>
            <option value="Bills">Bills</option>
          </select>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Leaderboard:</h3>
          <ul className="list-decimal pl-4 space-y-1">
          {leaderboard
            .sort((a, b) => b.value - a.value) // Optional: sort descending
            .map((entry, index) => (
                <div key={entry._id}>
                <strong>#{index + 1}</strong> {entry.user.username}: {entry.value}
                </div>
            ))}
            {leaderboard.length === 0 && <li>No data for this map</li>}
          </ul>
        </div>
      </div>
    </div>
    </Popup>
  );
};

export default LeaderboardPopup;
