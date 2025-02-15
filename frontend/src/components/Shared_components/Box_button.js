import React from "react";

//Shared button component that redirects to a specified page
const BoxButton = ({ width, height, onClick, numComponents = 3 }) => { // 4 props: width, height, onClick, and numComponents
    // numComponents is default 3 unless something is passed in
    const handleClick = () => { // Function that calls the onClick prop
        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return ( //Button that calls the onClick function
        <div
            className="box-button"
            style={{ width: `${width / numComponents}vw`, height: `${height}vh` }} //CSS styling for the button
            onClick={handleClick} // When the button is clicked, the handleClick function is called
        >
            Click Me {/* Text displayed on the button */}
        </div>
    );
};

export default BoxButton; //Export the BoxButton component