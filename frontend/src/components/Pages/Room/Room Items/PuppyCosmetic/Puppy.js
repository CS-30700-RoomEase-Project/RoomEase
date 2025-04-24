import React from "react";
import puppy from "./puppy.png";
import style from "./Puppy.module.css";

// New: accept the visible prop and conditionally render
function Puppy({ visible }) {
  if (!visible) return null; // do not render when not active
  return (
    <div className={style.container}>
      {/* Sleeping animation Zs */}
      <span className={style.sleepZ} style={{ animationDelay: "0s" }}>
        Z
      </span>
      <span className={style.sleepZ} style={{ animationDelay: "2s" }}>
        Z
      </span>
      <span className={style.sleepZ} style={{ animationDelay: "4s" }}>
        Z
      </span>
      <img src={puppy} className={style.img} alt="Puppy" />
    </div>
  );
}

export default Puppy;
