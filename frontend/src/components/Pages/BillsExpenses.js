import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationBell from '../Shared_components/NotificationBell/NotificationBell';
import AvatarButton from '../Shared_components/AvatarButton/AvatarButton';
import styles from './BillsExpenses.module.css';

const BillsExpenses = () => {
  const { roomId } = useParams(); // Get roomId from URL
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]); // List of roommates

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsiblePeople: [],
    paymaster: '',
    isRecurring: false,
    frequency: '',
    customFrequency: ''
  });
  const [newPerson, setNewPerson] = useState("");

  // For pop-up modal editing
  const [selectedBill, setSelectedBill] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsiblePeople: [],
    paymaster: '',
    isRecurring: false,
    frequency: '',
    customFrequency: ''
  });
  
  // Dropdown toggles for responsible people in add and edit forms
  const [respDropdownOpen, setRespDropdownOpen] = useState(false);
  const [editRespDropdownOpen, setEditRespDropdownOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData')) || {
    username: 'Guest',
    userId: null,
    profilePic: '',
  };

  // Fetch bills for the current room
  useEffect(() => {
    if (roomId) {
      fetch(`http://localhost:5001/api/bills/getBills/${roomId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched bills data:", data);
          if (Array.isArray(data)) {
            setBills(data);
          } else if (Array.isArray(data.bills)) {
            setBills(data.bills);
          } else {
            console.error("Unexpected bills response structure", data);
            setBills([]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [roomId]);

  // Fetch room users (roommates) from the room endpoint
  useEffect(() => {
    if (roomId) {
      fetch(`http://localhost:5001/api/room/getRoom?roomId=${roomId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched room data:", data);
          // Check if the room endpoint returns users directly...
          if (data && data.room && data.room.users && Array.isArray(data.room.users)) {
            setRoomUsers(data.room.users);
          }
          // ...or if it returns an array of usernames (like "turns")
          else if (data && data.room && data.room.turns && Array.isArray(data.room.turns)) {
            // Map the usernames to objects with _id and username.
            const users = data.room.turns.map((username) => ({
              _id: username, // if you don't have a unique id, use the username
              username
            }));
            setRoomUsers(users);
          } else {
            console.error("Room users not found in response", data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [roomId]);

  // Update new bill form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update new responsible person input (for manual entry)
  const handleNewPersonChange = (e) => {
    setNewPerson(e.target.value);
  };

  // Add a person manually to the responsiblePeople array
  const handleAddPerson = () => {
    if (newPerson.trim() !== "") {
      setFormData({
        ...formData,
        responsiblePeople: [
          ...formData.responsiblePeople,
          { _id: null, name: newPerson.trim(), paid: false }
        ]
      });
      setNewPerson("");
    }
  };

  // Set paymaster to current user (for add form)
  const handleSetMeAsPaymaster = () => {
    setFormData({ ...formData, paymaster: userData.username });
  };

  // Helper: Parse date string into a Date object
  const parseDueDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  };

  // Handle new bill submission using localized endpoints
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting new bill:", formData);
    const newBill = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate ? parseDueDate(formData.dueDate) : null,
      responsible: formData.responsiblePeople,
      paymaster: formData.paymaster,
      isRecurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : null,
      customFrequency:
        formData.isRecurring && formData.frequency === 'custom'
          ? parseInt(formData.customFrequency)
          : null
    };

    fetch(`http://localhost:5001/api/bills/addBill/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBill),
    })
      .then((res) => res.json())
      .then((savedBill) => {
        console.log("Saved bill:", savedBill);
        setBills([...bills, savedBill]);
        // Reset form
        setFormData({
          title: '',
          amount: '',
          dueDate: '',
          responsiblePeople: [],
          paymaster: '',
          isRecurring: false,
          frequency: '',
          customFrequency: ''
        });
      })
      .catch((err) => console.error(err));
  };

  // Sort bills by due date
  const sortedBills = bills.slice().sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // When a bill is clicked, open the edit popup
  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setEditFormData({
      title: bill.title,
      amount: bill.amount,
      dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
      responsiblePeople: bill.responsible || [],
      paymaster: bill.paymaster || '',
      isRecurring: bill.isRecurring || false,
      frequency: bill.frequency || '',
      customFrequency: bill.customFrequency || ''
    });
  };

  // Update edit form fields for text inputs
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // "Me" button for paymaster in edit form
  const handleSetMeAsPaymasterEdit = () => {
    setEditFormData({ ...editFormData, paymaster: userData.username });
  };

  // Toggle the 'paid' status for a responsible person in edit form
  const handleTogglePaid = (index) => {
    const updatedPeople = editFormData.responsiblePeople.map((person, idx) => {
      if (idx === index) {
        return { ...person, paid: !person.paid };
      }
      return person;
    });
    setEditFormData({ ...editFormData, responsiblePeople: updatedPeople });
  };

  // Handle saving changes for a bill (update endpoint)
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    const parsedAmount = parseFloat(editFormData.amount);
    const updatedBill = {
      title: editFormData.title,
      amount: parsedAmount,
      dueDate: editFormData.dueDate ? parseDueDate(editFormData.dueDate) : null,
      responsible: editFormData.responsiblePeople,
      paymaster: editFormData.paymaster,
      isRecurring: editFormData.isRecurring,
      frequency: editFormData.isRecurring ? editFormData.frequency : null,
      customFrequency:
        editFormData.isRecurring && editFormData.frequency === 'custom'
          ? parseInt(editFormData.customFrequency)
          : null,
      isAmountPending: parsedAmount > 0 ? false : true
    };

    fetch(`http://localhost:5001/api/bills/updateBill/${selectedBill._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBill),
    })
      .then((res) => res.json())
      .then((data) => {
        setBills(bills.map((bill) => (bill._id === selectedBill._id ? data : bill)));
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  // Handle deleting a bill
  const handleDelete = () => {
    if (!selectedBill) return;
    fetch(`http://localhost:5001/api/bills/deleteBill/${selectedBill._id}/${roomId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setBills(bills.filter((bill) => bill._id !== selectedBill._id));
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  // Handler to navigate back to the Room page
  const handleBackToRoom = () => {
    navigate(`/room/${roomId}`);
  };

  // Handler to mark a recurring bill as paid
  const handleMarkAsPaid = (billId) => {
    fetch(`http://localhost:5001/api/bills/markAsPaid/${billId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((updatedBill) => {
        setBills(bills.map(bill => bill._id === updatedBill._id ? updatedBill : bill));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.billsAppContainer}>
      {/* Top Banner with Back to Room Button */}
      <div className={styles.billsBanner}>
        <button onClick={handleBackToRoom} className={styles.backButton}>
          Back to Room
        </button>
        <div className={styles.header}>
          <h1>{userData.username}'s Bills & Expenses</h1>
        </div>
        <NotificationBell />
        <AvatarButton imageUrl={userData.profilePic} />
      </div>

      {/* Main Content Area */}
      <div className={styles.billsContent}>
        <h2>Add New Bill/Expense</h2>
        <form onSubmit={handleSubmit} className={styles.billForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          {/* Recurring Options */}
          <div className={styles.formGroup}>
            <label htmlFor="isRecurring">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
              />
              Recurring
            </label>
          </div>
          {formData.isRecurring && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="frequency">Frequency:</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {formData.frequency === 'custom' && (
                <div className={styles.formGroup}>
                  <label htmlFor="customFrequency">Custom Frequency (in days):</label>
                  <input
                    type="number"
                    id="customFrequency"
                    name="customFrequency"
                    value={formData.customFrequency}
                    onChange={handleChange}
                  />
                </div>
              )}
            </>
          )}

          {/* Responsible People Dropdown */}
          <div className={styles.formGroup}>
            <label>Responsible People:</label>
            <button
              type="button"
              onClick={() => setRespDropdownOpen(!respDropdownOpen)}
            >
              {respDropdownOpen ? "Close" : "Select Roommates"}
            </button>
            {respDropdownOpen && (
              <div className={styles.dropdown}>
                {roomUsers.map((user) => (
                  <div key={user._id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.responsiblePeople.some(
                          (r) => r._id === user._id
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              responsiblePeople: [
                                ...prev.responsiblePeople,
                                { _id: user._id, name: user.username, paid: false }
                              ]
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              responsiblePeople: prev.responsiblePeople.filter(
                                (r) => r._id !== user._id
                              )
                            }));
                          }
                        }}
                      />
                      {user.username}
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      responsiblePeople: roomUsers.map((user) => ({
                        _id: user._id,
                        name: user.username,
                        paid: false
                      }))
                    }))
                  }
                >
                  Everyone
                </button>
              </div>
            )}
          </div>

          {/* Paymaster Dropdown */}
          <div className={styles.formGroup}>
            <label htmlFor="paymaster">Paymaster:</label>
            <div className={styles.formGroupRow}>
              <select
                id="paymaster"
                name="paymaster"
                value={formData.paymaster}
                onChange={handleChange}
              >
                <option value="">Select a user</option>
                {roomUsers.map((user) => (
                  <option key={user._id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleSetMeAsPaymaster}>
                Me
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Bill/Expense
          </button>
        </form>

        <hr />

        <h3>All Bills & Expenses</h3>
        <ul className={styles.billList}>
          {sortedBills.map((bill) => (
            <li
              key={bill._id}
              className={styles.billItem}
              onClick={() => handleBillClick(bill)}
            >
              <div>
                <strong>{bill.title}</strong> - {bill.isAmountPending ? "Amount Not Set Yet" : `$${bill.amount}`}
                {bill.dueDate && (
                  <span> - Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                )}
                {bill.responsible && bill.responsible.length > 0 && (
                  <div>
                    Responsible:
                    <ul>
                      {bill.responsible.map((person, index) => (
                        <li key={index}>
                          {person.name} {person.paid ? "(Paid)" : "(Not Paid)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {bill.paymaster && (
                  <div>Paymaster: {bill.paymaster}</div>
                )}
                {bill.isRecurring && (
                  <div>
                    <button onClick={() => handleMarkAsPaid(bill._id)}>
                      Mark "{bill.title}" as Paid
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Pop-up modal for editing/deleting the selected bill */}
        {selectedBill && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Edit Bill</h3>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="editTitle">Title:</label>
                  <input
                    type="text"
                    id="editTitle"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editAmount">Amount:</label>
                  <input
                    type="number"
                    id="editAmount"
                    name="amount"
                    value={editFormData.amount}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editDueDate">Due Date:</label>
                  <input
                    type="date"
                    id="editDueDate"
                    name="dueDate"
                    value={editFormData.dueDate}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Edit Recurring Options */}
                <div className={styles.formGroup}>
                  <label htmlFor="editIsRecurring">
                    <input
                      type="checkbox"
                      id="editIsRecurring"
                      name="isRecurring"
                      checked={editFormData.isRecurring}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, isRecurring: e.target.checked })
                      }
                    />
                    Recurring
                  </label>
                </div>
                {editFormData.isRecurring && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="editFrequency">Frequency:</label>
                      <select
                        id="editFrequency"
                        name="frequency"
                        value={editFormData.frequency}
                        onChange={handleEditChange}
                      >
                        <option value="">Select frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    {editFormData.frequency === 'custom' && (
                      <div className={styles.formGroup}>
                        <label htmlFor="editCustomFrequency">Custom Frequency (in days):</label>
                        <input
                          type="number"
                          id="editCustomFrequency"
                          name="customFrequency"
                          value={editFormData.customFrequency}
                          onChange={handleEditChange}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Edit Responsible People Dropdown */}
                <div className={styles.formGroup}>
                  <label>Responsible People:</label>
                  <button
                    type="button"
                    onClick={() => setEditRespDropdownOpen(!editRespDropdownOpen)}
                  >
                    {editRespDropdownOpen ? 'Close' : 'Select Roommates'}
                  </button>
                  {editRespDropdownOpen && (
                    <div className={styles.dropdown}>
                      {roomUsers.map((user) => (
                        <div key={user._id}>
                          <label>
                            <input
                              type="checkbox"
                              checked={editFormData.responsiblePeople.some(
                                (r) => r._id === user._id
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (checked) {
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    responsiblePeople: [
                                      ...prev.responsiblePeople,
                                      { _id: user._id, name: user.username, paid: false }
                                    ]
                                  }));
                                } else {
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    responsiblePeople: prev.responsiblePeople.filter(
                                      (r) => r._id !== user._id
                                    )
                                  }));
                                }
                              }}
                            />
                            {user.username}
                          </label>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setEditFormData((prev) => ({
                            ...prev,
                            responsiblePeople: roomUsers.map((user) => ({
                              _id: user._id,
                              name: user.username,
                              paid: false
                            }))
                          }))
                        }
                      >
                        Everyone
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit Paymaster Dropdown */}
                <div className={styles.formGroup}>
                  <label htmlFor="editPaymaster">Paymaster:</label>
                  <div className={styles.formGroupRow}>
                    <select
                      id="editPaymaster"
                      name="paymaster"
                      value={editFormData.paymaster}
                      onChange={handleEditChange}
                    >
                      <option value="">Select a user</option>
                      {roomUsers.map((user) => (
                        <option key={user._id} value={user.username}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={handleSetMeAsPaymasterEdit}>
                      Me
                    </button>
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    style={{ backgroundColor: 'green' }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    style={{ backgroundColor: 'red' }}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    style={{ backgroundColor: 'yellow' }}
                    onClick={() => setSelectedBill(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Button to mark a recurring bill as paid */}
        <div className={styles.markPaidContainer}>
          {sortedBills.map(bill =>
            bill.isRecurring && (
              <button key={bill._id} onClick={() => handleMarkAsPaid(bill._id)}>
                Mark "{bill.title}" as Paid
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BillsExpenses;
