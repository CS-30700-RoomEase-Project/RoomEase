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
  const [tempComment, setTempComment] = useState("");

  const { items, setItems, index, item, description, room } = props;
  const costRef = useRef(null);
  const quantityRef = useRef(null);

  // On component mount or when item.cost changes, update the cost state
  useEffect(() => {
    if (item.cost !== undefined && item.cost !== null) {
      setCost(item.cost);
    }
  }, [item.cost]);

  useEffect(() => {
    setTempComment(description || "");
  }, [description]);

  const awardQuestPoints = async (userId, roomId, questType) => {
    try {
        const response = await fetch('http://localhost:5001/api/room/award-quest-points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensures the body is JSON
            },
            body: JSON.stringify({
                userId,
                roomId,
                questType
            }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Points awarded:', result.message);
        } else {
            console.error('Error:', result.message);
        }
    } catch (error) {
        console.error('Error calling API:', error);
    }
  };


  const togglePurchased = () => {
    const updatedItems = [...items];
    updatedItems[index].purchased = !updatedItems[index].purchased;
    updatedItems[index].description = tempComment;
    const userId = localStorage.getItem("userId");
    setItems(updatedItems);
    saveItem();

    if (updatedItems[index].purchased) {
      const notificationData = {
        userId: userId,
        description: `${updatedItems[index].itemName} purchased!`,
        pageID: "/grocery",
      };
      const storedUser = localStorage.getItem("userData");
      const parsedUser = JSON.parse(storedUser);
      const currentUserId = parsedUser._id;
      awardQuestPoints(currentUserId, room._id, "buyGrocery");
      fetch(`http://localhost:5001/api/room/${room._id}/increment-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          mapName: 'Groceries',
        }),
      });
      CallService(
        "grocery/notifyPurchased/" + ((room) ? room._id : 1) + "/" + item._id,
        notificationData
      );
    }
  };

  const removeItem = () => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    CallService(
      "grocery/remove/" + item._id,
      { description: "test" },
      (data) => console.log(data)
    );
  };

  const requestItem = () => {
    console.log("Requesting item: " + item.itemName);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData.userId;

    // Send a roomId of "1" to the backend to indicate that the request is coming from a master room
    CallService(
      "grocery/request/" + (((room) ? room._id : 1) + "/" + item._id),
      {
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
    const requesterCount = item.requesters ? item.requesters.length : 0;
    const amountOwed = requesterCount > 0 ? cost / requesterCount : 0;
    let description = tempComment;
    const updatedItem = { 
      ...item, 
      cost,        
      amountOwed,
      description
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

  const togglePaid = () => {
    const updatedItems = [...items];
    updatedItems[index].paid = false;
    updatedItems[index].cost = 0;
    updatedItems[index].purchased = false;
    setCost(0);
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
    if (item.cost > 0 && requesterCount > 0) {
      const share = (item.cost / requesterCount).toFixed(2);
      shareText = ` (must pay: $${share})`;
    }
    return usernames + shareText;
  };

  // Handle comment submission
  const handleSubmitComment = (e) => {
    setComment(tempComment);
    setComment(tempComment);
    e.stopPropagation();
    saveItem();
    setCommentPopup(false);
  };

  const handleCancelComment = (e) => {
    e.stopPropagation();
    setCommentPopup(false);
  }

  // When the entire grocery item container is clicked, open the comment popup (if not editing)
  const handleContainerClick = () => {
    if (editIndex === null) {
      setCommentPopup(true);
      setTempComment(description);
    }
  };

  return (
    <div className={styles.groceryItemC} onClick={handleContainerClick}>
      
      {/* Purchase Button */}
      <button onClick={(e) => { e.stopPropagation(); togglePurchased(); }} className={styles.purchaseCheckbox}>
        {item.purchased && <span className={styles.checked}>✔</span>}
      </button>
      <div
        className={styles.groceryItemContainer}
        style={{ textDecoration: item.purchased ? "line-through" : "none" }}
      >
        <div className={styles.groceryItemText}>
        {editIndex === index ? (
          <div className={styles.editContainer} onClick={(e) => e.stopPropagation()}>
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
            {item.itemName} - {" "}
            <span className={styles.quantityText}>{item.quantity}</span>
          </>
        )}
        </div>
      </div>
      <div className={editIndex === index ? styles.editButtons : styles.groceryItemButtons} onClick={(e) => e.stopPropagation()}>
        {editIndex === index ? (
          <>
            <button onClick={(e) => saveEdit(e)} className={`${styles.Button} ${styles.saveButton}`}>
              Save
            </button>
            <button onClick={(e) => cancelEdit(e)} className={`${styles.Button} ${styles.cancelButton}`}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={(e) => startEditing(e)} className={`${styles.Button} ${styles.editButton}`}>
              Edit
            </button>
            <button onClick={(e) => removeItem(e)} className={`${styles.Button} ${styles.removeButton}`}>
              Remove
            </button>
            <button onClick={(e) => requestItem(e)} className={`${styles.Button} ${styles.requestButton}`}>
              Request Item
            </button>
          </>
        )}
      </div>
      <div className={styles.requestersText} onClick={(e) => e.stopPropagation()}>
        Requesters: {renderRequesters()}
      </div>
      {item.purchased && (
        <div className={styles.totalCostBox} onClick={(e) => e.stopPropagation()}>
          <input
            type="number"
            step="0.01"
            max="9999"
            value={cost}
            ref={costRef}
            onFocus={() => costRef.current.select()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              let value = e.target.value;
              // If there's a decimal point, ensure no more than 2 decimal places are entered.
              if (value.includes('.')) {
                const [whole, fraction] = value.split('.');
                if (fraction.length > 2) {
                  value = `${whole}.${fraction.substring(0, 2)}`;
                }
              }
              // Convert value to a number and clamp it to a maximum of 9999.
              const numericValue = Math.min(parseFloat(value) || 0, 9999);
              setCost(numericValue);
            }}
            onBlur={(e) => {
              // Parse the number and ensure it's not above 9999.
              const numericValue = Math.min(parseFloat(e.target.value) || 0, 9999);
              // Format to exactly two decimal places.
              const formatted = numericValue.toFixed(2);
              setCost(parseFloat(formatted));
              saveItem();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveItem();
              }
            }}
            placeholder="Cost"
            className={styles.inputCost}
          />
          <label className={styles.paidLabel} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={item.paid || false}
              onChange={(e) => togglePaid(e)}
            />{" "}
            Paid
          </label>
        </div>
      )}

        {commentPopup && (
          <div className={styles.commentOverlay} onClick={handleCancelComment}>
            <div className={styles.commentModal} onClick={(e) => e.stopPropagation()}>
              <h3>Comment on {item.itemName}</h3>
              <textarea
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
                placeholder="Type your comment here..."
                maxLength={1000}
              />
              <div className={styles.modalButtons}>
                <button onClick={handleSubmitComment} className={styles.Button}>
                  Submit
                </button>
                <button onClick={handleCancelComment} className={styles.Button}>
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
