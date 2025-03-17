import React, { useState, useRef, useEffect } from "react";
import styles from "./GroceryPage.module.css";
import CallService from "../../SharedMethods/CallService";

function GroceryItem(props) {
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [cost, setCost] = useState(0);
  const [commentPopup, setCommentPopup] = useState(false);
  const [comment, setComment] = useState("");

  const { items, setItems, index, item, room } = props;
  const costRef = useRef(null);
  const quantityRef = useRef(null);

  // Update cost state when item.cost changes
  useEffect(() => {
    if (item.cost !== undefined && item.cost !== null) {
      setCost(item.cost);
    }
  }, [item.cost]);

  const togglePurchased = (e) => {
    e.stopPropagation();
    const updatedItems = [...items];
    updatedItems[index].purchased = !updatedItems[index].purchased;
    const userId = localStorage.getItem("userId");
    setItems(updatedItems);
    saveItem();

    if (updatedItems[index].purchased) {
      const notificationData = {
        userId: userId,
        description: `${updatedItems[index].itemName} purchased!`,
        pageID: "/grocery",
      };
      CallService(
        "grocery/notifyPurchased/" + room._id + "/" + item._id,
        notificationData
      );
    }
  };

  const removeItem = (e) => {
    e.stopPropagation();
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    CallService(
      "grocery/remove/" + room._id + "/" + item._id,
      { description: "test" },
      (data) => console.log(data)
    );
  };

  const requestItem = (e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    CallService(
      "grocery/request/" + room._id + "/" + item._id,
      { description: `Requesting ${item.itemName}`, userId: userId },
      editResponseHandler
    );
  };

  const startEditing = (e) => {
    e.stopPropagation();
    setEditIndex(index);
    setEditName(item.itemName);
    setEditQuantity(item.quantity);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditIndex(null);
    setEditName("");
    setEditQuantity(1);
  };

  const saveEdit = (e) => {
    e.stopPropagation();
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
      cancelEdit(e);
    }
  };

  const saveItem = () => {
    const requesterCount = item.requesters ? item.requesters.length : 0;
    const amountOwed = requesterCount > 0 ? cost / requesterCount : 0;
    const updatedItem = { 
      ...item, 
      cost,        
      amountOwed  
    };

    CallService("grocery/update", updatedItem, (data) => {
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

  const togglePaid = (e) => {
    e.stopPropagation();
    const updatedItems = [...items];
    updatedItems[index].paid = !updatedItems[index].paid;
    setItems(updatedItems);
    const updatedItem = { ...item, paid: updatedItems[index].paid };
    CallService("grocery/update", updatedItem, editResponseHandler);
  };

  const renderRequesters = () => {
    if (!item.requesters || item.requesters.length === 0) {
      return "No requests";
    }
    const usernames = item.requesters.map((req) => req.username).join(", ");
    const requesterCount = item.requesters.length;
    let shareText = "";
    if (item.cost && requesterCount > 0) {
      const share = (item.cost / requesterCount).toFixed(2);
      shareText = ` (must pay: $${share})`;
    }
    return usernames + shareText;
  };

  // Handle comment submission (for now, simply log the comment)
  const handleSubmitComment = () => {
    console.log("Comment for item", item.itemName, ":", comment);
    // Optionally, call a backend service to save the comment.
    setComment("");
    setCommentPopup(false);
  };

  // Clicking anywhere on the entire container (unless a button stops propagation)
  const handleContainerClick = () => {
    if (editIndex === null) {
      setCommentPopup(true);
    }
  };

  return (
    <div className={styles.groceryItemContainer} onClick={handleContainerClick}>
      {/* Purchase Button */}
      <button onClick={togglePurchased} className={styles.purchaseCheckbox}>
        {item.purchased && <span className={styles.checked}>✔</span>}
      </button>

      <div className={styles.groceryItemContent} style={{ textDecoration: item.purchased ? "line-through" : "none" }}>
        {editIndex === index ? (
          <div className={styles.editContainer}>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={21}
              className={styles.editInput}
              onClick={(e) => e.stopPropagation()}
            />
            <input
              type="number"
              ref={quantityRef}
              onFocus={() => quantityRef.current.select()}
              onClick={(e) => { e.stopPropagation(); quantityRef.current.select(); }}
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
            <button onClick={saveEdit} className={`${styles.Button} ${styles.saveButton}`}>
              Save
            </button>
            <button onClick={cancelEdit} className={`${styles.Button} ${styles.cancelButton}`}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={startEditing} className={`${styles.Button} ${styles.editButton}`}>
              Edit
            </button>
            <button onClick={removeItem} className={`${styles.Button} ${styles.removeButton}`}>
              Remove
            </button>
            <button onClick={requestItem} className={`${styles.Button} ${styles.requestButton}`}>
              Request Item
            </button>
          </>
        )}
      </div>

      <div className={styles.requestersTooltip}>
        Requesters: {renderRequesters()}
      </div>

      {item.purchased && (
        <div className={styles.insertBox}>
          <input
            type="number"
            value={cost}
            ref={costRef}
            onFocus={() => costRef.current.select()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              setCost(Math.min(9999, Math.max(0, parseInt(e.target.value) || 0)))
            }
            onBlur={saveItem}
            placeholder="Cost"
            className={styles.inputCost}
          />
          <label className={styles.paidLabel} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={item.paid || false}
              onChange={togglePaid}
            />{" "}
            Payment Fulfilled
          </label>
        </div>
      )}

      {/* Comment Popup Modal */}
      {commentPopup && (
        <div className={styles.commentOverlay} onClick={(e) => e.stopPropagation()}>
          <div className={styles.commentModal}>
            <h3>Comment on {item.itemName}</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type your comment here..."
            />
            <div className={styles.modalButtons}>
              <button onClick={handleSubmitComment} className={styles.Button}>
                Submit
              </button>
              <button onClick={() => setCommentPopup(false)} className={styles.Button}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroceryItem;
