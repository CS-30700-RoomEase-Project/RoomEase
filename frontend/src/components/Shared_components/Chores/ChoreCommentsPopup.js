import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from "./ChoreCommentsPopup.module.css"; // Create a new CSS file for styling

const ChoreCommentsPopup = ({ isOpen, onClose, chore, roomId }) => {
    const [Comments, setComments] = useState([]);
    const [desc, setDesc] = useState("");

    useEffect(() => {
        if (chore) {
            setComments(chore.comments);
            console.log(Comments);
            console.log(chore);
            console.log(chore.comments);
        }
        else {
            setComments([]);
        }
        setDesc("");
    }, [chore]);

    const handleAddComment = async () => {
        if (!desc.trim()) return; // Prevent empty comments
    
        try {
            const response = await fetch('http://localhost:5001/api/chores/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chore: chore._id, // Ensure chore has an _id
                    creator: localStorage.getItem("userId"), // Replace this with the actual user ID
                    message: desc,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }
    
            const data = await response.json();
            onClose();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    

    return( 
        <Popup open={isOpen} modal nested onClose={onClose} contentStyle={{ background: 'white', width: '350px', maxWidth: '90%', padding: '20px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', textAlign: 'center' }} overlayStyle={{ background: 'rgba(15, 14, 14, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className={styles.modal}>
                <h6>New Comment</h6>
                <input type="text" placeholder="new Comment" className={styles.inputField} value={desc} onChange={(e) => setDesc(e.target.value)}/>
                <button onClick={handleAddComment}>
                    post
                </button>
                {Comments.map((comment) => (
                    <div>
                        <h6>{comment.creator.username}</h6>
                        <p>{comment.comment}</p>
                    </div>
                ))}
            </div>
        </Popup>
    );
};

export default ChoreCommentsPopup;