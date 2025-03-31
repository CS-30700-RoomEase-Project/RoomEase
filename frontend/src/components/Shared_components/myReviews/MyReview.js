import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To extract roomId from URL params

let globalRatings = {};

const MyReview = ({ isOpen, onClose }) => {
    const getStoredData = (key) => {
        try {
          const data = localStorage.getItem(key);
          console.log(`Data fetched for ${key}:`, data); // Log the data being fetched from localStorage
          return data ? data : null;  // Directly return the raw value
        } catch (error) {
          console.error(`Error parsing ${key} from localStorage:`, error);
          return null;
        }
      };
      
     
      

  const storedRoommateIds = getStoredData("roommates") || [];
  const storedRoomIdFromStorage = getStoredData("roomData")?.roomId;
  const { roomId: roomIdFromParams } = useParams();

  const storedRoomId = storedRoomIdFromStorage || roomIdFromParams;
  const userIdFromStorage = getStoredData("userId");  // Get the userId from localStorage
  console.log("userIdFromStorage:", userIdFromStorage);  // Log the fetched userId to check if it's correct
  
  const [roommates, setRoommates] = useState([]);
  const [ratings, setRatings] = useState(getStoredData("ratings") || {});
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchRoommateRatings = async () => {
      if (!storedRoomId || storedRoommateIds.length === 0 || hasFetched) return;

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

        const ratingsData = await fetch("http://localhost:5001/api/ratingFetch/getRating", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: storedRoomId }),
        });

        if (!ratingsData.ok) throw new Error("Failed to fetch ratings data");

        const ratingsJson = await ratingsData.json();

        if (ratingsJson && ratingsJson.ratings) {
          const ratingsByUserId = ratingsJson.ratings;
          if (JSON.stringify(ratingsByUserId) !== JSON.stringify(globalRatings)) {
            globalRatings = ratingsByUserId;
            setRatings(globalRatings);
            localStorage.setItem("ratings", JSON.stringify(globalRatings));
          }
        }

        setHasFetched(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roommate ratings:", error);
        setLoading(false);
      }
    };

    fetchRoommateRatings();
  }, [storedRoommateIds, storedRoomId, hasFetched, ratings]);

  // Filter roommates to only show the one with the matching userId
  const filteredRoommates = roommates.filter(roommate => String(roommate.userId) === String(userIdFromStorage)); 
  console.log("Filtered roommates: ", filteredRoommates); // Log the filtered roommates to check if it's correct
  console.log("Ratings: ", String(userIdFromStorage)); // Log the ratings to check if it's correct

  // Helper function to render star ratings
  const renderStarRating = (rating) => {
    // For example: if rating = 10, return 5 stars, if rating = 5, return 2.5 stars
    const fullStars = Math.floor(rating / 2); // Number of full stars (0 to 5)
    const halfStars = rating % 2 !== 0 ? 1 : 0; // 1 if half-star, 0 if no half-star
    const totalStars = fullStars + halfStars;

    return (
      <div className="star-rating">
        {Array.from({ length: totalStars }, (_, index) => (
          <span key={index} className="star filled">
            ★
          </span>
        ))}
        {totalStars < 5 && (
          <span className="star">
            ★
          </span>
        )}
      </div>
    );
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="content">
          <h4>Roommate Ratings</h4>

          {loading ? (
            <p>Loading ratings...</p>
          ) : (
            <>
              {filteredRoommates.length === 0 ? (
                <p>No matching roommate found.</p>
              ) : (
                <div className="rating-group">
                  {filteredRoommates.map((roommate) => {
                    const roommateRatings = ratings[roommate.userId];

                    return (
                      <div key={roommate.userId} className="roommate-rating">
                        <h5>{roommate.username}</h5>
                        <div className="rating-category">
                          <strong>Cleanliness:</strong>
                          {renderStarRating(roommateRatings?.cleanlinessRating || 0)}
                        </div>
                        <div className="rating-category">
                          <strong>Noise Level:</strong>
                          {renderStarRating(roommateRatings?.noiseLevelRating || 0)}
                        </div>
                        <div className="rating-category">
                          <strong>Payment Timeliness:</strong>
                          {renderStarRating(roommateRatings?.paymentTimelinessRating || 0)}
                        </div>
                        <div className="rating-category">
                          <strong>Rule Adherence:</strong>
                          {renderStarRating(roommateRatings?.ruleAdherenceRating || 0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <div className="button-group">
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MyReview;
