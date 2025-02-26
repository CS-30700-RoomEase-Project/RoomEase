import React, { useState } from "react";
import styles from "./GroceryPage.module.css";

function GroceryPage() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editIndex, setEditIndex] = useState(null); // To track which item is being edited
  const [editName, setEditName] = useState(""); // To store the edited item name
  const [editQuantity, setEditQuantity] = useState(1); // To store the edited item quantity

  const addItem = () => {
    if (input.trim() !== "" && quantity > 0 && quantity <= 999) {
      setItems([...items, { name: input, quantity }]);
      setInput("");
      setQuantity(1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditName(items[index].name);
    setEditQuantity(items[index].quantity);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditName("");
    setEditQuantity(1);
  };

  const saveEdit = (index) => {
    if (editName.trim() !== "" && editQuantity > 0 && editQuantity <= 999) {
      const updatedItems = [...items];
      updatedItems[index] = { name: editName, quantity: editQuantity };
      setItems(updatedItems);
      cancelEdit(); // Cancel editing mode after saving
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Grocery List</h2>
        <p className={styles.registerDescription}>A shared grocery list to add and track items easily.</p>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter item"
            maxLength={21} // Limit input to 50 characters
            className={styles.inputBox}
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(999, Math.max(1, parseInt(e.target.value) || 1)))}
            min="1"
            max="999" // Limit the maximum quantity to 999
            className={styles.quantityBox}
          />
          <button onClick={addItem} className={styles.Button}>Add Item</button>
        </div>

        <ul className={styles.groceryList}>
          <h3 className={styles.title}>Items</h3>
          {items.map((item, index) => (
            <li key={index} className={styles.groceryItem}>
              <div className={styles.groceryItemContent}>
                {editIndex === index ? (
                  <div className={styles.editContainer}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={21} // Limit input to 50 characters
                      className={styles.editInput}
                    />
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Math.min(999, Math.max(1, parseInt(e.target.value) || 1)))}
                      min="1"
                      max="999" // Limit the maximum quantity to 999
                      className={styles.editQuantityInput}
                    />
                  </div>
                ) : (
                  <>
                    {item.name} - <span className={styles.quantityText}>{item.quantity}</span>
                  </>
                )}
              </div>
              <div className={styles.groceryItemButtons}>
                {editIndex === index ? (
                  <>
                    <button onClick={() => saveEdit(index)} className={`${styles.Button} ${styles.saveButton}`}>
                      Save
                    </button>
                    <button onClick={cancelEdit} className={`${styles.Button} ${styles.cancelButton}`}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(index)} className={`${styles.Button} ${styles.editButton}`}>
                      Edit
                    </button>
                    <button onClick={() => removeItem(index)} className={`${styles.Button} ${styles.removeButton}`}>
                      Remove
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroceryPage;
