import React, { useState, useRef, useEffect } from "react";
import styles from "./GroceryPage.module.css";
import CallService from "../../SharedMethods/CallService";
import GroceryItem from "./GroceryItem";

function GroceryPage({room}) {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isGroceryListOpen, setGroceryListOpen] = useState(true);

  const quantityRef = useRef(null);

  const addItem = () => {
    if (input.trim() !== "" && quantity > 0 && quantity <= 999) {
      CallService("grocery/add/" + room._id, {itemName: input, quantity: quantity}, itemResponseHandler);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

const itemResponseHandler = (data) => {
      setItems([data, ...items]);
      setInput("");
      setQuantity(1);
}

// Fetch groceryList
useEffect(() => {
  CallService("grocery/getList/" + room._id, {}, (data) => {
    // Reverse the fetched items so that the newest are first
    setItems(data.reverse());
  });
}, []);

const toggleAllPaid = () => {
  const updatedItems = items.map((item) => ({
    ...item,
    paid: false,
    cost: 0,
    purchased: false,
  }));

  setItems(updatedItems);

  updatedItems.forEach((updatedItem) => {
    CallService("grocery/update", updatedItem, (data) => {
    });
  });
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
          <button onClick={toggleAllPaid} className={styles.Button}>
            All Paid
          </button>
        </div>
        <p className={styles.purchasedText} style={{ visibility: items.length > 0 ? "visible" : "hidden" }}>
          Purchased
        </p>
        <p
            className={styles.costText}
            style={{ visibility: items.some((item) => item.purchased) ? "visible" : "hidden" }}
          >
          Cost of Item
        </p>
        <h3 className={styles.title} style={{ visibility: items.length > 0 ? "visible" : "hidden" }}>Items</h3>
        <h3 className={styles.title} style={{ display: items.length > 0 ? "none" : "block" }}>
          Your grocery list is empty. Add an item to get started!
        </h3>
        <ul className={styles.groceryList}>
          {items.map((item, index) => (
            <li key={index} className={styles.groceryItem}>
              <GroceryItem items={items} setItems={setItems} index={index} item={item} description={item.description} room={room}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroceryPage;
