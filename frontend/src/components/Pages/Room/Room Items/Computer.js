"use client"
import { useNavigate } from "react-router-dom"
import BillsIcon from "./ComputerContent/BillIcon/BillsIcon"
import InviteIcon from "./ComputerContent/InviteIcon/InviteIcon"
import RoomSettingsIcon from "./ComputerContent/SettingsIcon/RoomSettingsIcon"
import "./computer.css"

function Computer({ handleInviteClick, handleSettingsClick, roomId, roomData }) {
  const navigate = useNavigate()

  const handleGoToBills = () => {
    navigate(`/room/${roomId}/bills`)
  }

  return (
    <div className="computer-container">
      <div className="monitor">
        <div className="monitor-frame">
          <div className="monitor-screen">
            <div className="screen-content">
              {roomId !== "master-room" && <RoomSettingsIcon onClick={handleSettingsClick} />}
              {roomId !== "master-room" && <InviteIcon onClick={handleInviteClick} />}
              {/* {(roomId === "master-room" || roomData.settings[1]) && <BillsIcon onClick={handleGoToBills} />} */}
              {(roomId === "master-room" || roomData?.settings?.[1]) && <BillsIcon onClick={handleGoToBills} />}
            </div>
          </div>
          <div className="monitor-logo"></div>
        </div>
        <div className="monitor-stand">
          <div className="stand-neck"></div>
          <div className="stand-base"></div>
        </div>
      </div>
    </div>
  )
}

export default Computer
