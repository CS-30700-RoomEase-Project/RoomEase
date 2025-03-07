import React from 'react';
import '../ComputerIcons.css';

function InviteIcon({ onClick }) {
    return (
        <div className="invite-icon" onClick={onClick} title='Manage Invites'>
            <div className="vertical-plus-line"/>
            <div className="horizontal-plus-line"/>
        </div>
    )
}

export default InviteIcon;