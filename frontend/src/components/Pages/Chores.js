import React, { useState, useEffect } from "react";
import ChorePopup from "../Shared_components/Chores/ChorePopup";
import { useNavigate } from "react-router-dom";
import styles from "./Chores.module.css";

function Chores() {
    const navigate = useNavigate();
    const [isChorePopupOpen, setChorePopupOpen] = useState(false);
    const [chores, setChores] = useState([]); // Store fetched chores
    const [selectedChore, setSelectedChore] = useState(null); // Track selected chore for editing

    // Fetch chores from API
    const fetchChores = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/chores/getChores'); // Ensure API is working
            if (!response.ok) throw new Error("Failed to fetch chores");
            const data = await response.json();
            setChores(data); // Update state with fetched chores
        } catch (error) {
            console.error("Error fetching chores:", error);
        }
    };

    // Fetch chores on component mount
    useEffect(() => {
        fetchChores();
    }, []);

    // Mark chore as complete and switch to next person
    const handleMarkAsComplete = async (chore) => {
        try {
            const nextTurn = (chore.whoseTurn + 1) % chore.order.length; // Cycle to the next person
            
            const response = await fetch(`http://localhost:5001/api/chores/markComplete/${chore._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whoseTurn: nextTurn })
            });
            
            if (!response.ok) throw new Error("Failed to mark chore as complete");
            
            setChores(prevChores => prevChores.map(c => c._id === chore._id ? { ...c, whoseTurn: nextTurn } : c));
        } catch (error) {
            console.error("Error marking chore as complete:", error);
        }
    };

    // Delete chore when delete button clicked
    const handleDeleteChore = async (choreId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/chores/delete/${choreId}`, {
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
        navigate('/Room');
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

    const closeChorePopup = () => {
        setChorePopupOpen(false);
        setSelectedChore(null); // Reset selected chore when closing
    };

    const handleChoreSaved = () => {
        fetchChores(); // Refresh the chores list after adding or editing
        closeChorePopup(); // Close the popup
    };

    return (
        <div className={styles.choresAppContainer}>
            <div className={styles.choresHeader}>
                <button className={styles.addChore} onClick={handleNewChore}>
                    <h4>Add Chore</h4>
                </button>
                <h1 className={styles.titleText}>Chores</h1>
                <button className={styles.logoutButton} onClick={handleGoToRoom}>
                    <h4>Back to Room</h4>
                </button>
            </div>

            <div className={styles.list}>
                {chores.map((chore) => (
                    <div key={chore._id} className={styles.listItem}>
                        <span>{chore.choreName}</span>
                        <span>{chore.description}</span>
                        <span>{chore.order[chore.whoseTurn].username}</span>
                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.markButton}
                                onClick={() => handleMarkAsComplete(chore)}
                            >
                                "Mark as complete"
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
                onChoreSaved={handleChoreSaved} 
                chore={selectedChore} 
            />
        </div>
    );
}

export default Chores;
