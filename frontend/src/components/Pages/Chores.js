import React, { useState, useEffect } from "react";
import ChorePopup from "../Shared_components/Chores/ChorePopup";
import ChorePointsPopup from "../Shared_components/Chores/ChorePointsPopup";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Chores.module.css";
import NotificationButton from '../Shared_components/NotificationBell/NotificationBell';
import ChoreCommentsPopup from "../Shared_components/Chores/ChoreCommentsPopup";

function Chores() {
    const { roomId } = useParams(); // Gets the roomId from the URL
    const navigate = useNavigate();

    const [isChorePopupOpen, setChorePopupOpen] = useState(false);
    const [isPointsPopupOpen, setPointsPopupOpen] = useState(false);
    const [isCommentsPopupOpen, setCommentsPopupOpen] = useState(false);
    const [chores, setChores] = useState([]); // Store fetched chores
    const [selectedChore, setSelectedChore] = useState(null); // Track selected chore for editing
    const [userData, setUserData] = useState({}); // Store user data

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
                const response = await fetch(`http://localhost:5001/api/chores/getMasterChores/${userData.userId}`); // Ensure API is working
                if (!response.ok) throw new Error("Failed to fetch chores");

                const data = await response.json();

                // Sort chores: Incomplete first, then completed
                const sortedChores = data.sort((a, b) => a.completed - b.completed);

                setChores(sortedChores); // Update state with sorted chores
            }

        } catch (error) {
            console.error("Error fetching chores:", error);
        }
    };


    useEffect(() => {
        setUserData(JSON.parse(localStorage.getItem("userData"))); // Get user data from local storage
        if (roomId) {
            fetchChores();
        }
    }, [roomId]); // Refetch chores when roomId changes

    // Mark chore as complete and switch to next person
    const handleMarkAsComplete = async (chore) => {
        try {
            const response = await fetch(`http://localhost:5001/api/chores/markComplete/${chore._id}/${roomId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) throw new Error("Failed to mark chore as complete");
    
            const updatedChore = await response.json();
    
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

            setChores(prevChores => prevChores.filter(chore => chore._id !== choreId));
        } catch (error) {
            console.error("Error deleting chore:", error);
        }
        fetchChores();
    };

    const handleGoToRoom = () => {
        navigate(`/Room/${roomId}`);
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

    return (
        <div className={styles.choresAppContainer}>
            <div className={styles.choresHeader}>
                <button className={styles.addChore} onClick={handleNewChore}>
                    <h4>Add Chore</h4>
                </button>
                <NotificationButton/>
                <h1 className={styles.titleText}>Chores</h1>
                <button className={styles.pointsButton} onClick={() => setPointsPopupOpen(true)}>
                    <h4>Adjust Points</h4>
                </button>
                <button className={styles.logoutButton} onClick={handleGoToRoom}>
                    <h4>Back to Room</h4>
                </button>
            </div>

            <div className={styles.list}>
                {chores.map((chore) => (
                    <div key={chore._id} className= {chore.completed ? styles.listItemMarked : styles.listItem}>
                        <span>{chore.choreName}</span>
                        <span>{chore.description}</span>
                        <span>{chore.order[chore.whoseTurn].username}</span>
                        <span>
                            {String(new Date(chore.dueDate).getUTCMonth() + 1).padStart(2, '0')}-
                            {String(new Date(chore.dueDate).getUTCDate()).padStart(2, '0')}-
                            {new Date(chore.dueDate).getUTCFullYear()}
                        </span>
                        <span>{chore.difficulty}</span>
                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.commentButton}
                                onClick={() => handleViewComments(chore)}
                            >
                                comments
                            </button>
                            <button
                                className={styles.markButton}
                                onClick={() => handleMarkAsComplete(chore)}
                            >
                                {chore.completed ? "Reuse" : "Mark Complete"}
                            </button>
                            <button 
                                className={styles.editButton} 
                                onClick={() => handleEditChore(chore)}
                            >
                                edit
                            </button>
                            <button 
                                className={styles.deleteButton}
                                onClick={() => handleDeleteChore(chore._id)}
                            >
                                delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ChorePopup 
                isOpen={isChorePopupOpen} 
                onClose={closeChorePopup} 
                chore={selectedChore} 
                roomId={roomId}
            />
            <ChorePointsPopup
                isOpen={isPointsPopupOpen}
                onClose={closePointsPopup}
                roomId={roomId}
            />
            <ChoreCommentsPopup
                isOpen={isCommentsPopupOpen}
                onClose={closeCommentsPopup}
                chore={selectedChore}
                roomId={roomId}
            />
        </div>
    );
}

export default Chores;
