import { useEffect } from "react";
import GoogleSignIn from "../../Shared_components/Login_button";
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  useEffect(() => {
    document.title = "RoomEase";
  }, []);

  return (
    <div className={styles.roomEaseContainer}>
      <div className={styles.gradientOverlay}></div>

      <nav className={styles.navbar}>
        <h1 className={styles.navTitle}>RoomEase</h1>
        <GoogleSignIn />
      </nav>

      <div className={styles.mainContent}>
        <h2 className={styles.mainTitle}>Simplify Roommate Living</h2>
        <p className={styles.mainDescription}>
          Organize chores, split expenses, and live stress-free with your roommates.
        </p>
      </div>

      <footer className={styles.footer}>
        <p>© 2025 RoomEase. All rights reserved.</p>
        <p>
          <a href="#" className={styles.footerLink}>
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className={styles.footerLink}>
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
}
