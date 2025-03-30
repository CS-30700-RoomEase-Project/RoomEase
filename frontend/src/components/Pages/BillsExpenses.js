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

  // For new bill: frequency is now used as "Recurring:" dropdown.
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsiblePeople: [],
    paymaster: '',
    frequency: 'none', // "none" means Not Recurring
    customFrequency: ''
  });
  const [newPerson, setNewPerson] = useState("");

  // For editing an existing bill
  const [selectedBill, setSelectedBill] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsiblePeople: [],
    paymaster: '',
    frequency: 'none',
    customFrequency: ''
  });

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

  // Fetch room users from new endpoint
  useEffect(() => {
    if (roomId) {
      fetch(`http://localhost:5001/api/room/getUsers/${roomId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched room users:", data);
          if (Array.isArray(data)) {
            setRoomUsers(data);
          } else {
            console.error("Unexpected room users structure", data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [roomId]);

  // Update new bill form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update manual responsible person input
  const handleNewPersonChange = (e) => {
    setNewPerson(e.target.value);
  };

  // Manually add a person to the responsiblePeople array
  const handleAddPerson = () => {
    if (newPerson.trim() !== "") {
      console.log("Adding manual responsible person:", newPerson);
      setFormData({
        ...formData,
        responsiblePeople: [
          ...formData.responsiblePeople,
          { userId: null, name: newPerson.trim(), paid: false }
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

  // Handle new bill submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting new bill:", formData);
    const newBill = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate ? parseDueDate(formData.dueDate) : null,
      responsible: formData.responsiblePeople,
      paymaster: formData.paymaster,
      isRecurring: formData.frequency !== "none",
      frequency: formData.frequency !== "none" ? formData.frequency : null,
      customFrequency: formData.frequency === "custom" ? parseInt(formData.customFrequency) : null
    };

    fetch(`http://localhost:5001/api/bills/addBill/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBill)
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
          frequency: 'none',
          customFrequency: ''
        });
      })
      .catch((err) => console.error(err));
  };

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
      frequency: bill.frequency ? bill.frequency : "none",
      customFrequency: bill.customFrequency || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSetMeAsPaymasterEdit = () => {
    setEditFormData({ ...editFormData, paymaster: userData.username });
  };

  // Toggle the 'paid' status for a responsible person in the edit popup
  const handleTogglePaid = (index) => {
    const updatedPeople = editFormData.responsiblePeople.map((person, idx) => {
      if (idx === index) {
        return { ...person, paid: !person.paid };
      }
      return person;
    });
    setEditFormData({ ...editFormData, responsiblePeople: updatedPeople });
  };

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
      isRecurring: editFormData.frequency !== "none",
      frequency: editFormData.frequency !== "none" ? editFormData.frequency : null,
      customFrequency: editFormData.frequency === "custom" ? parseInt(editFormData.customFrequency) : null,
      isAmountPending: parsedAmount > 0 ? false : true
    };

    fetch(`http://localhost:5001/api/bills/updateBill/${selectedBill._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBill)
    })
      .then((res) => res.json())
      .then((data) => {
        setBills(bills.map((bill) => (bill._id === selectedBill._id ? data : bill)));
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    if (!selectedBill) return;
    fetch(`http://localhost:5001/api/bills/deleteBill/${selectedBill._id}/${roomId}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then(() => {
        setBills(bills.filter((bill) => bill._id !== selectedBill._id));
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  const handleBackToRoom = () => {
    navigate(`/room/${roomId}`);
  };

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
    <div className={styles.roomEaseContainer}>
      <div className={styles.gradientOverlay}></div>
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>
      <div className={styles.decorCircle3}></div>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <button onClick={handleBackToRoom} className={styles.navBackButton}>
            Back to Room
          </button>
          <h1 className={styles.navTitle}>Bills & Expenses</h1>
          <div className={styles.navRight}>
            <NotificationBell />
            <AvatarButton imageUrl={userData.profilePic} />
          </div>
        </div>
      </nav>
      <div className={styles.mainContent}>
        <h2 className={styles.heading}>Add New Bill/Expense</h2>
        <form onSubmit={handleSubmit} className={styles.billForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="amount">Amount:</label>
            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dueDate">Due Date:</label>
            <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          </div>
          {/* Responsible People Table */}
          <div className={styles.formGroup}>
            <label>Responsible People:</label>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {roomUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.responsiblePeople.some((r) => r.userId === user._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              responsiblePeople: [
                                ...prev.responsiblePeople,
                                { userId: user._id, name: user.username, paid: false }
                              ]
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              responsiblePeople: prev.responsiblePeople.filter((r) => r.userId !== user._id)
                            }));
                          }
                        }}
                      />
                    </td>
                    <td>{user.username}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">
                    <button type="button" onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        responsiblePeople: roomUsers.map((user) => ({
                          userId: user._id,
                          name: user.username,
                          paid: false
                        }))
                      }))
                    }>
                      Everyone
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {/* Paymaster Dropdown */}
          <div className={styles.formGroup}>
            <label htmlFor="paymaster">Paymaster:</label>
            <div className={styles.formGroupRow}>
              <select id="paymaster" name="paymaster" value={formData.paymaster} onChange={handleChange}>
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
          {/* Recurring Dropdown placed below Paymaster */}
          <div className={styles.formGroup}>
            <label htmlFor="frequency">Recurring:</label>
            <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange}>
              <option value="none">Not Recurring</option>
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
              <input type="number" id="customFrequency" name="customFrequency" value={formData.customFrequency} onChange={handleChange} />
            </div>
          )}
          <button type="submit" className={styles.submitButton}>Add Bill/Expense</button>
        </form>
        <hr />
        <h3 className={styles.heading}>All Bills & Expenses</h3>
        <ul className={styles.billList}>
          {sortedBills.map((bill) => (
            <li key={bill._id} className={styles.billItem} onClick={() => handleBillClick(bill)}>
              <div>
                <strong>{bill.title}</strong> - {bill.isAmountPending ? "Amount Not Set Yet" : `$${bill.amount}`}
                {bill.dueDate && (<span> - Due: {new Date(bill.dueDate).toLocaleDateString()}</span>)}
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
                {bill.paymaster && <div>Paymaster: {bill.paymaster}</div>}
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
        {selectedBill && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Edit Bill</h3>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="editTitle">Title:</label>
                  <input type="text" id="editTitle" name="title" value={editFormData.title} onChange={handleEditChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editAmount">Amount:</label>
                  <input type="number" id="editAmount" name="amount" value={editFormData.amount} onChange={handleEditChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editDueDate">Due Date:</label>
                  <input type="date" id="editDueDate" name="dueDate" value={editFormData.dueDate} onChange={handleEditChange} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editFrequency">Recurring:</label>
                  <select id="editFrequency" name="frequency" value={editFormData.frequency} onChange={handleEditChange}>
                    <option value="none">Not Recurring</option>
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
                    <input type="number" id="editCustomFrequency" name="customFrequency" value={editFormData.customFrequency} onChange={handleEditChange} />
                  </div>
                )}
                {/* Table for Responsible People with Payment Status */}
                <div className={styles.formGroup}>
                  <label>Responsible People:</label>
                  <table className={styles.userTable}>
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Username</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={editFormData.responsiblePeople.some((r) => r.userId === user._id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (checked) {
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    responsiblePeople: [
                                      ...prev.responsiblePeople,
                                      { userId: user._id, name: user.username, paid: false }
                                    ]
                                  }));
                                } else {
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    responsiblePeople: prev.responsiblePeople.filter((r) => r.userId !== user._id)
                                  }));
                                }
                              }}
                            />
                          </td>
                          <td>{user.username}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={editFormData.responsiblePeople.find((r) => r.userId === user._id)?.paid || false}
                              onChange={() => {
                                const updatedPeople = editFormData.responsiblePeople.map((person) => {
                                  if (person.userId === user._id) {
                                    return { ...person, paid: !person.paid };
                                  }
                                  return person;
                                });
                                setEditFormData({ ...editFormData, responsiblePeople: updatedPeople });
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3">
                          <button type="button" onClick={() =>
                            setEditFormData((prev) => ({
                              ...prev,
                              responsiblePeople: roomUsers.map((user) => ({
                                userId: user._id,
                                name: user.username,
                                paid: true
                              }))
                            }))
                          }>
                            Everyone Paid
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editPaymaster">Paymaster:</label>
                  <div className={styles.formGroupRow}>
                    <select id="editPaymaster" name="paymaster" value={editFormData.paymaster} onChange={handleEditChange}>
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
                  <button type="submit" className={styles.saveButton} style={{ backgroundColor: 'green' }}>
                    Save
                  </button>
                  <button type="button" className={styles.deleteButton} style={{ backgroundColor: 'red' }} onClick={handleDelete}>
                    Delete
                  </button>
                  <button type="button" className={styles.cancelButton} style={{ backgroundColor: 'yellow' }} onClick={() => setSelectedBill(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
      <footer className={styles.footer}>
        <p>© 2025 RoomEase. All rights reserved.</p>
        <p>
          <button className={styles.footerLink} onClick={() => alert("Privacy Policy Clicked")}>
            Privacy Policy
          </button>{" "}
          |{" "}
          <button className={styles.footerLink} onClick={() => alert("Terms of Service Clicked")}>
            Terms of Service
          </button>
        </p>
      </footer>
    </div>
  );
};

export default BillsExpenses;
