// import React from "react";
// import "./App.css";
// import BoxButton from "./components/Shared_components/Box_button"; //Import BoxButton component

// const App = () => {
//   return (
//     <div className="app-container flex items-center justify-center min-h-screen">
//       <div className="flex space-x-4">
//         <BoxButton width={90} height={80} redirectPage="https://example.com" numComponents = {3} />
//         <BoxButton width={90} height={80} redirectPage="https://example.com" numComponents = {3} />
//         <BoxButton width={90} height={80} redirectPage="https://example.com" numComponents={3} />
//       </div>
//     </div>
//   );
// };

// export default App;
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/")
      .then(response => setMessage(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return <div>{message} ON FRONTEND</div>;
}

export default App;
