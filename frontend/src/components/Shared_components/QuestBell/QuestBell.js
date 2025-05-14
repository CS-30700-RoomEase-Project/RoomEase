import React, { useState, useEffect, useRef } from 'react';
import './QuestBell.css';
import questIcon from './quest-icon.png';  // Assuming you have a quest icon
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';

/**
 * QuestBell component to display a list of quests for a user in a room.
 * @returns QuestBell component showing quests without any buttons, only display.
 */
const QuestBell = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [quests, setQuests] = useState([]); // Store quests
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false); // Ref to track if fetch has already been called

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id;
        const storedRoom = localStorage.getItem("roomData");
        const parsedRoom = JSON.parse(storedRoom);
        const roomId = parsedRoom._id; // Room ID can be passed or set elsewhere

        if (!userId || !roomId) {
            console.error("No userId or roomId found in localStorage");
            setError("User or Room not found. Please log in and select a room.");
            setLoading(false);
            return;
        }

        const fetchQuests = async () => {
            try {
                // 🔁 Check & generate today's quests
                if (!hasFetched.current) {
                    await fetch(`${process.env.REACT_APP_API_URL}/api/room/checkAndGenerateQuests/${userId}`, {
                        method: 'POST'
                    });
                }

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/room/quests-in-room?userId=${userId}&roomId=${roomId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setQuests([]); // No quests found, set empty array
                    } else {
                        throw new Error("Failed to fetch quests");
                    }
                } else {
                    const data = await response.json();
                    setQuests(data); // Set fetched quests
                }
            } catch (error) {
                console.error("Error fetching quests:", error);
                setError("Failed to load quests.");
            }
            setLoading(false);
        };

        fetchQuests();
        hasFetched.current = true; // Mark that fetch has been called
    }, []); // Effect runs once after mount

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <Popup 
                trigger={
                    <div className="quest-bell">
                        <img 
                            src={questIcon} 
                            alt="Quest Bell" 
                            className="bell-icon" 
                            onClick={toggleDropdown}
                        />
                        <span className="quest-count">{quests.length}</span>
                    </div>
                } 
                arrow={false} 
                position="bottom" 
                on="click" 
                open={isOpen} 
                closeOnDocumentClick
            >
                <div className='dropdown'>
                    <div className='questsContainer'>
                        <h2>Quests</h2>
                        {loading ? (
                            <p>Loading quests...</p>
                        ) : error ? (
                            <p className='errorText'>{error}</p>
                        ) : quests.length === 0 ? (
                            <p>No quests available in this room.</p>
                        ) : (
                            <ul>
                                {quests.map((quest) => (
                                    <li key={quest._id} className='questItem'>
                                        <strong>{quest.type}</strong>: {quest.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default QuestBell;
