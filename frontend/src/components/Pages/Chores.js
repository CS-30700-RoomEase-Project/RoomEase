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

            // Sort chores: Incomplete first, then completed
            const sortedChores = data.sort((a, b) => a.completed - b.completed);

            setChores(sortedChores); // Update state with sorted chores
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
            const response = await fetch(`http://localhost:5001/api/chores/markComplete/${chore._id}`, {
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
        fetchChores();
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
                    <div key={chore._id} className= {chore.completed ? styles.listItemMarked : styles.listItem}>
                        <span>{chore.choreName}</span>
                        <span>{chore.description}</span>
                        <span>{chore.order[chore.whoseTurn].username}</span>
                        <span>
                            {String(new Date(chore.dueDate).getUTCMonth() + 1).padStart(2, '0')}-
                            {String(new Date(chore.dueDate).getUTCDate()).padStart(2, '0')}-
                            {new Date(chore.dueDate).getUTCFullYear()}
                        </span>
                        <div className={styles.buttonContainer}>
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
            />
        </div>
    );
}

export default Chores;
