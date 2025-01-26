import React from "react";
import "./App.css";
import BoxButton from "./components/Shared_components/Box_button"; //Import BoxButton component

const App = () => {
  return (
    <div className="app-container flex items-center justify-center min-h-screen">
      <div className="flex space-x-4">
        <BoxButton width={90} height={80} redirectPage="https://example.com" numComponents = {3} />
        <BoxButton width={90} height={80} redirectPage="https://example.com" numComponents = {3} />
        <BoxButton width={90} height={80} redirectPage="https://example.com" numComponents={3} />
      </div>
    </div>
  );
};

export default App;
