import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './ProfilePopUp.css';

export default function ProfilePopUp({ isOpen, onClose }) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    // const profilePicture = userData ? userData.profilePic : '';

    return (
        <Popup
            open={isOpen}
            modal
            nested
            onClose={onClose}
            contentStyle={{
                background: 'white', /* Modal background */
                width: '350px', /* Set modal width */
                maxWidth: '90%', /* Max width for responsiveness */
                padding: '20px', /* Padding around content */
                borderRadius: '12px', /* Rounded corners */
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', /* Shadow */
                textAlign: 'center', /* Center text */
            }}
            overlayStyle={{
                background: 'rgba(15, 14, 14, 0.5)', /* Dark semi-transparent background */
                display: 'flex',
                justifyContent: 'center', /* Center horizontally */
                alignItems: 'center', /* Center vertically */
                height: '100vh', /* Full viewport height */
            }}
        >
            <div className='modal'>
                <div className='content'>
                    <h4>Profile Settings</h4>
                </div>
                <div>
                    <button onClick={onClose}>
                        Close Settings
                    </button>
                </div>
            </div>
        </Popup>
    );
}
