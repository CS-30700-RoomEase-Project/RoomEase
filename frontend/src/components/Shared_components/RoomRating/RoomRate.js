import { useEffect, useRef, useState } from "react";
import "./RoomRate.css";

const RoomRate = ({ onClose }) => {
  const getStoredData = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      return null;
    }
  };

  const storedUserData = getStoredData("userData");
  const storedRoommateIds = getStoredData("roommates") || [];

  const [roommates, setRoommates] = useState([]);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [ratings, setRatings] = useState({});
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchRoommateNames = async () => {
      if (fetchedRef.current || storedRoommateIds.length === 0) return;

      fetchedRef.current = true;

      try {
        const roommateData = await Promise.all(
          storedRoommateIds.map(async (userId) => {
            const response = await fetch(`http://localhost:5001/api/users/getUser?userId=${userId}`);
            if (!response.ok) throw new Error(`Failed to fetch user data for ${userId}`);
            const data = await response.json();
            return {
              userId,
              username: data.user?.username || "Unknown",
            };
          })
        );

        setRoommates(roommateData);
        if (roommateData.length > 0) {
          setSelectedRoommate(roommateData[0]);
        }
      } catch (error) {
        console.error("Error fetching roommate names:", error);
      }
    };

    fetchRoommateNames();
  }, []);

  const handleRatingChange = (category, value) => {
    if (!selectedRoommate) return;

    setRatings((prevRatings) => ({
      ...prevRatings,
      [selectedRoommate.userId]: {
        ...prevRatings[selectedRoommate.userId],
        [category]: value,
      },
    }));
  };

  const handleSubmitRatings = async () => {
    const storedRoomData = getStoredData("roomData");
    const roomId = storedRoomData?.roomId || "room123";

    const ratingData = {
      // senderId: storedUserData?.userId,
      roomId: roomId,
      recId: roommates.map((user) => user.userId),
      cleanRating: roommates.map((user) => ratings[user.userId]?.cleanRating || 0),
      noiseRating: roommates.map((user) => ratings[user.userId]?.noiseRating || 0),
      paymentRating: roommates.map((user) => ratings[user.userId]?.paymentRating || 0),
      rulesRating: roommates.map((user) => ratings[user.userId]?.rulesRating || 0),
      numRating: 1,
    };

    try {
      const response = await fetch("http://localhost:5001/api/rating/updateRating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingData),
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} - ${responseBody.message || 'Unknown error'}`);
      }

      alert("Ratings submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting ratings:", error);
      alert(`An error occurred while submitting ratings: ${error.message}`);
    }
  };

  return (
    <div className="modal">
      <div className="content">
        <h4>Rate Your Roommates</h4>

        {roommates.length === 0 ? (
          <p>Loading roommates...</p>
        ) : (
          <>
            <label htmlFor="roommate-select">Select Roommate:</label>
            <select
              id="roommate-select"
              onChange={(e) => {
                const selectedUserId = e.target.value;
                const selectedUser = roommates.find((user) => user.userId === selectedUserId);
                setSelectedRoommate(selectedUser);
              }}
              value={selectedRoommate?.userId || ""}
            >
              {roommates.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.username}
                </option>
              ))}
            </select>

            {selectedRoommate && (
              <div className="rating-group">
                {["cleanRating", "noiseRating", "paymentRating", "rulesRating"].map((category) => (
                  <div key={category} className="input-group">
                    <label>{category.replace("Rating", " Rating")}:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={ratings[selectedRoommate.userId]?.[category] || ""}
                      onChange={(e) => handleRatingChange(category, parseInt(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="button-group">
          <button className="save-button" onClick={handleSubmitRatings}>
            Submit Ratings
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomRate;
