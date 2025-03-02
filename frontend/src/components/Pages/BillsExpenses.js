import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../Shared_components/NotificationBell/NotificationBell';
import AvatarButton from '../Shared_components/AvatarButton/AvatarButton';
import styles from './BillsExpenses.module.css'; // We'll create this CSS file next

const BillsExpenses = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
  });

  // Get user data from localStorage (similar to Dashboard)
  const userData = JSON.parse(localStorage.getItem('userData')) || {
    username: 'Guest',
    profilePic: '',
  };

  // Fetch existing bills/expenses on mount
  useEffect(() => {
    fetch('http://localhost:5001/api/bills')
      .then((res) => res.json())
      .then((data) => setBills(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new bill/expense
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Parse the dueDate as a local date
    const dueDateValue = formData.dueDate
      ? (() => {
          const [year, month, day] = formData.dueDate.split('-');
          return new Date(year, month - 1, day); // month is zero-indexed
        })()
      : null;
  
    const newBill = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      dueDate: dueDateValue,
    };
  
    fetch('http://localhost:5001/api/bills', { // Ensure the correct port is used
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBill),
    })
      .then((res) => res.json())
      .then((savedBill) => {
        setBills([...bills, savedBill]);
        setFormData({ title: '', amount: '', dueDate: '' });
      })
      .catch((err) => console.error(err));
  };
  

  // Create a sorted copy of bills by due date
  const sortedBills = bills.slice().sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className={styles.billsAppContainer}>
      {/* Top Banner (same structure as your Dashboard) */}
      <div className={styles.billsBanner}>
        <div className={styles.header}>
          <h1>{userData.username}'s Bills & Expenses</h1>
        </div>
        <NotificationBell />
        <AvatarButton imageUrl={userData.profilePic} />
      </div>

      {/* Main Content Area */}
      <div className={styles.billsContent}>
        {/* Form to add new bills/expenses */}
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

          <button type="submit" className={styles.submitButton}>
            Add Bill/Expense
          </button>
        </form>

        <hr />

        {/* List of all bills/expenses */}
        <h3>All Bills & Expenses</h3>
        <ul className={styles.billList}>
          {sortedBills.map((bill) => (
            <li key={bill._id} className={styles.billItem}>
              <strong>{bill.title}</strong> - ${bill.amount}
              {bill.dueDate && (
                <span> - Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BillsExpenses;
