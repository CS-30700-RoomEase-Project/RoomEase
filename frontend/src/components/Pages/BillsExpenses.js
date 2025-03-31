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

  // State for Add New Bill Modal
  const [showAddModal, setShowAddModal] = useState(false);
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

  // State for Edit Bill Modal
  const [selectedBill, setSelectedBill] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsiblePeople: [],
    paymaster: '',
    frequency: 'none',
    customFrequency: '',
    priceHistory: [],
    isFinished: false // for recurring bills that have been finished
  });

  // State for Bills History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyBills, setHistoryBills] = useState([]);

  // State for Price History Modal (for recurring bills in edit)
  const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false);
  const [currentPriceHistory, setCurrentPriceHistory] = useState([]);
  const [currentPriceHistoryBillTitle, setCurrentPriceHistoryBillTitle] = useState('');

  const userData = JSON.parse(localStorage.getItem('userData')) || {
    username: 'Guest',
    userId: null,
    profilePic: '',
  };

  // Fetch active bills (only bills with isPaid: false)
  useEffect(() => {
    if (roomId) {
      fetch(`http://localhost:5001/api/bills/getBills/${roomId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched active bills data:", data);
          if (Array.isArray(data)) {
            setBills(data);
          } else if (Array.isArray(data.bills)) {
            setBills(data.bills);
          } else {
            console.error("Unexpected active bills response structure", data);
            setBills([]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [roomId]);

  // Fetch room users
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

  // Fetch history bills from endpoint
  const fetchHistoryBills = () => {
    fetch(`http://localhost:5001/api/bills/history/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched history bills:", data);
        setHistoryBills(data);
      })
      .catch((err) => console.error(err));
  };

  // Helper: Parse date string into Date object
  const parseDueDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  };

  // Handlers for Add Modal form
  const handleAddChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNewPersonChange = (e) => {
    setNewPerson(e.target.value);
  };

  const handleAddPerson = () => {
    if (newPerson.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        responsiblePeople: [
          ...prev.responsiblePeople,
          { userId: null, name: newPerson.trim(), paid: false }
        ]
      }));
      setNewPerson("");
    }
  };

  const handleSetMeAsPaymasterAdd = () => {
    setFormData({ ...formData, paymaster: userData.username });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        setBills([...bills, savedBill]);
        setFormData({
          title: '',
          amount: '',
          dueDate: '',
          responsiblePeople: [],
          paymaster: '',
          frequency: 'none',
          customFrequency: ''
        });
        setShowAddModal(false);
      })
      .catch((err) => console.error(err));
  };

  // Sorted active bills by due date
  const sortedBills = bills.slice().sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Handlers for Edit Modal form
  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setEditFormData({
      title: bill.title,
      amount: bill.amount,
      dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
      responsiblePeople: bill.responsible || [],
      paymaster: bill.paymaster || '',
      frequency: bill.frequency ? bill.frequency : "none",
      customFrequency: bill.customFrequency || '',
      priceHistory: bill.priceHistory || [],
      isFinished: bill.isFinished || false
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSetMeAsPaymasterEdit = () => {
    setEditFormData({ ...editFormData, paymaster: userData.username });
  };

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
      isAmountPending: parsedAmount > 0 ? false : true,
      priceHistory: editFormData.priceHistory,
      isFinished: editFormData.isFinished
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

  const handleFinishRecurring = () => {
    // Finish recurring expense: call new endpoint to finalize recurring bill
    fetch(`http://localhost:5001/api/bills/finishRecurring/${selectedBill._id}/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((updatedBill) => {
        // Remove from active list and refresh history
        setBills(bills.filter((bill) => bill._id !== updatedBill._id));
        fetchHistoryBills();
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  const handleBackToRoom = () => {
    navigate(`/room/${roomId}`);
  };

  // Mark as Paid handler – stops propagation so it doesn't open the edit modal.
  const handleMarkAsPaid = (billId, e) => {
    e.stopPropagation();
    fetch(`http://localhost:5001/api/bills/markAsPaid/${billId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((updatedBill) => {
        // For non-recurring bills, remove from active list.
        if (!updatedBill.isRecurring) {
          setBills(bills.filter(bill => bill._id !== updatedBill._id));
        } else {
          setBills(bills.map(bill => bill._id === updatedBill._id ? updatedBill : bill));
        }
        // Refresh history so that the paid bill shows up immediately.
        fetchHistoryBills();
      })
      .catch((err) => console.error(err));
  };

  // Handler to open Bills History modal
  const handleOpenHistory = () => {
    fetchHistoryBills();
    setShowHistoryModal(true);
  };

  // Handler to open Price History modal from edit modal for recurring bills
  const handleShowPriceHistory = () => {
    setCurrentPriceHistory(editFormData.priceHistory || []);
    setCurrentPriceHistoryBillTitle(editFormData.title);
    setShowPriceHistoryModal(true);
  };

  // Handler to delete an individual bill from history
  const handleDeleteHistory = (billId) => {
    fetch(`http://localhost:5001/api/bills/deleteBill/${billId}/${roomId}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then(() => {
        setHistoryBills(historyBills.filter(bill => bill._id !== billId));
      })
      .catch((err) => console.error(err));
  };

  // Handler to clear entire bills history
  const handleClearHistory = () => {
    fetch(`http://localhost:5001/api/bills/clearHistory/${roomId}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then(() => {
        setHistoryBills([]);
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
        {/* Top Actions */}
        <div className={styles.topActions}>
          <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
            Add New Bill/Expense
          </button>
          <button className={styles.historyButton} onClick={handleOpenHistory}>
            Bills/Expenses History
          </button>
        </div>
        {/* Active Bills List */}
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
                <div>
                  <button onClick={(e) => handleMarkAsPaid(bill._id, e)}>
                    Mark "{bill.title}" as Paid
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Add New Bill Modal */}
        {showAddModal && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Add New Bill/Expense</h3>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Title:</label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleAddChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="amount">Amount:</label>
                  <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleAddChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dueDate">Due Date:</label>
                  <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleAddChange} />
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
                    <select id="paymaster" name="paymaster" value={formData.paymaster} onChange={handleAddChange}>
                      <option value="">Select a user</option>
                      {roomUsers.map((user) => (
                        <option key={user._id} value={user.username}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={handleSetMeAsPaymasterAdd}>
                      Me
                    </button>
                  </div>
                </div>
                {/* Recurring Dropdown placed below Paymaster */}
                <div className={styles.formGroup}>
                  <label htmlFor="frequency">Recurring:</label>
                  <select id="frequency" name="frequency" value={formData.frequency} onChange={handleAddChange}>
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
                    <input type="number" id="customFrequency" name="customFrequency" value={formData.customFrequency} onChange={handleAddChange} />
                  </div>
                )}
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.saveButton} style={{ backgroundColor: 'green' }}>
                    Save
                  </button>
                  <button type="button" className={styles.cancelButton} style={{ backgroundColor: 'yellow' }} onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Bill Modal */}
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
                {/* For recurring bills, show Price History and Finish buttons */}
                {editFormData.frequency !== "none" && !editFormData.isFinished && (
                  <div className={styles.formGroupRow}>
                    <button type="button" onClick={handleShowPriceHistory}>
                      Show Price History
                    </button>
                    <button type="button" onClick={handleFinishRecurring}>
                      Finish Recurring Expense
                    </button>
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
        {/* History Modal */}
        {showHistoryModal && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Bills/Expenses History</h3>
              <button className={styles.closeButton} onClick={() => setShowHistoryModal(false)}>Close</button>
              <button className={styles.clearHistoryButton} onClick={handleClearHistory}>Clear History</button>
              <div className={styles.historyList}>
                {historyBills.length ? (
                  <ul>
                    {historyBills.map((bill) => (
                      <li key={bill._id} className={styles.historyItem}>
                        <div>
                          <strong>{bill.title}</strong> - {bill.isAmountPending ? "Amount Not Set" : `$${bill.amount}`}
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
                          {bill.frequency && bill.frequency !== "none" && (
                            <button onClick={() => handleShowPriceHistory(bill)}>
                              Price History
                            </button>
                          )}
                          <button onClick={() => handleDeleteHistory(bill._id)}>
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No history available.</p>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Price History Modal */}
        {showPriceHistoryModal && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Price History for {currentPriceHistoryBillTitle}</h3>
              <button className={styles.closeButton} onClick={() => setShowPriceHistoryModal(false)}>Close</button>
              <div className={styles.historyTableContainer}>
                {currentPriceHistory.length ? (
                  <table className={styles.userTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPriceHistory.map((entry, idx) => (
                        <tr key={idx}>
                          <td>{new Date(entry.date).toLocaleDateString()}</td>
                          <td>{entry.amount > 0 ? `$${entry.amount}` : "Amount Not Set"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No price history available.</p>
                )}
              </div>
            </div>
          </div>
        )}
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
