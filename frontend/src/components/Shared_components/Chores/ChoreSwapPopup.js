import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import styles from "./ChorePopup.module.css";

const ChoreSwapPopup = ({ isOpen, onClose, chores, roomId }) => {
    const [receiver, setReceiver] = useState("");
    const [users, setUsers] = useState([]);
    const [permanent, setPermanent] = useState(false);
    const [initiatorChores, setInitiatorChores] = useState([]);
    const [receiverChores, setReceiverChores] = useState([]);
    const [selectedInitiatorChores, setSelectedInitiatorChores] = useState([]);
    const [selectedReceiverChores, setSelectedReceiverChores] = useState([]);
    const [choreSwaps, setChoreSwaps] = useState([]);

    const storedUser = localStorage.getItem("userData");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = parsedUser ? parsedUser._id : null;

    useEffect(() => {
        setReceiver("");
        setPermanent(false);
        setInitiatorChores([]);
        setReceiverChores([]);
        setSelectedInitiatorChores([]);
        setSelectedReceiverChores([]);
    }, [isOpen]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/room/getMembers/${roomId}`);
                const data = await response.json();

                const storedUser = localStorage.getItem("userData");
                const parsedUser = JSON.parse(storedUser);
                const currentUserId = parsedUser._id;

                const filteredUsers = data.filter(user => user._id !== currentUserId);
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [roomId]);

    useEffect(() => {
        if (!receiver) return;

        const storedUser = localStorage.getItem("userData");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const currentUserId = parsedUser ? parsedUser._id : null;

        if (!currentUserId) return;

        const filteredInitiatorChores = chores.flatMap(chore =>
            chore.order
                .map((orderItem, index) => ({ ...chore, position: index + 1, assignedUserId: orderItem._id }))
                .filter(orderItem => orderItem.assignedUserId === currentUserId)
        );

        setInitiatorChores(filteredInitiatorChores);

        const filteredReceiverChores = chores.flatMap(chore =>
            chore.order
                .map((orderItem, index) => ({ ...chore, position: index + 1, assignedUserId: orderItem._id }))
                .filter(orderItem => orderItem.assignedUserId === receiver)
        );

        setReceiverChores(filteredReceiverChores);

    }, [receiver]);

    const handleChoreSelection = (chore, type) => {
        if (type === "initiator") {
            setSelectedInitiatorChores(prev => {
                const isAlreadySelected = prev.some(selected => selected._id === chore._id && selected.position === chore.position);
                if (isAlreadySelected) {
                    return prev.filter(selected => !(selected._id === chore._id && selected.position === chore.position));
                } else {
                    return [...prev, { ...chore, count: 1 }];
                }
            });
        } else {
            setSelectedReceiverChores(prev => {
                const isAlreadySelected = prev.some(selected => selected._id === chore._id && selected.position === chore.position);
                if (isAlreadySelected) {
                    return prev.filter(selected => !(selected._id === chore._id && selected.position === chore.position));
                } else {
                    return [...prev, { ...chore, count: 1 }];
                }
            });
        }
    };

    const handleCountChange = (choreId, position, count, type) => {
        if (type === "initiator") {
            setSelectedInitiatorChores(prev =>
                prev.map(chore =>
                    chore._id === choreId && chore.position === position
                        ? { ...chore, count: parseInt(count, 10) || 1 }
                        : chore
                )
            );
        } else {
            setSelectedReceiverChores(prev =>
                prev.map(chore =>
                    chore._id === choreId && chore.position === position
                        ? { ...chore, count: parseInt(count, 10) || 1 }
                        : chore
                )
            );
        }
    };

    const handleSendSwap = async () => {
        const storedUser = localStorage.getItem("userData");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const initiatorId = parsedUser ? parsedUser._id : null;
    
        if (!initiatorId || !receiver) {
            console.error("Missing initiatorId or receiverId");
            return;
        }
    
        const payload = {
            initiatorId, // Include the initiator's ID
            initiatorChores: selectedInitiatorChores,
            receiverChores: selectedReceiverChores,
            receiverId: receiver,
            permanent, 
            room: roomId
        };

        console.log(payload);
    
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "/api/chores/createSwapRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Swap request sent successfully:", data);
                onClose();
            } else {
                console.error("Error sending swap request:", data.message);
            }
        } catch (error) {
            console.error("Network error while sending swap request:", error);
        }
    };

    // Fetch chore swaps when the popup opens
    useEffect(() => {
        const fetchChoreSwaps = async () => {
            try {
                const storedUser = localStorage.getItem("userData");
                const parsedUser = storedUser ? JSON.parse(storedUser) : null;
                const userId = parsedUser ? parsedUser._id : null;

                if (!userId || !roomId) return;

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chores/getUserChoreSwaps/${roomId}/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setChoreSwaps(data);
                    console.log(choreSwaps);
                } else {
                    console.error("Error fetching chore swaps:", data.message);
                }
            } catch (error) {
                console.error("Error fetching chore swaps:", error);
            }
        };

        if (isOpen) {
            fetchChoreSwaps();
        }
    }, [isOpen, roomId]);

    const handleAcceptSwap = async (swapRequestId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chores/acceptSwapRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                
                body: JSON.stringify({
                    swapRequestId,
                    roomId
                })
            });

            if (response.ok) {
                onClose();
                console.log("Swap accepted successfully.");
            } else {
                console.error("Error accepting swap");
            }
        } catch (error) {
            console.error("Network error while accepting swap:", error);
        }
    };

    const handleRejectSwap = async (swapRequestId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "/api/chores/rejectSwapRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    swapRequestId,
                    roomId
                })
            });

            if (response.ok) {
                setChoreSwaps(choreSwaps.filter(swap => swap._id !== swapRequestId));
                console.log("Swap rejected successfully.");
            } else {
                console.error("Error rejecting swap");
            }
        } catch (error) {
            console.error("Network error while rejecting swap:", error);
        }
    };
    

    return (
        <Popup
            open={isOpen}
            modal
            nested
            onClose={onClose}
            contentStyle={{
                background: "white",
                width: "350px",
                maxWidth: "90%",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
            }}
            overlayStyle={{
                background: "rgba(15, 14, 14, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}

            
        >
            <div className={styles.modal}>
                <h6>Pending Swap Requests</h6>
                {choreSwaps.length > 0 ? (
                    choreSwaps
                        .filter((swap) => swap.receiver._id === currentUserId && !swap.accepted) // Ensure only pending swaps for the receiver
                        .length > 0 ? (
                        choreSwaps
                            .filter((swap) => swap.receiver._id === currentUserId && !swap.accepted)
                            .map((swap) => (
                                <div key={swap._id} className={styles.swapRequest}>
                                    <p><strong>{swap.initiator.username}</strong> wants to trade chores with you</p>

                                    <div className={styles.choreDetails}>
                                        <div>
                                            <h6>{swap.initiator.username}'s Chores:</h6>
                                            <ul>
                                                {swap.initiatorChores.map((choreObj, index) => (
                                                    <li key={index}>
                                                        {choreObj.chore.choreName} (Position: {choreObj.order}) {swap.permanent ? "permanent" : `Count: ${choreObj.count}` }
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h6>Your Chores:</h6>
                                            <ul>
                                                {swap.receiverChores.map((choreObj, index) => (
                                                    <li key={index}>
                                                        {choreObj.chore.choreName} (Position: {choreObj.order}) {swap.permanent ? "permanent" : `Count: ${choreObj.count}` }
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <button onClick={() => handleAcceptSwap(swap._id)}>Accept</button>
                                        <button onClick={() => handleRejectSwap(swap._id)}>Decline</button>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p>No pending swaps</p>
                    )
                ) : (
                    <p>No pending swaps</p>
                )}
                <h6>Accepted Swap Requests</h6>
                {choreSwaps.length > 0 ? (
                    choreSwaps
                        .filter((swap) => swap.accepted && (swap.initiator._id === currentUserId || swap.receiver._id === currentUserId))
                        .length > 0 ? (
                        choreSwaps
                            .filter((swap) => swap.accepted && (swap.initiator._id === currentUserId || swap.receiver._id === currentUserId))
                            .map((swap) => (
                                <div key={swap._id} className={styles.swapRequest}>
                                    <p>
                                        <strong>{swap.initiator.username}</strong> traded chores with <strong>{swap.receiver.username}</strong>
                                    </p>

                                    <div className={styles.choreDetails}>
                                        <div>
                                            <h6>{swap.initiator.username}'s Chores:</h6>
                                            <ul>
                                                {swap.initiatorChores.map((choreObj, index) => (
                                                    <li key={index}>
                                                        {choreObj.chore.choreName} (Position: {choreObj.order}) (Count: {choreObj.count})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h6>{swap.receiver.username}'s Chores:</h6>
                                            <ul>
                                                {swap.receiverChores.map((choreObj, index) => (
                                                    <li key={index}>
                                                        {choreObj.chore.choreName} (Position: {choreObj.order}) (Count: {choreObj.count})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            ))
                    ) : (
                        <p>No accepted swaps</p>
                    )
                ) : (
                    <p>No accepted swaps</p>
                )}

                <h6>Who to trade with?</h6>
                <select value={receiver} onChange={(e) => setReceiver(e.target.value)}>
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.username} ({user.email})
                        </option>
                    ))}
                </select>

                <h6>Make Permanent?</h6>
                <input type="checkbox" checked={permanent} onChange={(e) => setPermanent(e.target.checked)} />

                <h6>Chores You Can Offer</h6>
                <ul>
                    {initiatorChores.length > 0 ? (
                        initiatorChores.map((chore) => (
                            <li key={`${chore._id}-${chore.position}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedInitiatorChores.some(selected => selected._id === chore._id && selected.position === chore.position)}
                                    onChange={() => handleChoreSelection(chore, "initiator")}
                                />
                                {chore.choreName} (Position: {chore.position})
                                {!permanent && (
                                    <input
                                        type="number"
                                        className={styles.numInput}
                                        min="1"
                                        value={selectedInitiatorChores.find(selected => selected._id === chore._id && selected.position === chore.position)?.count || 1}
                                        onChange={(e) => handleCountChange(chore._id, chore.position, e.target.value, "initiator")}
                                    />
                                )}
                            </li>
                        ))
                    ) : (
                        <li>No chores available</li>
                    )}
                </ul>

                <h6>Chores You Can Receive</h6>
                <ul>
                    {receiverChores.length > 0 ? (
                        receiverChores.map((chore) => (
                            <li key={`${chore._id}-${chore.position}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedReceiverChores.some(selected => selected._id === chore._id && selected.position === chore.position)}
                                    onChange={() => handleChoreSelection(chore, "receiver")}
                                />
                                {chore.choreName} (Position: {chore.position})
                                {!permanent && (
                                    <input
                                        type="number"
                                        className={styles.numInput}
                                        min="1"
                                        value={selectedReceiverChores.find(selected => selected._id === chore._id && selected.position === chore.position)?.count || 1}
                                        onChange={(e) => handleCountChange(chore._id, chore.position, e.target.value, "receiver")}
                                    />
                                )}
                            </li>
                        ))
                    ) : (
                        <li>No chores available</li>
                    )}
                </ul>

                <button onClick={handleSendSwap}>Send</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </Popup>
    );
};

export default ChoreSwapPopup;
