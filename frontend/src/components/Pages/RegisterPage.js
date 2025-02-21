import React from "react";
import GoogleSignIn from "../Shared_components/Login_button";
import styles from "./RegisterPage.module.css"; // Import CSS module
function RegisterPage() {
  return (
    <div className={styles.registerAppContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.registerTitle}>Welcome to RoomEase</h2>
        <p className={styles.registerDescription}>Please sign in with your Google account to continue.</p>
        <GoogleSignIn />
      </div>
    </div>
  );
}

export default RegisterPage;