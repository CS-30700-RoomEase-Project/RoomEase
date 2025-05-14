import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import styles from "./ChorePopup.module.css"; // Create a new CSS file for styling
import { Select, SelectTrigger, SelectContent, SelectItem } from "./select.js";

const ChorePopup = ({ isOpen, onClose, chore, roomId }) => {
  const [choreName, setChoreName] = useState("");
  const [choreDescription, setChoreDescription] = useState("");
  const [orderOfTurns, setOrderOfTurns] = useState([]);
  const [firstTurn, setFirstTurn] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [recurringDays, setRecurringDays] = useState(0);
  const [difficulty, setDifficulty] = useState("Medium");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/room/getMembers/${roomId}`
        );
        const data = await response.json();
        setUsers(data);
        console.log(data);
        console.log(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [roomId]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0]; // Converts to "YYYY-MM-DD"
  };

  useEffect(() => {
    if (chore) {
      setChoreName(chore.choreName || "");
      setChoreDescription(chore.description || "");
      setOrderOfTurns(chore.order ? chore.order.map((user) => user._id) : []);
      setFirstTurn(chore.whoseTurn);
      setDueDate(formatDate(chore.dueDate) || "");
      setRecurringDays(chore.recurringDays || 0);
      setDifficulty(chore.difficulty);
    } else {
      setChoreName("");
      setChoreDescription("");
      setOrderOfTurns([]);
      setFirstTurn(null);
      setDueDate("");
      setRecurringDays(0);
      setDifficulty("Easy");
    }
  }, [chore]);

  const handleOrderChange = (userId) => {
    if (userId === "Add to Order") {
      return;
    }
    setOrderOfTurns((prev) => [...prev, userId]);
  };

  const handleRemoveFromOrder = (index) => {
    setOrderOfTurns((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFirstTurnChange = (index) => {
    if (index === "Choose First Person") {
      setFirstTurn(0);
    }
    setFirstTurn(index);
  };

  const handleAddChore = async () => {
    const choreData = {
      name: choreName,
      description: choreDescription,
      turns: orderOfTurns,
      firstTurn: firstTurn || 0,
      dueDate: dueDate,
      recurrenceDays: parseInt(recurringDays, 10),
      difficulty: difficulty,
    };
    console.log(choreData);
    console.log(chore);

    try {
      let response;
      if (chore) {
        response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/chores/updateChore/${chore._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(choreData),
          }
        );
      } else {
        response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/chores/addChore/${roomId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(choreData),
          }
        );
      }

      if (response.ok) {
        alert(
          chore ? "Chore updated successfully!" : "Chore added successfully!"
        );
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
        background: "white",
        width: "350px",
        maxWidth: "90%",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
      }}
      overlayStyle={{
        background: "rgba(15, 14, 14, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
        <h6>Due Date</h6>
        <input
          type="date"
          className={styles.inputField}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <h6>Recurring Days</h6>
        <input
          type="number"
          className={styles.inputField}
          value={recurringDays}
          onChange={(e) => setRecurringDays(e.target.value)}
        />
        <h6>Order of Turns</h6>
        <Select onChange={(e) => handleOrderChange(e.target.value)}>
          <option style={{ color: "black" }} className={styles.popupMenu}>
            Add to Order
          </option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username} ({user.email})
            </option>
          ))}
        </Select>
        <ul>
          {orderOfTurns.map((userId, index) => {
            const user = users.find((u) => u._id === userId);
            return user ? (
              <li key={index}>
                {user.username} ({user.email}){" "}
                <button onClick={() => handleRemoveFromOrder(index)}>
                  Remove
                </button>
              </li>
            ) : null;
          })}
        </ul>
        <h6>Who goes first?</h6>
        <Select
          value={firstTurn}
          onChange={(e) => handleFirstTurnChange(e.target.value)}
        >
          <option value={null}>Choose First Person</option>
          {orderOfTurns.map((userId, index) => {
            const user = users.find((u) => u._id === userId);
            return user ? (
              <option key={index} value={index}>
                {user.username} ({user.email})
              </option>
            ) : null;
          })}
        </Select>
        <h6>Set difficulty</h6>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value={"Easy"}>Easy</option>
          <option value={"Medium"}>Medium</option>
          <option value={"Hard"}>Hard</option>
        </Select>
        <button className={styles.addButton} onClick={handleAddChore}>
          {chore ? "Update" : "Add"}
        </button>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </Popup>
  );
};

export default ChorePopup;
