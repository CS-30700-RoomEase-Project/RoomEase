import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from "./ChorePopup.module.css"; // Create a new CSS file for styling

const ChorePopup = ({ isOpen, onClose, chore }) => {

    const [choreName, setChoreName] = useState("");
    const [choreDescription, setChoreDescription] = useState("");
    const [orderOfTurns, setOrderOfTurns] = useState("");
    const [firstTurn, setFirstTurn] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [recurringDays, setRecurringDays] = useState(0);

    // Function to format date to MM/DD/YYYY for display
    const formatDateForDisplay = (isoDate) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
    };

    // Populate state if chore exists (Editing Mode)
    useEffect(() => {
        if (chore) {
            setChoreName(chore.choreName || "");
            setChoreDescription(chore.description || "");
            setOrderOfTurns(chore.order ? chore.order.map(user => user.username).join(", ") : "");
            setFirstTurn(chore.order[chore.whoseTurn]?.username || "");
            setDueDate(formatDateForDisplay(chore.dueDate));
            setRecurringDays(chore.recurringDays || 0);
        } else {
            // Reset fields if adding a new chore
            setChoreName("");
            setChoreDescription("");
            setOrderOfTurns("");
            setFirstTurn("");
            setDueDate("");
            setRecurringDays(0);
        }
    }, [chore]);

    // Function to handle form submission
    const handleAddChore = async () => {
        // Attempt to parse the due date
        const parsedDate = new Date(dueDate);
        
        // Check if dueDate is valid
        if (!dueDate || isNaN(parsedDate.getTime())) {
            alert("Please enter a valid due date.");
            return;
        }

        const choreData = {
            name: choreName,
            description: choreDescription,
            turns: orderOfTurns.split(',').map(name => name.trim()), // Convert to array
            firstTurn: firstTurn,
            dueDate: new Date(dueDate).toISOString().split('T')[0], // Convert to YYYY-MM-DD
            recurrenceDays: parseInt(recurringDays, 10)
        };
        console.log(choreData);

        try {
            let response;
            if (chore) {
                console.log("attempting update");
                // If chore exists, update it (PUT request)
                choreData.id = chore._id;
                response = await fetch(`http://localhost:5001/api/chores/updateChore/${chore.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(choreData),
                });
            } else {
                console.log("making new");
                // If chore doesn't exist, create a new one (POST request)
                response = await fetch('http://localhost:5001/api/chores/addChore', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(choreData),
                });
            }

            if (response.ok) {
                alert(chore ? "Chore updated successfully!" : "Chore added successfully!");
                onClose();
            } else {
                alert("Failed to save chore. Please try again.");
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
                <h4>{chore ? "Edit Chore" : "Add a New Chore"}</h4>
                <h6>Chore Name</h6>
                <input 
                    type="text" 
                    placeholder="Chore Name" 
                    className={styles.inputField} 
                    value={choreName}
                    onChange={(e) => setChoreName(e.target.value)}
                />
                <h6>Chore Description</h6>
                <input 
                    type="text" 
                    placeholder="Chore description" 
                    className={styles.inputField} 
                    value={choreDescription}
                    onChange={(e) => setChoreDescription(e.target.value)}   
                />
                <h6>Order of Turns</h6>
                <input 
                    type='text' 
                    placeholder="Order of turns: ex. John, Will, Krish..." 
                    className={styles.inputField} 
                    value={orderOfTurns}
                    onChange={(e) => setOrderOfTurns(e.target.value)}
                />
                <h6>Who goes first?</h6>
                <input 
                    type='text' 
                    placeholder="Whose turn is it first?" 
                    className={styles.inputField} 
                    value={firstTurn}
                    onChange={(e) => setFirstTurn(e.target.value)}
                />
                <h6>When is it due?</h6>
                <input 
                    type='text' 
                    placeholder="Due Date (MM/DD/YYYY)" 
                    className={styles.inputField} 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <h6>After how many days should it be due again? <br /> (0 for non recurring)</h6>
                <input 
                    type='number' 
                    placeholder="Recurring Days (0 for non-recurring)" 
                    className={styles.inputField} 
                    value={recurringDays}
                    onChange={(e) => setRecurringDays(e.target.value)}
                />
                <button className={styles.addButton} onClick={handleAddChore}>{chore ? "Update" : "Add"}</button>
                <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            </div>
        </Popup>
    );
};

export default ChorePopup;
