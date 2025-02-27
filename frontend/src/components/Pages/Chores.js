import React, { useState, useEffect } from "react";
import ChorePopup from "../Shared_components/Chores/ChorePopup";
import { useNavigate } from "react-router-dom";
import styles from "./Chores.module.css";

function Chores() {
    const navigate = useNavigate();
    const [isChorePopupOpen, setChorePopupOpen] = useState(false);
    const [chores, setChores] = useState([]); // Store fetched chores

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

    //delete chore when delete button clicked
    const handleDeleteChore = async (choreId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/chores/${choreId}`, {
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

    const handleNewChore = () => {
        setChorePopupOpen(true);
    };

    const closeChorePopup = () => {
        setChorePopupOpen(false);
    };

    const handleChoreAdded = () => {
        fetchChores(); // Refresh the chores list after adding a new chore
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
                {chores.map((chore, index) => (
                    <div key={chore._id} className={styles.listItem}>
                        <span>{chore.choreName}</span>
                        <span>{chore.description}</span>
                        <span>{chore.whoseTurn}</span>
                        <div className={styles.buttonContainer}>
                            <button className={styles.editButton}>edit</button>
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

            <ChorePopup isOpen={isChorePopupOpen} onClose={closeChorePopup} onChoreAdded={handleChoreAdded} />
        </div>
    );
}

export default Chores;
