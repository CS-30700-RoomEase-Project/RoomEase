import React, { useState, useRef, useEffect } from "react";
import styles from "./GroceryPage.module.css";
import CallService from "../../SharedMethods/CallService";

function GroceryItem(props) {
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [cost, setCost] = useState(0);

  const { items, setItems, index, item, room } = props;
  const costRef = useRef(null);
  const quantityRef = useRef(null);

  // On component mount or when item.cost changes, update the cost state
  useEffect(() => {
    if (item.cost !== undefined && item.cost !== null) {
      setCost(item.cost);
    }
  }, [item.cost]);

  const togglePurchased = () => {
    const updatedItems = [...items];
    // Toggle purchased state, which controls the cost input visibility.
    updatedItems[index].purchased = !updatedItems[index].purchased;

    const userId = localStorage.getItem("userId"); // Must be a valid ObjectId string

    setItems(updatedItems);
    saveItem();

    if (updatedItems[index].purchased) {
      const notificationData = {
        userId: userId,
        description: `${updatedItems[index].itemName} purchased!`,
        pageID: "/grocery",
      };
      // Call the backend service to create and propagate the notification
      CallService(
        "grocery/notifyPurchased/" + room._id + "/" + item._id,
        notificationData
      );
    }
  };

  const removeItem = () => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    CallService(
      "grocery/remove/" + room._id + "/" + item._id,
      { description: "test" },
      (data) => console.log(data)
    );
  };

  const requestItem = () => {
    console.log("Requesting item: " + item.itemName);
    const userId = localStorage.getItem("userId"); // Retrieve the current user's id
    CallService(
      "grocery/request/" + room._id + "/" + item._id,
      {
        description: `Requesting ${item.itemName}`,
        userId: userId,
      },
      editResponseHandler
    );
  };

  const startEditing = () => {
    setEditIndex(index);
    setEditName(item.itemName);
    setEditQuantity(item.quantity);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditName("");
    setEditQuantity(1);
  };

  const saveEdit = () => {
    if (editName.trim() !== "" && editQuantity > 0 && editQuantity <= 999) {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        itemName: editName,
        quantity: editQuantity,
      };
      const updatedItem = updatedItems[index];
      CallService("grocery/update", updatedItem, editResponseHandler);
      setItems(updatedItems);
      cancelEdit();
    }
  };

  const saveItem = () => {
    // Calculate the share (amount owed) based on the current cost and number of requesters
    const requesterCount = item.requesters ? item.requesters.length : 0;
    const amountOwed = requesterCount > 0 ? cost / requesterCount : 0;

    // Create an updated item payload including both cost and amountOwed.
    const updatedItem = { 
      ...item, 
      cost,        // Total cost entered by the user
      amountOwed   // Calculated per requester
    };

    console.log("Saving updated item:", updatedItem);

    // Update the backend
    CallService("grocery/update", updatedItem, (data) => {
      console.log("Update response:", data);
      const updatedItems = [...items];
      updatedItems[index] = data || updatedItem;
      setItems(updatedItems);
    });
  };

  const editResponseHandler = (data) => {
    const newItems = [...items];
    newItems[index] = { ...item, ...data };
    setItems(newItems);
  };

  // New function to toggle the payment (paid) status.
  const togglePaid = () => {
    const updatedItems = [...items];
    updatedItems[index].paid = !updatedItems[index].paid;
    setItems(updatedItems);

    // Update the backend with the new "paid" value.
    const updatedItem = { ...item, paid: updatedItems[index].paid };
    CallService("grocery/update", updatedItem, editResponseHandler);
  };

  // Helper to display a truncated list of requester IDs
  const renderRequesters = () => {
    if (!item.requesters || item.requesters.length === 0) {
      return "No requests";
    }
    // Get the usernames from the populated requester objects.
    const usernames = item.requesters.map((req) => req.username).join(", ");
    // Calculate each person's share if a cost is entered
    const requesterCount = item.requesters.length;
    let shareText = "";
    if (item.cost && requesterCount > 0) {
      const share = (item.cost / requesterCount).toFixed(2);
      shareText = ` (must pay: $${share})`;
    }
    return usernames + shareText;
  };

  return (
    <div className={styles.groceryItemContainer}>
      {/* Purchase Button */}
      <button onClick={togglePurchased} className={styles.purchaseButton}>
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
              onFocus={() => quantityRef.current.select()}
              onClick={() => quantityRef.current.select()}
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
            {item.itemName} -{" "}
            <span className={styles.quantityText}>{item.quantity}</span>
          </>
        )}
      </div>
      <div className={styles.groceryItemButtons}>
        {editIndex === index ? (
          <>
            <button
              onClick={saveEdit}
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
              onClick={startEditing}
              className={`${styles.Button} ${styles.editButton}`}
            >
              Edit
            </button>
            <button
              onClick={removeItem}
              className={`${styles.Button} ${styles.removeButton}`}
            >
              Remove
            </button>
            <button
              onClick={requestItem}
              className={`${styles.Button} ${styles.requestButton}`}
            >
              Request Item
            </button>
          </>
        )}
      </div>
      {/* Requesters Tooltip */}
      <div className={styles.requestersTooltip}>
        Requesters: {renderRequesters()}
      </div>
      {/* Cost Input & Payment Checkbox - Only shows when item is purchased */}
      {item.purchased && (
        <div className={styles.insertBox}>
          <input
            type="number"
            value={cost}
            ref={costRef}
            onFocus={() => costRef.current.select()}
            onClick={() => costRef.current.select()}
            onChange={(e) =>
              setCost(Math.min(9999, Math.max(0, parseInt(e.target.value) || 0)))
            }
            onBlur={saveItem} // Save when leaving the cost field
            placeholder="Cost"
            className={styles.inputCost}
          />
          <label className={styles.paidLabel}>
            <input
              type="checkbox"
              checked={item.paid || false}
              onChange={togglePaid}
            />{" "}
            Payment Fulfilled
          </label>
        </div>
      )}
    </div>
  );
}

export default GroceryItem;
