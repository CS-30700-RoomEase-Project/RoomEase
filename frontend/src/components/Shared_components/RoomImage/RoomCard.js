import { useEffect, useState } from "react";

const RoomCard = ({ roomId }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchRoomImage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/room/roomImage/${roomId}`
        );
        if (response.ok) {
          const blob = await response.blob();
          setImageUrl(URL.createObjectURL(blob));
        } else {
          console.warn("Image not found for room", roomId);
        }
      } catch (error) {
        console.error("Error fetching room image:", error);
      }
    };

    fetchRoomImage();
  }, [roomId]);

  return (
    <div className="room-card">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Room"
          style={{ width: "100%", height: "auto", borderRadius: "10px" }}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default RoomCard;
