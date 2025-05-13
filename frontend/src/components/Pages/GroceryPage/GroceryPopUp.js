import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import GroceryPage from "./GroceryPage.js";
import "./GroceryPopUp.css";

    

export default function GroceryPopUp({ room, isOpen, onClose }) { 

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
                <GroceryPage room = {room} onClick={onClose}/>
                {/* <button className="close-button" onClick={onClose}>
                    Close
                </button> */}
            </div>
        </Popup>
    );
}
