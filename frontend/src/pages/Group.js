import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Group.css';

const Group = () => {
  const [groupName, setGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [groups, setGroups] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  const [expensePaidBy, setExpensePaidBy] = useState('');
  const [expenseSplitBetween, setExpenseSplitBetween] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      setCurrentUserId(payload.id);
      fetchGroups();
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }, [token]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroups(res.data);
    } catch (err) {
      console.error('Error loading groups:', err);
    }
  };

  const fetchUserIdsFromEmails = async (emails) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/lookup',
        { emails },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data.map(user => user._id);
    } catch (err) {
      console.error('Failed to fetch user IDs from emails:', err);
      return [];
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    if (!groupName) return alert('Enter a group name');

    const emails = memberEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    try {
      const memberIdsFromEmails = await fetchUserIdsFromEmails(emails);
      const allMemberIds = Array.from(new Set([currentUserId, ...memberIdsFromEmails]));

      await axios.post(
        'http://localhost:5000/api/groups',
        {
          name: groupName,
          members: allMemberIds
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setGroupName('');
      setMemberEmails('');
      fetchGroups();
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group');
    }
  };

  const handleGroupClick = (group) => {
    if (expandedGroupId === group._id) {
      setExpandedGroupId(null);
    } else {
      setExpandedGroupId(group._id);

      // Reset expense inputs when group changes
      setExpenseAmount('');
      setExpenseCategory('');
      setExpensePaidBy('');
      setExpenseSplitBetween([]);
    }
  };

  const handleExpenseSubmit = async (e, group) => {
    e.preventDefault();

    if (!expenseAmount || isNaN(expenseAmount) || expenseAmount <= 0) {
      return alert('Please enter a valid amount');
    }

    const splitMembers = expenseSplitBetween.length > 0 ? expenseSplitBetween : group.members.map(m => m._id);

    try {
      await axios.post(
        'http://localhost:5000/api/group-expenses',
        {
          groupId: group._id,
          paidBy: expensePaidBy || currentUserId,
          amount: parseFloat(expenseAmount),
          splitBetween: splitMembers,
          category: expenseCategory,
          date: new Date()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Expense added successfully!');
      setExpenseAmount('');
      setExpenseCategory('');
      setExpensePaidBy('');
      setExpenseSplitBetween([]);
    } catch (err) {
      console.error('Error adding expense:', err);
      alert('Failed to add expense');
    }
  };

  const toggleSplitMember = (memberId) => {
    if (expenseSplitBetween.includes(memberId)) {
      setExpenseSplitBetween(expenseSplitBetween.filter(id => id !== memberId));
    } else {
      setExpenseSplitBetween([...expenseSplitBetween, memberId]);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Create a Group</h2>
        <form onSubmit={handleCreate} className="group-form">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter member emails (comma separated)"
            value={memberEmails}
            onChange={e => setMemberEmails(e.target.value)}
          />
          <button type="submit">Create Group</button>
        </form>

        <h3>Your Groups</h3>
        {groups.length === 0 ? (
          <p>No groups found.</p>
        ) : (
          groups.map(group => (
            <div
              key={group._id}
              className="group-card"
              onClick={() => handleGroupClick(group)}
            >
              <h4>{group.name}</h4>
              <p>Members: {group.members.map(m => m.name).join(', ')}</p>

              {expandedGroupId === group._id && (
                <div
                  style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}
                  onClick={e => e.stopPropagation()}
                >
                  <h5>Add Group Expense</h5>
                  <form onSubmit={e => handleExpenseSubmit(e, group)}>
                    <div>
                      <label>Amount: </label>
                      <input
                        type="number"
                        step="0.01"
                        value={expenseAmount}
                        onChange={e => setExpenseAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>Category: </label>
                      <select
                        value={expenseCategory}
                        onChange={e => setExpenseCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Bills">Bills</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label>Paid By: </label>
                      <select
                        value={expensePaidBy || currentUserId}
                        onChange={e => setExpensePaidBy(e.target.value)}
                      >
                        {group.members.map(member => (
                          <option key={member._id} value={member._id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Split Between: </label>
                      <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #ccc', padding: '0.5rem' }}>
                        {group.members.map(member => (
                          <div key={member._id}>
                            <input
                              type="checkbox"
                              id={`split-${member._id}`}
                              checked={expenseSplitBetween.length === 0 || expenseSplitBetween.includes(member._id)}
                              onChange={() => toggleSplitMember(member._id)}
                            />
                            <label htmlFor={`split-${member._id}`}>{member.name}</label>
                          </div>
                        ))}
                        <small>(If none selected, splits between all members)</small>
                      </div>
                    </div>
                    <button type="submit" style={{ marginTop: '0.5rem' }}>Add Expense</button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Group;
