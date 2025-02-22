import React from "react";
import styles from "./GroceryPage.module.css";

function GroceryPage() {

  return (
    <div className={styles.registerAppContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.registerTitle}>Grocery Page</h2>
        <p className={styles.registerDescription}>Please sign in with your Google account to continue.</p>
      </div>
    </div>
  );
  
}

export default GroceryPage;