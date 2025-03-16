import { useEffect } from "react";
import GoogleSignIn from "../Shared_components/Login_button";
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  useEffect(() => {
    document.title = "RoomEase";
  }, []);

  return (
    <div className={styles.roomEaseContainer}>
      <div className={styles.gradientOverlay}></div>
      
      {/* Decorative elements */}
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>
      <div className={styles.decorCircle3}></div>
      <div className={styles.decorLine1}></div>
      <div className={styles.decorLine2}></div>

      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.navTitle}>RoomEase</h1>
          <GoogleSignIn />
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.textContent}>
            <h2 className={styles.mainTitle}>Simplify Roommate Living</h2>
            <p className={styles.mainDescription}>
              Organize chores, split expenses, and live stress-free with your roommates.
            </p>
            {/* <div className={styles.ctaButton}>
              Get Started
            </div> */}
          </div>
          
          <div className={styles.imageContent}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📋</div>
              <h3>Task Management</h3>
              <p>Assign and track household chores, and set house rules</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Expense Splitting</h3>
              <p>Easily divide and track shared costs including Bills & Grocries</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗓️</div>
              <h3>Shared Calendar</h3>
              <p>Coordinate schedules and events, setting shared quiet hours, etc.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2025 RoomEase. All rights reserved.</p>
        <p>
          <button className={styles.footerLink} onClick={() => alert("Privacy Policy Clicked")}>
            Privacy Policy
          </button>{" "}
          |{" "}
          <button className={styles.footerLink} onClick={() => alert("Terms of Service Clicked")}>
            Terms of Service
          </button>
        </p>
      </footer>
    </div>
  );
}
