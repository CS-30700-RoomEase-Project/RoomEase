import React from 'react';

/**
 * Broom component to represent a trash can item in the room
 */ 
const Broom = () => {
    return (
        <div className="broom" style={{transform: 'rotate(10deg)'}}>
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
