import React from "react";
import style from "./FridgeLetter.module.css";
import letters from "./FridgeLetters.png";

function FridgeLetters({ visible }) {
  if (!visible) return null; // Do not render if not active
  return (
    <div className={style.container}>
      <img src={letters} alt="Fridge Letters" />
    </div>
  );
}

export default FridgeLetters;
