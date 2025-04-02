import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import NotificationBell from '../Shared_components/NotificationBell/NotificationBell';
import AvatarButton from '../Shared_components/AvatarButton/AvatarButton';
import styles from './BillsExpenses.module.css';

const BillsExpenses = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);

  // State for Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsiblePeople: [],
    paymaster: '',
    frequency: 'none',
    customFrequency: '',
    splitBill: true,
  });
  const [newPerson, setNewPerson] = useState("");

  // State for Edit Modal
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
    isFinished: false,
    splitBill: true,
  });

  // State for History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyBills, setHistoryBills] = useState([]);

  // State for Price History Modal
  const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false);
  const [currentPriceHistory, setCurrentPriceHistory] = useState([]);
  const [currentPriceHistoryBillTitle, setCurrentPriceHistoryBillTitle] = useState('');

  // State for Balance Owed Popup
  const [showBalancePopup, setShowBalancePopup] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData')) || {
    username: 'Guest',
    userId: null,
    profilePic: '',
  };

  // Fetch active bills
  useEffect(() => {
    if (roomId) {
      fetch(`http://localhost:5001/api/bills/getBills/${roomId}`)
        .then((res) => res.json())
        .then((data) => {
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
          if (Array.isArray(data)) {
            setRoomUsers(data);
          } else {
            console.error("Unexpected room users structure", data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [roomId]);

  const fetchHistoryBills = () => {
    fetch(`http://localhost:5001/api/bills/history/${roomId}`)
      .then((res) => res.json())
      .then((data) => setHistoryBills(data))
      .catch((err) => console.error(err));
  };

  const parseDueDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  };

  // Handlers for Add Modal
  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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
          { userId: null, name: newPerson.trim(), paid: false },
        ],
      }));
      setNewPerson("");
    }
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
      customFrequency: formData.frequency === "custom" ? parseInt(formData.customFrequency) : null,
      splitBill: formData.splitBill,
    };

    fetch(`http://localhost:5001/api/bills/addBill/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBill),
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
          customFrequency: '',
          splitBill: true,
        });
        setShowAddModal(false);
      })
      .catch((err) => console.error(err));
  };

  // Sorted active bills
  const sortedBills = [...bills].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Handlers for Edit Modal
  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setEditFormData({
      title: bill.title,
      amount: bill.amount,
      dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
      responsiblePeople: bill.responsible || [],
      paymaster: bill.paymaster || '',
      frequency: bill.frequency || 'none',
      customFrequency: bill.customFrequency || '',
      priceHistory: bill.priceHistory || [],
      isFinished: bill.isFinished || false,
      splitBill: bill.splitBill !== undefined ? bill.splitBill : true,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({ ...editFormData, [name]: type === 'checkbox' ? checked : value });
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
      isFinished: editFormData.isFinished,
      splitBill: editFormData.splitBill,
    };

    fetch(`http://localhost:5001/api/bills/updateBill/${selectedBill._id}/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBill),
    })
      .then((res) => res.json())
      .then((data) => {
        setBills(bills.map(bill => bill._id === selectedBill._id ? data : bill));
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    if (!selectedBill) return;
    fetch(`http://localhost:5001/api/bills/deleteBill/${selectedBill._id}/${roomId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setBills(bills.filter(bill => bill._id !== selectedBill._id));
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  // Recurring expense controls (active bills list only)
  const handleFinishRecurringDirect = (bill, e) => {
    if(e) e.stopPropagation();
    fetch(`http://localhost:5001/api/bills/finishRecurring/${bill._id}/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((updatedBill) => {
        setBills(bills.filter(b => b._id !== updatedBill._id));
        fetchHistoryBills();
      })
      .catch((err) => console.error(err));
  };

  const handleShowPriceHistoryDirect = (bill, e) => {
    if(e) e.stopPropagation();
    setCurrentPriceHistory(bill.priceHistory || []);
    setCurrentPriceHistoryBillTitle(bill.title);
    setShowPriceHistoryModal(true);
  };

  const handleBackToRoom = () => {
    navigate(`/room/${roomId}`);
  };

  const handleMarkAsPaid = (billId, e) => {
    e.stopPropagation();
    fetch(`http://localhost:5001/api/bills/markAsPaid/${billId}/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((updatedBill) => {
        if (!updatedBill.isRecurring) {
          setBills(bills.filter(bill => bill._id !== updatedBill._id));
        } else {
          setBills(bills.map(bill => (bill._id === updatedBill._id ? updatedBill : bill)));
        }
        fetchHistoryBills();
      })
      .catch((err) => console.error(err));
  };

  const handleOpenHistory = () => {
    fetchHistoryBills();
    setShowHistoryModal(true);
  };

  const handleDeleteHistory = (billId) => {
    fetch(`http://localhost:5001/api/bills/deleteBill/${billId}/${roomId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setHistoryBills(historyBills.filter(bill => bill._id !== billId));
      })
      .catch((err) => console.error(err));
  };

  const handleClearHistory = () => {
    fetch(`http://localhost:5001/api/bills/clearHistory/${roomId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setHistoryBills([]);
      })
      .catch((err) => console.error(err));
  };

  const computeBalances = () => {
    const balances = {};
    roomUsers.forEach(user => {
      if (user._id !== userData.userId) {
        balances[user._id] = 0;
      }
    });
    bills.forEach(bill => {
      if (bill.amount && bill.responsible && bill.responsible.length > 0) {
        const amountPerPerson = bill.splitBill === false ? bill.amount : bill.amount / bill.responsible.length;
        if (bill.paymaster === userData.username) {
          bill.responsible.forEach(person => {
            if (person.userId !== userData.userId && !person.paid) {
              balances[person.userId] += amountPerPerson;
            }
          });
        } else {
          const currentResp = bill.responsible.find(person => person.userId === userData.userId);
          if (currentResp && !currentResp.paid) {
            const paymasterUser = roomUsers.find(user => user.username === bill.paymaster);
            if (paymasterUser && paymasterUser._id !== userData.userId) {
              balances[paymasterUser._id] -= amountPerPerson;
            }
          }
        }
      }
    });
    return balances;
  };

  const renderBalancePopup = () => {
    const balances = computeBalances();
    return createPortal(
      <div className={styles.popupOverlay}>
        <div className={styles.popupMenu}>
          <h3>Balance Owed</h3>
          <button className={styles.closeButton} onClick={() => setShowBalancePopup(false)} style={{ marginBottom: '1.5rem' }}>
            Close
          </button>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {roomUsers.filter(user => user._id !== userData.userId).map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>
                    {balances[user._id] > 0
                      ? `$${balances[user._id].toFixed(2)} owed to you`
                      : balances[user._id] < 0
                      ? `You owe $${Math.abs(balances[user._id]).toFixed(2)}`
                      : "No Pending Balance"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>,
      document.body
    );
  };

  const exportPriceHistoryCSV = () => {
    if (!currentPriceHistory || currentPriceHistory.length === 0) {
      alert("No price history available to export.");
      return;
    }
    const header = "Date,Amount\n";
    const rows = currentPriceHistory.map(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      const amount = entry.amount;
      return `${date},${amount}`;
    });
    const csvString = header + rows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentPriceHistoryBillTitle}_price_history.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.billsAppContainer}>
      {/* Decorative Circles */}
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>
      <div className={styles.decorCircle3}></div>

      {/* Header */}
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

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.topActions}>
          <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
            Add New Bill/Expense
          </button>
          <button className={styles.historyButton} onClick={handleOpenHistory}>
            Bills/Expenses History
          </button>
          <button className={styles.balanceButton} onClick={() => setShowBalancePopup(true)}>
            Balance Owed
          </button>
        </div>

        <h3>All Bills & Expenses</h3>
        <ul className={styles.billList}>
          {sortedBills.map(bill => (
            <li key={bill._id} className={styles.billItem} onClick={() => handleBillClick(bill)}>
              <div>
                <strong>{bill.title}</strong> - {bill.isAmountPending ? "Amount Not Set Yet" : `$${bill.amount}`}
                {bill.dueDate && <span> - Due: {new Date(bill.dueDate).toLocaleDateString()}</span>}
                {bill.responsible && bill.responsible.length > 0 && (
                  <div>
                    Responsible:
                    <ul>
                      {bill.responsible.map((person, idx) => (
                        <li key={idx}>
                          {person.name} {person.paid ? "(Paid)" : "(Not Paid)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {bill.paymaster && <div>Paymaster: {bill.paymaster}</div>}
                <div>
                  <button onClick={e => handleMarkAsPaid(bill._id, e)}>
                    Mark "{bill.title}" as Paid
                  </button>
                  {bill.frequency && bill.frequency !== "none" && !bill.isFinished && (
                    <>
                      <button onClick={e => { e.stopPropagation(); handleShowPriceHistoryDirect(bill, e); }}>
                        Price History
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleFinishRecurringDirect(bill, e); }}>
                        Finish Recurring Expense
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
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

      {/* Portals for Modals */}
      {showAddModal &&
        createPortal(
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Add New Bill/Expense</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleAddChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount">Amount:</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleAddChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="splitBill">Split:</label>
                  <select
                    id="splitBill"
                    name="splitBill"
                    value={formData.splitBill ? "true" : "false"}
                    onChange={e => setFormData({ ...formData, splitBill: e.target.value === "true" })}
                  >
                    <option value="false">Don't Split Amount</option>
                    <option value="true">Split Amount Equally Among Responsible People</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dueDate">Due Date:</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleAddChange}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Responsible People:</label>
                  <table className={styles.userTable}>
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Username</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomUsers.map(user => (
                        <tr key={user._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={formData.responsiblePeople.some(r => r.userId === user._id)}
                              onChange={e => {
                                const checked = e.target.checked;
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    responsiblePeople: [
                                      ...prev.responsiblePeople,
                                      { userId: user._id, name: user.username, paid: false }
                                    ]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    responsiblePeople: prev.responsiblePeople.filter(r => r.userId !== user._id)
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
                          <button
                            type="button"
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                responsiblePeople: roomUsers.map(u => ({
                                  userId: u._id,
                                  name: u.username,
                                  paid: false,
                                })),
                              }))
                            }
                          >
                            Everyone
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div>
                  <label htmlFor="paymaster">Paymaster:</label>
                  <select id="paymaster" name="paymaster" value={formData.paymaster} onChange={handleAddChange}>
                    <option value="">Select a user</option>
                    {roomUsers.map(u => (
                      <option key={u._id} value={u.username}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
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
                  <div>
                    <label htmlFor="customFrequency">Custom Frequency (in days):</label>
                    <input
                      type="number"
                      id="customFrequency"
                      name="customFrequency"
                      value={formData.customFrequency}
                      onChange={handleAddChange}
                    />
                  </div>
                )}
                <div>
                  <button type="submit" style={{ backgroundColor: "green" }}>
                    Save
                  </button>
                  <button type="button" style={{ backgroundColor: "yellow" }} onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      {selectedBill &&
        createPortal(
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Edit Bill</h3>
              <form onSubmit={handleEditSubmit}>
                <div>
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
                <div>
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
                <div>
                  <label htmlFor="splitBill">Split:</label>
                  <select
                    id="splitBill"
                    name="splitBill"
                    value={editFormData.splitBill ? "true" : "false"}
                    onChange={e =>
                      setEditFormData({ ...editFormData, splitBill: e.target.value === "true" })
                    }
                  >
                    <option value="false">Don't Split Amount</option>
                    <option value="true">Split Amount Equally Among Responsible People</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="editDueDate">Due Date:</label>
                  <input
                    type="date"
                    id="editDueDate"
                    name="dueDate"
                    value={editFormData.dueDate}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
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
                  <div>
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
                <div style={{ marginBottom: '1rem' }}>
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
                      {roomUsers.map(u => {
                        const isChecked = editFormData.responsiblePeople.some(r => r.userId === u._id);
                        const paidStatus = editFormData.responsiblePeople.find(r => r.userId === u._id)?.paid;
                        return (
                          <tr key={u._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={ev => {
                                  if (ev.target.checked) {
                                    setEditFormData(prev => ({
                                      ...prev,
                                      responsiblePeople: [
                                        ...prev.responsiblePeople,
                                        { userId: u._id, name: u.username, paid: false },
                                      ],
                                    }));
                                  } else {
                                    setEditFormData(prev => ({
                                      ...prev,
                                      responsiblePeople: prev.responsiblePeople.filter(r => r.userId !== u._id),
                                    }));
                                  }
                                }}
                              />
                            </td>
                            <td>{u.username}</td>
                            <td>
                              <input
                                type="checkbox"
                                checked={paidStatus || false}
                                onChange={() => {
                                  setEditFormData(prev => {
                                    const updated = prev.responsiblePeople.map(p =>
                                      p.userId === u._id ? { ...p, paid: !p.paid } : p
                                    );
                                    return { ...prev, responsiblePeople: updated };
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="editPaymaster">Paymaster:</label>
                  <select id="editPaymaster" name="paymaster" value={editFormData.paymaster} onChange={handleEditChange}>
                    <option value="">Select a user</option>
                    {roomUsers.map(u => (
                      <option key={u._id} value={u.username}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button type="submit" style={{ backgroundColor: "green" }}>
                    Save
                  </button>
                  <button type="button" style={{ backgroundColor: "red" }} onClick={handleDelete}>
                    Delete
                  </button>
                  <button type="button" style={{ backgroundColor: "yellow" }} onClick={() => setSelectedBill(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {showHistoryModal &&
        createPortal(
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Bills/Expenses History</h3>
              <button className={styles.closeButton} onClick={() => setShowHistoryModal(false)} style={{ marginBottom: '0.5rem' }}>
                Close
              </button>
              <button className={styles.clearHistoryButton} onClick={handleClearHistory}>
                Clear History
              </button>
              <div className={styles.historyList}>
                {historyBills.length ? (
                  <ul>
                    {historyBills.map(bill => (
                      <li key={bill._id} className={styles.historyItem}>
                        <div>
                          <strong>{bill.title}</strong> - {bill.isAmountPending ? "Amount Not Set" : `$${bill.amount}`}
                          {bill.dueDate && (
                            <span> - Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                          )}
                          {bill.responsible && bill.responsible.length > 0 && (
                            <div>
                              Responsible:
                              <ul>
                                {bill.responsible.map((person, idx) => (
                                  <li key={idx}>
                                    {person.name} {person.paid ? "(Paid)" : "(Not Paid)"}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {bill.paymaster && <div>Paymaster: {bill.paymaster}</div>}
                          <div>
                            {bill.frequency && bill.frequency !== "none" && (
                              <button onClick={(e) => { e.stopPropagation(); handleShowPriceHistoryDirect(bill, e); }}>
                                Price History
                              </button>
                            )}
                            <button onClick={() => handleDeleteHistory(bill._id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No history available.</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {showPriceHistoryModal &&
        createPortal(
          <div className={styles.popupOverlay}>
            <div className={styles.popupMenu}>
              <h3>Price History for {currentPriceHistoryBillTitle}</h3>
              <button className={styles.closeButton} onClick={() => setShowPriceHistoryModal(false)} style={{ marginBottom: '1.5rem' }}>
                Close
              </button>
              <button className={styles.actionButton} onClick={exportPriceHistoryCSV}>
                Export as CSV
              </button>
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
          </div>,
          document.body
        )}

      {showBalancePopup && renderBalancePopup()}
    </div>
  );
};

export default BillsExpenses;
