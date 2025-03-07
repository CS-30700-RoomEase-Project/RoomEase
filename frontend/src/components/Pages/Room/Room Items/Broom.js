import React from 'react';

/**
 * Broom component to represent a trash can item in the room
 */ 
const Broom = ({ onClick }) => {
    return (
        <div className="broom" onClick={onClick} style={{ cursor: 'pointer' , transform: 'rotate(10deg)'}}>
            <div className="broomHandle"/>
            <div className="broomHead">
                <div className='broomBristle'/>
                <div className='broomBristle'/>
                <div className='broomBristle'/>
                <div className='broomBristle'/>
                <div className='broomBristle'/>
            </div>
        </div>
    );
};

export default Broom;
