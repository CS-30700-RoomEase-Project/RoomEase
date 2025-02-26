import React from 'react';
import Popup from 'reactjs-popup';
import styles from "./ChorePopup.module.css"; // Create a new CSS file for styling

const ChorePopup = ({ isOpen, onClose }) => {
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
                <input type="text" placeholder="Chore Name" className={styles.inputField} />
                <input type="text" placeholder="Chore description" className={styles.inputField} />
                <input type='text' placeholder="Order of turns (ex. John, Will, Krish...)" className={styles.inputField} />
                <input type='text' placeholder="Whose turn is it first?" className={styles.inputField} />
                <button className={styles.addButton}>Add</button>
                <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
            </div>
        </Popup>
    );
};

export default ChorePopup;