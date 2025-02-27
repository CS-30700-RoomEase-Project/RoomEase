import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import styles from "./ChorePopup.module.css"; // Create a new CSS file for styling

const ChorePopup = ({ isOpen, onClose }) => {

    const [choreName, setChoreName] = useState("");
    const [choreDescription, setChoreDescription] = useState("");
    const [orderOfTurns, setOrderOfTurns] = useState("");
    const [firstTurn, setFirstTurn] = useState("");

    // Function to handle form submission
    const handleAddChore = async () => {
        const choreData = {
            name: choreName,
            description: choreDescription,
            turns: orderOfTurns.split(',').map(name => name.trim()), // Convert to array
            firstTurn: firstTurn
        };
        console.log(choreData)

        try {
            const response = await fetch('http://localhost:5001/api/chores/addChore', { // Replace with your actual server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(choreData),
            });

            if (response.ok) {
                alert("Chore added successfully!");
                onClose(); // Close the popup after successful submission
            } else {
                alert("Failed to add chore. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <Popup 
            open={isOpen} 
            modal 
            nested 
            onClose={onClose}
            contentStyle={{
                background: 'white',
                width: '350px',
                maxWidth: '90%',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
            }}
            overlayStyle={{
                background: 'rgba(15, 14, 14, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div className={styles.modal}>
                <h4>Add a New Chore</h4>
                <input 
                    type="text" 
                    placeholder="Chore Name" 
                    className={styles.inputField} 
                    value={choreName}
                    onChange={(e) => setChoreName(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Chore description" 
                    className={styles.inputField} 
                    value={choreDescription}
                    onChange={(e) => setChoreDescription(e.target.value)}   
                />
                <input 
                    type='text' 
                    placeholder="Order of turns (ex. John, Will, Krish...)" 
                    className={styles.inputField} 
                    value={orderOfTurns}
                    onChange={(e) => setOrderOfTurns(e.target.value)}
                />
                <input 
                    type='text' 
                    placeholder="Whose turn is it first?" 
                    className={styles.inputField} 
                    value={firstTurn}
                    onChange={(e) => setFirstTurn(e.target.value)}
                />
                <button className={styles.addButton} onClick={handleAddChore}>Add</button>
                <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            </div>
        </Popup>
    );
};

export default ChorePopup;