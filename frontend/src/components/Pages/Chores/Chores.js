import React, { useState } from "react";
import ChorePopup from "../../Shared_components/ChorePopup";
import { useNavigate } from "react-router-dom";
import styles from "./Chores.module.css"; //import chores page styles

function Chores() {
    const navigate = useNavigate();
    const [IsChorePopupOpen, setChorePopupOpen] = useState(false);


    const handleGoToRoom = () => {
        navigate('/Room'); //update to whatever the room path is
    }

    const handleNewChore = () => {
        setChorePopupOpen(true);
    }

    const closeChorePopup = () => {
        setChorePopupOpen(false);
    }

    //replace with the chores data from the database
    const [items] = useState(Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`));


    return (
        <div className={styles.choresAppContainer}>
            
            {/*header */}
            <div className={styles.choresHeader}>
                <button className={styles.addChore} onClick={handleNewChore}>
                    <h4>Add Chore</h4>
                </button>
                <h1 className={styles.titleText}>Chores</h1>
                {/*Back button */}
                <button className={styles.logoutButton} onClick={handleGoToRoom}>
                    <h4>Back to Room</h4>
                </button>
            </div>

            {/*scrolling list */}
            <div className={styles.list}>
                {items.map((item, index) => (
                    <div key={index} className={styles.listItem}>
                        <span>{item}</span>
                        <div className={styles.buttonContainer}>
                            <button className={styles.editButton}>edit</button>
                            <button className={styles.deleteButton}>delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <ChorePopup isOpen={IsChorePopupOpen} onClose={closeChorePopup} />
        </div>
    );
};

export default Chores;