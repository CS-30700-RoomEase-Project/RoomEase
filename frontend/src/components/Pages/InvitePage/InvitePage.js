import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InviteEntry from './InviteEntry';
import style from './InvitePage.module.css';

function InvitePage() {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const { roomId } = useParams(); // Gets the roomId from the URL
    const [roomData, setRoomData] = useState(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRoomData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/room/getRoom?roomId=${roomId}&userId=${userData.userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.message);
            setRoomData(data.room);
            setLoading(false);
            console.log(roomData);

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {   
        fetchRoomData();
    }, [roomId]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
          sendInvite();
        }
    };

    const sendInvite = async () => {
        setInput("");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.trim() !== "" && emailRegex.test(input)) {
            // Send invite
            try {
                console.log("userId: ", userData.userId);
                const response = await fetch(process.env.REACT_APP_API_URL + "/api/invite/sendInvite", {
                    method: "POST",  // POST method to send data
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        senderId: userData.userId,
                        recieverEmail: input,
                        roomId: roomId
                    }),  
                });

                // Check if the response is OK (status 200)
                if (!response.ok) {
                    console.error(`Error: ${response.status} - ${response.statusText}`);
                    alert("Server responded with an error.");
                    return;
                }

                await fetchRoomData();
                const result = await response.json();
                alert(result.message);
            } catch (error) {
                console.log("Invite removal failed");
            }
           // window.location.reload();  // Force reload all React components 
        } else {
            alert("Please enter a valid email address.");
        }
    };

    if (loading) return <div>Loading...</div>;
    else if (error) return <div>Error: {error}</div>;

    else return (
        <div className={style.invitePageContainer}>
            <div className={style.invitePageBanner}>
                <h1 className={style.invitePageTitle}>{roomData.roomName}'s Outgoing Invites</h1>
            </div>
            <div className={style.invitePageContent}>
                <ul className={style.invitePageInvites}>
                    <div className={style.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Enter email of the person you want to invite"
                            className={style.inputBox}
                        />

                        <div className={style.inviteButton} onClick={sendInvite}>
                            <h1 className={style.inviteButtonText}>Invite User</h1>
                        </div>
                    </div>

                    {Array.isArray(roomData.outGoingInvites) &&
                        roomData.outGoingInvites.map((invite) => (
                            <InviteEntry
                                key={invite._id}
                                invite={invite}
                            />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default InvitePage;