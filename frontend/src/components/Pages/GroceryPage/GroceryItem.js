import React, { useState, useRef } from "react";
import styles from "./GroceryPage.module.css";
import CallService from "../../SharedMethods/CallService";

function GroceryItem(props) {
    
    const [editIndex, setEditIndex] = useState(null);
    const [editName, setEditName] = useState("");
    const [editQuantity, setEditQuantity] = useState(1);
    const [cost, setCost] = useState(0);

    const {items, setItems, index, item, room} = props;
    const costRef = useRef(null);
    const quantityRef = useRef(null);

    const togglePurchased = () => {
        const updatedItems = [...items];
        // Toggle purchased state, which in turn controls the insert box visibility.
        updatedItems[index].purchased = !updatedItems[index].purchased;
        setItems(updatedItems);
        saveItem();

        if (updatedItems[index].purchased) {
            console.log("purchased");
            const notificationData = {
                userId: localStorage.getItem("userId"), // temporarily your userId
                description: `${updatedItems[index].itemName} purchased!`,
                pageID: "/grocery", // adjust accordingly
            };
            // Call the backend service to create and propagate the notification
            CallService("grocery/notifyPurchased/" + room._id + "/" + item._id, notificationData, (data) => {console.log("Notification response:", data)});
        }
    };

    const removeItem = () => {
        
        console.log("items" + JSON.stringify(items[index]._id));
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        CallService("grocery/remove/" + room._id + "/" + item._id, {description: "test"}, (data) => console.log(data));
    };

    const startEditing = () => {
        setEditIndex(index);
        setEditName(items[index].itemName);
        setEditQuantity(items[index].quantity);
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditName("");
        setEditQuantity(1);
    };

    const saveEdit = () => {
        if (editName.trim() !== "" && editQuantity > 0 && editQuantity <= 999) {
            const updatedItems = [...items];
            updatedItems[index] = { ...updatedItems[index], itemName: editName, quantity: editQuantity };
            const updatedItem = updatedItems[index];
            CallService("grocery/update", updatedItem, editResponseHandler);
            setItems(updatedItems);
            cancelEdit();
        }
    };

    const saveItem = () => {
        CallService("grocery/update", item, editResponseHandler);
        setItems(items);
    };

    const editResponseHandler = (data) => {
           
        const newItems = [...items];
        newItems[index] = data;
        setItems(newItems);
    }
  
    // Function to update the note for a specific item.
    const updateNote = (index, note) => {
    const updatedItems = [...items];
    updatedItems[index].note = note;
    setItems(updatedItems);
    };

    return <>
        {/* Purchase Button positioned on the left */}
        <button
        onClick={() => togglePurchased()}
        className={styles.purchaseButton}
        >
        {item.purchased && <span className={styles.checkmark}>✔</span>}
        </button>
        <div
        className={styles.groceryItemContent}
        style={{ textDecoration: item.purchased ? "line-through" : "none" }}
        >
        {editIndex === index ? (
        <div className={styles.editContainer}>
            <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            maxLength={21}
            className={styles.editInput}
            />
            <input
            type="number"
            ref={quantityRef}
            onFocus={() => {quantityRef.current.select()}}
            onClick={() => {quantityRef.current.select()}}
            value={editQuantity}
            onChange={(e) =>
                setEditQuantity(
                Math.min(999, Math.max(1, parseInt(e.target.value) || 1))
                )
            }
            min="1"
            max="999"
            className={styles.editQuantityInput}
            />
        </div>
        ) : (
        <>
            {item.itemName} - <span className={styles.quantityText}>{item.quantity}</span>
        </>
        )}
        </div>
        <div className={styles.groceryItemButtons}>
        {editIndex === index ? (
        <>
            <button
            onClick={() => saveEdit()}
            className={`${styles.Button} ${styles.saveButton}`}
            >
            Save
            </button>
            <button
            onClick={cancelEdit}
            className={`${styles.Button} ${styles.cancelButton}`}
            >
            Cancel
            </button>
        </>
        ) : (
        <>
            <button
            onClick={() => startEditing()}
            className={`${styles.Button} ${styles.editButton}`}
            >
            Edit
            </button>
            <button
            onClick={() => removeItem()}
            className={`${styles.Button} ${styles.removeButton}`}
            >
            Remove
            </button>
        </>
        )}
        </div>
        {/* Conditionally render the insert box when the item is marked as purchased */}
        {item.purchased && (
        <div className={styles.insertBox}>
        <input
            type="number"
            value={cost}
            ref={costRef}
            onFocus={() => {costRef.current.select()}}
            onClick={() => {costRef.current.select()}}
            onChange={(e) =>
                setCost(Math.min(9999, Math.max(0, parseInt(e.target.value) || 0)))
            }
            placeholder="Cost"
            className={styles.inputCost}
        />
        </div>
        )}
    </>;
}

export default GroceryItem;