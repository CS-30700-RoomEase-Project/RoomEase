import React from 'react';
import '../ComputerIcons.css';

function InviteIcon({ onClick }) {
    return (
        <div className="bill-icon" onClick={onClick} title='Manage Bills and Expenses'>
            <div className="vertical-dollar-line">
                <p className="dollar-s">S</p>
            </div>
        </div>
    )
}

export default InviteIcon;