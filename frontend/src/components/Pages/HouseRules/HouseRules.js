import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./HouseRules.module.css";
import CallService from "../../SharedMethods/CallService";

const defaultRules = [
  "These are your house rules",
  "Add, edit, or change rules below",
  "Change them as you like"
];

export default function Rules() {
  const { roomId } = useParams(); // Get roomId from URL parameters
  const [rules, setRules] = useState([]); // Store the list of rules
  const [newRule, setNewRule] = useState(""); // New rule input value
  const [editingIndex, setEditingIndex] = useState(null); // To track which rule is being edited
  const [editedRule, setEditedRule] = useState(""); // Store the edited rule text

  // Fetch rules when the component is mounted
  useEffect(() => {
    CallService(`rules/getList/${roomId}`, {}, (data) => {
      if (data) {
        // If the data is empty or undefined, add default rules
        const updatedRules = data && data.length ? data : [...defaultRules];
        setRules(updatedRules);
      } else {
        console.error("No data received from API");
      }
    });
  }, [roomId]);

  // Save new rule to local state when added
  const handleAddRule = () => {
    if (newRule.trim() !== "") {
      if (!defaultRules.includes(newRule)) {
        setRules((prevRules) => [...prevRules, newRule]);
        setNewRule(""); // Clear input field
        CallService("rules/add/" + roomId, { newRule: newRule }, (data) => {
          console.log("New Rule Added: " + newRule);
        });
      } else {
        alert("Cannot add default rules manually.");
      }
    }
  };

  // Remove rule from local state and update backend, but prevent removal of default rules
  const handleRemoveRule = (index) => {
    if (defaultRules.includes(rules[index])) {
      alert("You cannot remove the default rules.");
      return; // Prevent removing default rules
    }

    const ruleToRemove = rules[index];
    setRules((prevRules) => prevRules.filter((_, i) => i !== index));

    CallService(`rules/remove/${roomId}`, { text: ruleToRemove }, (data) => {
      console.log("Rule Removed: " + ruleToRemove);
    });
  };

  // Start editing a rule
  const handleEditRule = (index) => {
    setEditingIndex(index); // Set the rule being edited
    setEditedRule(rules[index]); // Set the edited rule's current value
  };

  // Save the edited rule and update backend, but prevent editing of default rules
  const handleSaveEditedRule = () => {
    if (editedRule.trim() !== "") {
      if (defaultRules.includes(rules[editingIndex])) {
        alert("You cannot edit the default rules.");
        return; // Prevent editing default rules
      }

      setRules((prevRules) => {
        const updatedRules = [...prevRules];
        updatedRules[editingIndex] = editedRule; // Update the rule in state
        return updatedRules;
      });

      CallService(`rules/edit/${roomId}`, { oldText: rules[editingIndex], newText: editedRule }, (data) => {
        console.log("Rule Edited: " + editedRule);
      });

      setEditingIndex(null); // Clear the editing state
      setEditedRule(""); // Clear the edited text
    }
  };

  return (
    <div className={styles.container}>
      <h2>House Rules</h2>
      <div className={styles.rulesList}>
        {rules.map((rule, index) => (
          <div key={index} className={styles.ruleItem}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedRule}
                  onChange={(e) => setEditedRule(e.target.value)}
                  className={styles.input}
                />
                <button onClick={handleSaveEditedRule} className={styles.saveButton}>Save</button>
                <button onClick={() => setEditingIndex(null)} className={styles.cancelButton}>Cancel</button>
              </>
            ) : (
              <>
                <p>{rule}</p>
                <button className={styles.editButton} onClick={() => handleEditRule(index)}>Edit</button>
                <button className={styles.removeButton} onClick={() => handleRemoveRule(index)}>Remove</button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="Add new rule"
          className={styles.input}
        />
        <button onClick={handleAddRule} className={styles.addButton}>Add Rule</button>
      </div>
    </div>
  );
}
