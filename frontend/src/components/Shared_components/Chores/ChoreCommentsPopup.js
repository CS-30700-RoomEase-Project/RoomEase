import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from "./ChoreCommentsPopup.module.css"; // Create a new CSS file for styling

const ChoreCommentsPopup = ({ isOpen, onClose, chore, roomId }) => {
    const [Comments, setComments] = useState([]);
    const [desc, setDesc] = useState("");
    const [notify, setNotify] = useState(false);

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
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/chores/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chore: chore._id, // Ensure chore has an _id
                    creator: localStorage.getItem("userId"), // Replace this with the actual user ID
                    message: desc,
                    notify: notify,
                    roomId: roomId,
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

    const handleRemoveComment = async (comment) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chores/deleteComment`, {
                method: 'DELETE',  // Make sure your backend supports DELETE with a body
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commentId: comment._id,
                    choreId: chore._id, // Send the chore ID along with the comment
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
    
            // Update the local state to remove the deleted comment
            setComments((prevComments) => prevComments.filter(c => c._id !== comment._id));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    
    

    return( 
        <Popup open={isOpen} modal nested onClose={onClose} contentStyle={{ background: 'white', width: '350px', maxWidth: '90%', padding: '20px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', textAlign: 'center' }} overlayStyle={{ background: 'rgba(15, 14, 14, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className={styles.modal}>
                <h6>New Comment</h6>
                <label>
                    <p className={styles.PopupText}>notify group</p>
                    <input type="checkbox" value={notify} onChange={(e) => setNotify(e.target.checked)}/>
                </label>
                <input type="text" placeholder="new Comment" className={styles.inputField} value={desc} onChange={(e) => setDesc(e.target.value)}/>
                <button onClick={handleAddComment}>
                    post
                </button>
                {Comments.map((comment) => (
                    <div>
                        <h6>{comment.creator.username}</h6>
                        <p className={styles.PopupText}>{comment.comment}</p>
                        <button onClick={() => handleRemoveComment(comment)}>Resolve</button>
                    </div>
                ))}
            </div>
        </Popup>
    );
};

export default ChoreCommentsPopup;