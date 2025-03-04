import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./GroceryPopUp.css";
import GroceryPage from "./GroceryPage.js"

    

export default function GroceryPopUp({ isOpen, onClose }) { 

    return (
        <Popup
            open={isOpen}
            modal
            nested
            onClose={onClose}
            className="grocery-popup-container"
            overlayClassName="grocery-popup-overlay"
            contentClassName="grocery-popup-content"
        >
            <div className="grocery-modal">
                <GroceryPage />
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </Popup>
    );
}
