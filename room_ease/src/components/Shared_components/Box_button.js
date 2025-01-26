import React from "react";

//Shared button component that redirects to a specified page
const BoxButton = ({ width, height, redirectPage, numComponents = 3 }) => { // 4 props: width, height, redirectPage, and numComponent
    // numCoponents is deafult 3 unless something is passed in
    const handleClick = () => { // Function that redirects to the specified page
        window.location.href = redirectPage;
    };

    return ( //Button that redirects to the specified page
    <div
        className="box-button"
        style={{ width: `${width/numComponents}vw`, height: `${height}vh` }} //CSS styling for the button
        onClick={handleClick} // When the button is clicked, the handleClick function is called
    >
        Click Me {/* Text displayed on the button */}
    </div>
    );
};

export default BoxButton;//Export the BoxButton component