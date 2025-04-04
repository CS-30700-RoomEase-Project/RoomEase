// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import styles from "./RoomClauses.module.css";
// import CallService from "../../SharedMethods/CallService"

// export default function Clauses() {
//   const { roomId, userId } = useParams(); // Get roomId from URL parameters
//   const [clauses, setClauses] = useState([]); // Store the list of clauses
//   const [newClause, setNewClause] = useState(""); // New clause input value
//   const [editingIndex, setEditingIndex] = useState(null); // To track which clause is being edited
//   const [editedClause, setEditedClause] = useState(""); // Store the edited clause text

//   // Fetch clauses when the component is mounted
//   useEffect(() => {
//     // Simulating fetching clauses from local storage or mock data
//     const fetchedClauses = [
//       "This is your roommate clause",
//       "Add, edit, or remove clauses on the left"
//     ];
//     setClauses(fetchedClauses);
//   }, [roomId]);

//   // Save new clause to local state when added
//   const handleAddClause = () => {
//     if (newClause.trim() !== "") {
//       setClauses((prevClauses) => [...prevClauses, newClause]);
//       setNewClause(""); // Clear input field
//       CallService("clauses/add/" + roomId, { newClause : newClause}, (data) => {
//         console.log("New Clause Added: " + newClause);
//       });
//     }
//   };

//   // Remove clause from local state
//   const handleRemoveClause = (index) => {
//     setClauses((prevClauses) => prevClauses.filter((_, i) => i !== index));
//   };

//   // Start editing a clause
//   const handleEditClause = (index) => {
//     setEditingIndex(index); // Set the clause being edited
//     setEditedClause(clauses[index]); // Set the edited clause's current value
//   };

//   // Save the edited clause
//   const handleSaveEditedClause = () => {
//     if (editedClause.trim() !== "") {
//       setClauses((prevClauses) => {
//         const updatedClauses = [...prevClauses];
//         updatedClauses[editingIndex] = editedClause; // Update the clause in state
//         return updatedClauses;
//       });
//       setEditingIndex(null); // Clear the editing state
//       setEditedClause(""); // Clear the edited text
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Roommate Clauses</h2>
//       <div className={styles.clausesList}>
//         {clauses.map((clause, index) => (
//           <div key={index} className={styles.clauseItem}>
//             {editingIndex === index ? (
//               <>
//                 <input
//                   type="text"
//                   value={editedClause}
//                   onChange={(e) => setEditedClause(e.target.value)}
//                   className={styles.input}
//                 />
//                 <button onClick={handleSaveEditedClause} className={styles.saveButton}>Save</button>
//                 <button onClick={() => setEditingIndex(null)} className={styles.cancelButton}>Cancel</button>
//               </>
//             ) : (
//               <>
//                 <p>{clause}</p>
//                 <button className={styles.editButton} onClick={() => handleEditClause(index)}>Edit</button>
//                 <button className={styles.removeButton} onClick={() => handleRemoveClause(index)}>Remove</button>
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className={styles.formGroup}>
//         <input
//           type="text"
//           value={newClause}
//           onChange={(e) => setNewClause(e.target.value)}
//           placeholder="Add new clause"
//           className={styles.input}
//         />
//         <button onClick={handleAddClause} className={styles.addButton}>Add Clause</button>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./RoomClauses.module.css";
import CallService from "../../SharedMethods/CallService";

export default function Clauses() {
  const { roomId, userId } = useParams(); // Get roomId from URL parameters
  const [clauses, setClauses] = useState([]); // Store the list of clauses
  const [newClause, setNewClause] = useState(""); // New clause input value
  const [editingIndex, setEditingIndex] = useState(null); // To track which clause is being edited
  const [editedClause, setEditedClause] = useState(""); // Store the edited clause text

  // Fetch clauses when the component is mounted
  useEffect(() => {
    // Simulating fetching clauses from local storage or mock data
      // if (room && room._id) {
      //   CallService("notes/getList/" + room._id, {}, (data) => {
      //     console.log("Fetched data:", data);
      //     if (data) {
      //       setNotes(data);
      //     } else {
      //       console.error("No data received from API");
      //     }
      //   });
      // }
    
    const fetchedClauses = [
      "This is your roommate clause",
      "Add, edit, or remove clauses on the left"
    ];
    setClauses(fetchedClauses);
  }, [roomId]);

  // Save new clause to local state when added
  const handleAddClause = () => {
    if (newClause.trim() !== "") {
      setClauses((prevClauses) => [...prevClauses, newClause]);
      setNewClause(""); // Clear input field
      CallService("clauses/add/" + roomId, { newClause: newClause }, (data) => {
        console.log("New Clause Added: " + newClause);
      });
    }
  };

  // Remove clause from local state and update backend
  const handleRemoveClause = (index) => {
    const clauseToRemove = clauses[index];
    setClauses((prevClauses) => prevClauses.filter((_, i) => i !== index));

    CallService(`clauses/remove/${roomId}`, { text: clauseToRemove }, (data) => {
      console.log("Clause Removed: " + clauseToRemove);
    });
  };

  // Start editing a clause
  const handleEditClause = (index) => {
    setEditingIndex(index); // Set the clause being edited
    setEditedClause(clauses[index]); // Set the edited clause's current value
  };

  // Save the edited clause and update backend
  const handleSaveEditedClause = () => {
    if (editedClause.trim() !== "") {
      setClauses((prevClauses) => {
        const updatedClauses = [...prevClauses];
        updatedClauses[editingIndex] = editedClause; // Update the clause in state
        return updatedClauses;
      });

      CallService(`clauses/edit/${roomId}`, { oldText: clauses[editingIndex], newText: editedClause }, (data) => {
        console.log("Clause Edited: " + editedClause);
      });

      setEditingIndex(null); // Clear the editing state
      setEditedClause(""); // Clear the edited text
    }
  };

  return (
    <div className={styles.container}>
      <h2>Roommate Clauses</h2>
      <div className={styles.clausesList}>
        {clauses.map((clause, index) => (
          <div key={index} className={styles.clauseItem}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedClause}
                  onChange={(e) => setEditedClause(e.target.value)}
                  className={styles.input}
                />
                <button onClick={handleSaveEditedClause} className={styles.saveButton}>Save</button>
                <button onClick={() => setEditingIndex(null)} className={styles.cancelButton}>Cancel</button>
              </>
            ) : (
              <>
                <p>{clause}</p>
                <button className={styles.editButton} onClick={() => handleEditClause(index)}>Edit</button>
                <button className={styles.removeButton} onClick={() => handleRemoveClause(index)}>Remove</button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          value={newClause}
          onChange={(e) => setNewClause(e.target.value)}
          placeholder="Add new clause"
          className={styles.input}
        />
        <button onClick={handleAddClause} className={styles.addButton}>Add Clause</button>
      </div>
    </div>
  );
}
