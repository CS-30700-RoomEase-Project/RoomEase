import React, { useState, useRef } from "react";
import styles from "./GroceryPage.module.css";
import CallService from "../../SharedMethods/CallService";
import GroceryItem from "./GroceryItem";

function GroceryPage({room}) {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [quantity, setQuantity] = useState(1);

  const quantityRef = useRef(null);

  const addItem = () => {
    if (input.trim() !== "" && quantity > 0 && quantity <= 999) {
      // Added a note property to each new item.
      setItems([...items, { name: input, quantity, purchased: false, note: "" }]);
      setInput("");
      setQuantity(1);
      CallService("grocery/add/" + room._id, {itemName: input, description: "test"}, (data) => console.log(data));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Grocery List</h2>
        <p className={styles.groceryTitleDescription}>
          A shared grocery list to add and track items easily.
        </p>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter item"
            maxLength={21}
            className={styles.inputBox}
          />
          <input
            type="number"
            value={quantity}
            ref={quantityRef}
            onFocus={() => {quantityRef.current.select()}}
            onClick={() => {quantityRef.current.select()}}
            onChange={(e) =>
              setQuantity(Math.min(999, Math.max(1, parseInt(e.target.value) || 1)))
            }
            min="1"
            max="999"
            className={styles.quantityBox}
          />
          <button onClick={addItem} className={styles.Button}>
            Add Item
          </button>
        </div>

        <ul className={styles.groceryList}>
          <h3 className={styles.title}>Items</h3>
          {items.map((item, index) => (
            <li key={index} className={styles.groceryItem}>
              <GroceryItem items={items} setItems={setItems} index={index} item={item}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroceryPage;
