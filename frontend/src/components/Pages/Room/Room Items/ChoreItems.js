import React from 'react';
import Broom from './Broom';
import TrashCan from './TrashCan';

const ChoreItems = ({onClick}) => {
    return (
        <div className='choreItems' title='Chores' onClick={onClick}>
            <Broom />
            <TrashCan />
        </div>
    );
}

export default ChoreItems;