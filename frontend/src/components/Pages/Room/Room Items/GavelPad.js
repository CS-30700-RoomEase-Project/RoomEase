// src/components/Pages/Room/Room Items/GavelPad.js
import React from "react";
import "./gavel-pad.css";

export default function GavelPad({ onClick }) {
  return (
    <div className="gavel-pad-container" onClick={onClick}>
      <div className="gavel-pad-base" />
      <div className="gavel-pad-top" />
    </div>
  );
}