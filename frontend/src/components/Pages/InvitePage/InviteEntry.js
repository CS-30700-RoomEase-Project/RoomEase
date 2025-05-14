import React, { useState } from 'react';
import style from './InvitePage.module.css'

function InviteEntry({invite}) {
    let userData = JSON.parse(localStorage.getItem('userData'));
    const [source, setSource] = useState(null);
    const [reciever, setReciever] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/getUser?userId=${invite.source}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.message);
            setSource(data.user);

            const r2 = await fetch(`${process.env.REACT_APP_API_URL}/api/users/getUser?userId=${invite.reciever}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!r2.ok) {
                throw new Error(`Server error: ${r2.status}`);
            }

            const data2 = await r2.json();
            console.log(data2.message);
            setReciever(data2.user);
            setLoading(false);
            
        } catch (err) {
            console.error("Error: ", err.message);
        }
    };

    const deleteInvite = async ({invite}) => {
        try {
            console.log(invite._id);
            console.log(invite);
            const response = await fetch("http://localhost:5001/api/invite/deleteInvite", {
                method: "DELETE",  // POST method to send data
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inviteId: invite._id,
                    deleterId: userData.userId,
                }),  
            });
            
            // Check if the response is OK (status 200)
            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                alert("Server responded with an error.");
                return;
            }

            window.location.reload();
        } catch (error) {
            console.log("Invite removal failed");
        }
    }

    React.useEffect(() => {
        console.log("DING");
        fetchUsers();
    }, []);
    console.log("oji");

    if(loading) return <h1>Loading...</h1>;
    return (
        <li className={style.inviteEntry}>
            <div className={style.inviteEntryTop}>
                <h1 className={style.inviteEntryTarget}>{reciever.username}:    {reciever.email}</h1>
                <div className={style.removeInvite} onClick={() => deleteInvite({invite})}>
                    <div className={style.removeInviteCrossLine} 
                        style={{
                            transform: 'rotate(45deg)', 
                            position: 'relative', 
                            top: '20%'
                        }
                    }/>
                    <div className={style.removeInviteCrossLine} 
                        style={{
                            transform: 'rotate(-45deg)',
                            position: 'relative',
                            top: '-50%'
                        }
                    }/>
                </div>
            </div>
            <div className={style.inviteEntryBottom}>
                <h1 className={style.inviteEntrySource}>Invite sent by: {source.username}</h1>
            </div>
        </li>
    );
}

export default InviteEntry;