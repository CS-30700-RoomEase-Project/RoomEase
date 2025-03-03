import React from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import './Room.css';
import Fridge from './Room Items/Fridge';
import Desk from './Room Items/Desk';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import Computer from './Room Items/Computer';
import Clock from './Room Items/Clock';
import BulletinBoard from './Room Items/BulletinBoard';
import TrashCan from './Room Items/TrashCan';
import Broom from './Room Items/Broom';
import NotificationButton from '../../Shared_components/NotificationBell/NotificationBell';

function Room() {
    const { roomId } = useParams(); // Gets the roomId from the URL
    const roomName = 'Room ' + roomId;

    const navigate = useNavigate();
    let userData = JSON.parse(localStorage.getItem('userData'));    
    /* TODO: Fetch room data from the backend */
    /* let roomData = JSON.parse(localStorage.getItem('currRoomData')); */

    return (
        <div className='appContainer'>
            <div className='roomBanner'>
                <h1 className='roomTitle'>{roomName}</h1>
                <Avatar />
            </div>
            <div className={'roomBackground'}>
                <Fridge />
                <Desk>
                    <Computer />
                </Desk>
                <Clock />
                <BulletinBoard />
                <TrashCan />
                <Broom />
            </div>
            <div className={'roomFloor'}/>
        </div>
    )
};

export default Room;