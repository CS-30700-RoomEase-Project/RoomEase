import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../Shared_components/NotificationBell/NotificationBell';
import AvatarButton from '../Shared_components/AvatarButton/AvatarButton';
import styles from './BillsExpenses.module.css';

const BillsExpenses = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsible: '',
  });
  
  // For pop-up modal editing
  const [selectedBill, setSelectedBill] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    responsible: '',
  });

  const userData = JSON.parse(localStorage.getItem('userData')) || {
    username: 'Guest',
    profilePic: '',
  };

  // Fetch bills on mount
  useEffect(() => {
    fetch('http://localhost:5001/api/bills')
      .then((res) => res.json())
      .then((data) => setBills(data))
      .catch((err) => console.error(err));
  }, []);

  // Update new bill form data
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Helper: Parse date string (YYYY-MM-DD) into a local Date object
  const parseDueDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  };

  // Handle new bill submission using parseDueDate to avoid timezone issues
  const handleSubmit = (e) => {
    e.preventDefault();
    const newBill = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate ? parseDueDate(formData.dueDate) : null,
      responsible: formData.responsible,
    };

    fetch('http://localhost:5001/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBill),
    })
      .then((res) => res.json())
      .then((savedBill) => {
        setBills([...bills, savedBill]);
        setFormData({ title: '', amount: '', dueDate: '', responsible: '' });
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

  // When a bill is clicked, show the pop-up menu
  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setEditFormData({
      title: bill.title,
      amount: bill.amount,
      dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
      responsible: bill.responsible || '',
    });
  };

  // Update edit form fields
  const handleEditChange = (e) => {
    setEditFormData({...editFormData, [e.target.name]: e.target.value});
  };

  // Handle saving changes for a bill
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    const updatedBill = {
      title: editFormData.title,
      amount: parseFloat(editFormData.amount),
      dueDate: editFormData.dueDate ? parseDueDate(editFormData.dueDate) : null,
      responsible: editFormData.responsible,
    };

    fetch(`http://localhost:5001/api/bills/${selectedBill._id}`, {
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

  // Handle deleting a bill
  const handleDelete = () => {
    if (!selectedBill) return;
    fetch(`http://localhost:5001/api/bills/${selectedBill._id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setBills(bills.filter(bill => bill._id !== selectedBill._id));
        setSelectedBill(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.billsAppContainer}>
      {/* Top Banner */}
      <div className={styles.billsBanner}>
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

          <div className={styles.formGroup}>
            <label htmlFor="responsible">Responsible:</label>
            <input
              type="text"
              id="responsible"
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              placeholder="Name of the responsible person"
            />
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
                <strong>{bill.title}</strong> - ${bill.amount}
                {bill.dueDate && (
                  <span> - Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                )}
                {bill.responsible && (
                  <span> - Responsible: {bill.responsible}</span>
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

                <div className={styles.formGroup}>
                  <label htmlFor="editResponsible">Responsible:</label>
                  <input
                    type="text"
                    id="editResponsible"
                    name="responsible"
                    value={editFormData.responsible}
                    onChange={handleEditChange}
                    placeholder="Responsible"
                  />
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

      </div>
    </div>
  );
};

export default BillsExpenses;
