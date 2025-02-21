import React from "react";

//Shared button component that redirects to a specified page
const BoxButton = ({ className, width, height, onClick, numComponents = 3, message }) => { // 4 props: width, height, onClick, and numComponents
    // numComponents is default 3 unless something is passed in
    const handleClick = () => { // Function that calls the onClick prop
        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return ( //Button that calls the onClick function
        <div
            className={className}
            style={{ width: `${width / numComponents}vw`, height: `${height}vh`, display: 'flex', justifyContent: 'center', alignItems: 'center' }} //CSS styling for the button
            onClick={handleClick} // When the button is clicked, the handleClick function is called
        >
            {message}
        </div>
    );
};

export default BoxButton; //Export the BoxButton component