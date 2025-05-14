import { Html } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import { DoubleSide } from 'three';
import './QuestBell.css';

const QuestBoard = ({ position = [0, 1, 0], rotation = [0, 0, 0] }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser?._id;
    const storedRoom = localStorage.getItem("roomData");
    const parsedRoom = JSON.parse(storedRoom);
    const roomId = parsedRoom?._id;

    if (!userId || !roomId) {
      setError("User or Room not found. Please log in and select a room.");
      setLoading(false);
      return;
    }

    const fetchQuests = async () => {
      try {
        if (!hasFetched.current) {
          await fetch(`${process.env.REACT_APP_API_URL}/api/room/checkAndGenerateQuests/${userId}`, {
            method: 'POST'
          });
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/room/quests-in-room?userId=${userId}&roomId=${roomId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setQuests([]);
          } else {
            throw new Error("Failed to fetch quests");
          }
        } else {
          const data = await response.json();
          setQuests(data);
        }
      } catch (error) {
        setError("Failed to load quests.");
      }
      setLoading(false);
    };

    fetchQuests();
    hasFetched.current = true;
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const squares = [];
  const size = 1.6;
  const rows = 8;
  const cols = 8;
  const squareSize = size / rows;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      squares.push(
        <mesh
        key={`${x}-${y}`}
        position={[
          (x - rows/2 + 0.5) * squareSize,
          (y - cols/2 + 0.5) * squareSize,
          0.06,              // ← push it up a bit more
        ]}
      >
        <planeGeometry args={[squareSize, squareSize]} />
        <meshStandardMaterial
          side={DoubleSide}           // ← render front and back
          color={(x + y) % 2 === 0 ? '#fff' : '#000'} 
        />
      </mesh>
      
      );
    }
  }

  return (
    <group position={position} rotation={rotation}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={togglePopup}
      >
        <boxGeometry args={[size, size, 0.1]} />
        <meshStandardMaterial color={hovered ? '#cccccc' : '#888888'} />
      </mesh>
      {squares}

      {hovered && (
        <Html position={[0, size / 2 + 0.1, 0]}>
          <div className="tooltip" style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>
            Quests
          </div>
        </Html>
      )}

      {isOpen && (
        <Html position={[0, size / 2 + 0.6, 0]} center>
          <Popup open={isOpen} onClose={() => setIsOpen(false)} arrow={false} position="bottom">
            <div className='dropdown'>
              <div className='questsContainer'>
                <h2>Quests</h2>
                {loading ? (
                  <p>Loading quests...</p>
                ) : error ? (
                  <p className='errorText'>{error}</p>
                ) : quests.length === 0 ? (
                  <p>No quests available in this room.</p>
                ) : (
                  <ul>
                    {quests.map(quest => (
                      <li key={quest._id} className='questItem'>
                        <strong>{quest.type}</strong>: {quest.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Popup>
        </Html>
      )}
    </group>
  );
};

export default QuestBoard;
