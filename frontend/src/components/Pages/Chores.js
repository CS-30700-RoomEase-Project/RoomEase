import React, { useState, useEffect } from "react";
import ChorePopup from "../Shared_components/Chores/ChorePopup";
import ChorePointsPopup from "../Shared_components/Chores/ChorePointsPopup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Chores.module.css";
import NotificationButton from '../Shared_components/NotificationBell/NotificationBell';
import ChoreCommentsPopup from "../Shared_components/Chores/ChoreCommentsPopup";
import ChoreSwapPopup from "../Shared_components/Chores/ChoreSwapPopup";

function Chores() {
    let { roomId } = useParams(); // Gets the roomId from the URL
    const navigate = useNavigate();

    const [isChorePopupOpen, setChorePopupOpen] = useState(false);
    const [isPointsPopupOpen, setPointsPopupOpen] = useState(false);
    const [isCommentsPopupOpen, setCommentsPopupOpen] = useState(false);
    const [isSwapPopupOpen, setSwapPopupOpen] = useState(false);
    // When in a regular room, "chores" is an array.
    // When roomId === "master-room", "chores" will hold an object with keys
    // representing roomIds and values of { roomName, chores: [] }.
    const [chores, setChores] = useState([]);
    const [selectedChore, setSelectedChore] = useState(null); // Track selected chore for editing

    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    console.log("User data:", userData);
    
    // Fetch chores from API
    const fetchChores = async () => {
        try {
            if (roomId !== "master-room") {
                const response = await fetch(`http://localhost:5001/api/chores/getChores/${roomId}`); // Ensure API is working
                if (!response.ok) throw new Error("Failed to fetch chores");

                const data = await response.json();
                // Sort chores: Incomplete first, then completed
                const sortedChores = data.sort((a, b) => a.completed - b.completed);

                setChores(sortedChores); // Update state with sorted chores
            } else {
                // For the aggregated (master-room) view, call get chores for all rooms
                let totalChores = [];
                for (const room of userData.rooms) {
                    const response = await fetch(`http://localhost:5001/api/chores/getChores/${room._id}`);
                    if (!response.ok) continue;

                    let data = await response.json();

                    // Sort chores: Incomplete first, then completed
                    let sortedChores = data.sort((a, b) => a.completed - b.completed);

                    // Add the roomName from the room to each chore
                    sortedChores = sortedChores.map(chore => ({ ...chore, roomName: room.roomName, roomId: room._id }));

                    totalChores = totalChores.concat(sortedChores);
                }

                // Group chores by room name using the roomName added above
                const groupedChores = totalChores.reduce((acc, chore) => {
                    const roomName = chore.roomName || "Unnamed Room";
                    if (!acc[roomName]) {
                        acc[roomName] = {
                            roomName,
                            chores: [],
                        };
                    }
                    acc[roomName].chores.push(chore);
                    return acc;
                }, {});
                
                setChores(groupedChores);
                console.log("fetch done");
            }
        } catch (error) {
            console.error("Error fetching chores:", error);
        }
    };

    useEffect(() => {
        console.log("new roomId", roomId);
        setChores([]);
        if (roomId) {
            fetchChores();
        }
    }, [roomId]);

    const awardQuestPoints = async (userId, roomId, questType) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/room/award-quest-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Ensures the body is JSON
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    questType
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log('Points awarded:', result.message);
            } else {
                console.error('Error:', result.message);
            }
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };
    


    // Mark chore as complete and switch to next person
    const handleMarkAsComplete = async (chore) => {
        try {
            if (!chore.completed) {
                awardQuestPoints(chore.order[chore.whoseTurn]._id, roomId, "completeChore");
                await fetch(`http://localhost:5001/api/room/${roomId}/increment-task`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: chore.order[chore.whoseTurn]._id,
                      mapName: 'Chores', // or 'Groceries', 'Bills'
                    }),
                });
                  
            }
            const response = await fetch(`http://localhost:5001/api/chores/markComplete/${chore._id}/${roomId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) throw new Error("Failed to mark chore as complete");
    
            await response.json();
            // Update state with the new chore data from the response
            fetchChores();
        } catch (error) {
            console.error("Error marking chore as complete:", error);
        }
    };
    
    // Delete chore when delete button clicked
    const handleDeleteChore = async (choreId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/chores/delete/${choreId}/${roomId}`, {
                method: "DELETE",
            });
    
            if (!response.ok) throw new Error("Failed to delete chore");
    
            if (roomId !== "master-room") {
                setChores(prevChores => prevChores.filter(chore => chore._id !== choreId));
            }
        } catch (error) {
            console.error("Error deleting chore:", error);
        }
        fetchChores();
    };

    const handleGoToRoom = (room) => {
        window.location.href = `/room/${room}`;
    };

    const handleGoToChores = (room) => {
        roomId = room;
        fetchChores();
        window.location.href = `/chores/${room}`;
    };

    // Open popup for adding a new chore
    const handleNewChore = () => {
        setSelectedChore(null); // Ensure no chore is selected (new chore mode)
        setChorePopupOpen(true);
    };

    // Open popup for editing a chore
    const handleEditChore = (chore) => {
        setSelectedChore(chore); // Set selected chore for editing
        setChorePopupOpen(true);
    };

    const handleViewComments = (chore) => {
        setSelectedChore(chore);
        setCommentsPopupOpen(true);
    };

    const closeChorePopup = () => {
        setChorePopupOpen(false);
        setSelectedChore(null); // Reset selected chore when closing
        fetchChores();
    };

    const closeCommentsPopup = () => {
        setCommentsPopupOpen(false);
        setSelectedChore(null);
        fetchChores();
    };

    const closePointsPopup = () => {
        setPointsPopupOpen(false);
    };

    const closeSwapPopup = () => {
        setSwapPopupOpen(false);
    };

    return (
        <div className={styles.choresAppContainer}>
            <div className={styles.choresHeader}>
            {roomId !== "master-room" ? (
                <>
                    <button className={styles.addChore} onClick={handleNewChore}>
                        <h4>Add Chore</h4>
                    </button>
                    <button onClick={() => setSwapPopupOpen(true)}>
                        <h4>Chore Swaps</h4>
                    </button>
                    <NotificationButton/>
                    <h1 className={styles.titleText}>Chores</h1>
                    <button className={styles.pointsButton} onClick={() => setPointsPopupOpen(true)}>
                        <h4>Adjust Points</h4>
                    </button>
                    <button className={styles.logoutButton} onClick={() => handleGoToRoom(roomId)}>
                        <h4>Back to Room</h4>
                    </button>
                </>
            ) : (
                <>
                    <h1 className={styles.titleText}>Your Chores</h1>
                </>
            )}
        </div>

            <div className={styles.list}>
                {roomId !== "master-room" ? (
                    chores.map((chore) => (
                        <div key={chore._id} className={chore.completed ? styles.listItemMarked : styles.listItem}>
                            <span>{chore.choreName}</span>
                            <span>{chore.description}</span>
                            <span>
                                {chore.order && chore.order[chore.whoseTurn] 
                                    ? chore.order[chore.whoseTurn].username 
                                    : "N/A"}
                            </span>                            
                            <span>
                                {String(new Date(chore.dueDate).getUTCMonth() + 1).padStart(2, '0')}-  
                                {String(new Date(chore.dueDate).getUTCDate()).padStart(2, '0')}-  
                                {new Date(chore.dueDate).getUTCFullYear()}
                            </span>
                            <span>{chore.difficulty}</span>
                            <div className={styles.buttonContainer}>
                                <button className={styles.commentButton} onClick={() => handleViewComments(chore)}>
                                    comments
                                </button>
                                <button className={styles.markButton} onClick={() => handleMarkAsComplete(chore)}>
                                    {chore.completed ? "Reuse" : "Mark Complete"}
                                </button>
                                <button className={styles.editButton} onClick={() => handleEditChore(chore)}>
                                    edit
                                </button>
                                <button className={styles.deleteButton} onClick={() => handleDeleteChore(chore._id)}>
                                    delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    Object.keys(chores).length > 0 ? (
                        Object.keys(chores).map((groupKey) => {
                            const group = chores[groupKey];
                            return (
                                <div key={groupKey}>
                                    <h2>{group.roomName}</h2>
                                    {group.chores.map((chore) => (
                                        <div key={chore._id} className={styles.listItem} onClick={() => handleGoToChores(chore.roomId)}>
                                            <span>{chore.choreName}</span>
                                            <span>{chore.description}</span>
                                            <span>
                                                {chore.order && chore.order[chore.whoseTurn]
                                                    ? chore.order[chore.whoseTurn].username 
                                                    : "N/A"}
                                            </span>
                                            <span>
                                                {String(new Date(chore.dueDate).getUTCMonth() + 1).padStart(2, '0')}-  
                                                {String(new Date(chore.dueDate).getUTCDate()).padStart(2, '0')}-  
                                                {new Date(chore.dueDate).getUTCFullYear()}
                                            </span>
                                            <span>{chore.difficulty}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })
                    ) : (
                        <p>No chores available.</p>
                    )
                )}
            </div>

            {roomId !== "master-room" && (
                <>
            <ChorePopup isOpen={isChorePopupOpen} onClose={closeChorePopup} chore={selectedChore} roomId={roomId} />
            <ChorePointsPopup isOpen={isPointsPopupOpen} onClose={closePointsPopup} roomId={roomId} />
            <ChoreCommentsPopup isOpen={isCommentsPopupOpen} onClose={closeCommentsPopup} chore={selectedChore} roomId={roomId} />
            <ChoreSwapPopup isOpen={isSwapPopupOpen} onClose={closeSwapPopup} chores={roomId !== "master-room" ? chores : []} roomId={roomId} />
            </>
            )}
        </div>
    );
}

export default Chores;