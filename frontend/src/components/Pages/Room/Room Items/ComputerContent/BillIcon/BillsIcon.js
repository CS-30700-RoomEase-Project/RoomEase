import React from 'react';
import '../ComputerIcons.css';

function BillsIcon({ onClick }) {
    return (
        <div className="bill-icon" onClick={onClick} title='Manage Bills and Expenses'>
            <p className="dollar-s">$</p>
        </div>
    )
}

export default BillsIcon;