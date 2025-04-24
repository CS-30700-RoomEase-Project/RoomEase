"use client"

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./MyReview.module.css"; // Import module CSS

const MyReview = ({ isOpen, onClose }) => {
  const getStoredData = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      return null;
    }
  };

  const userIdFromStorage = localStorage.getItem("userId");

  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRatings = async () => {
      setLoading(true);

      try {
        const roomData = getStoredData("roomData");
        const roomId = roomData?._id?.toString();
        if (!roomId) {
          console.warn("No roomId found, skipping fetch");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5001/api/ratingFetch/getRating", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });

        if (!response.ok) throw new Error("Failed to fetch ratings data");

        const ratingsJson = await response.json();

        if (ratingsJson?.ratings) {
          setRatings(ratingsJson.ratings);
          localStorage.setItem("ratings", JSON.stringify(ratingsJson.ratings));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        setLoading(false);
      }
    };

    fetchRatings();
  }, [isOpen]);

  const userRatings = ratings[userIdFromStorage] || {};
  console.log("User Ratings:", userRatings);
  const renderStarRating = (rating) => {
    const numericRating = Number.parseFloat(rating) || 0;
    const roundedRating = Math.round(numericRating);
    const clampedRating = Math.max(0, Math.min(10, roundedRating));

    return (
      <div className="flex">
        {[...Array(10)].map((_, i) => (
          <Star 
            key={`star-${i}`} 
            className={`w-3 h-3 ${i < clampedRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            fill={i < clampedRating ? "gold" : "none"}
            strokeWidth={1.5}
          />
        ))}
        <span className={`${styles.ratingValue}`}>({clampedRating}/10)</span>
      </div>
    );
  };

  return (
    isOpen && (
      <div className={styles.modal}>
        <div className={styles.content}>
          <h4 className="text-white">My Ratings</h4>
          {loading ? (
            <p className="text-white">Loading ratings...</p>
          ) : (
            <div className={styles.ratingGroup}>
              <div className={styles.ratingCategory}>
                <strong>Cleanliness:</strong>
                {renderStarRating(userRatings.cleanlinessRating || 0)}
              </div>
              <div className={styles.ratingCategory}>
                <strong>Noise Level:</strong>
                {renderStarRating(userRatings.noiseLevelRating || 0)}
              </div>
              <div className={styles.ratingCategory}>
                <strong>Payment Timeliness:</strong>
                {renderStarRating(userRatings.paymentTimelinessRating || 0)}
              </div>
              <div className={styles.ratingCategory}>
                <strong>Rule Adherence:</strong>
                {renderStarRating(userRatings.ruleAdherenceRating || 0)}
              </div>
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MyReview;
