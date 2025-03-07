import React from 'react';
import Broom from './Broom';
import TrashCan from './TrashCan';

const ChoreItems = () => {
    return (
        <div className='choreItems' title='Chores'>
            <Broom />
            <TrashCan />
        </div>
    );
}

export default ChoreItems;