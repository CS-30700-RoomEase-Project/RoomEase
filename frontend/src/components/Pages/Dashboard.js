import React from "react";
import { useNavigate } from "react-router-dom";
import BoxButton from "../Shared_components/Box_button";
import styles from "./Dashboard.module.css"; // Import Dashboard specific styles

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/register');
  };

  return (
    <div className={styles.dashboardAppContainer}>
      <div className={styles.dashboardBanner}>
        <div className={styles.signout}>
          <BoxButton 
            className="signout" 
            width={8} 
            height={8} 
            onClick={handleLogout} 
            numComponents={1} 
            message={"Sign Out"} 
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
