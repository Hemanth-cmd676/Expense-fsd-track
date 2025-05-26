import React, { useEffect, useState, useMemo } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

const styles = {
  container: {
    maxWidth: '700px',
    margin: '2.5rem auto 4rem',
    padding: '2.5rem 2rem',
    backgroundColor: '#f9f5f0',
    borderRadius: '14px',
    boxShadow: '0 10px 25px rgba(91, 58, 41, 0.18)',
    fontFamily: "'Georgia', serif",
    color: '#5b3a29',
    letterSpacing: '0.02em',
  },
  heading: {
    fontSize: '2.4rem',
    fontWeight: '600',
    marginBottom: '1.8rem',
    borderBottom: '2px solid #5b3a29',
    paddingBottom: '0.6rem',
  },
  card: {
    backgroundColor: '#fff8f2',
    padding: '1rem 1.3rem',
    borderRadius: '12px',
    fontSize: '1.3rem',
    fontWeight: '600',
    boxShadow: 'inset 0 0 12px #d4bfa4',
    marginBottom: '2.5rem',
    color: '#7b5238',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.1rem',
    marginBottom: '3rem',
  },
  input: {
    flex: '1 1 45%',
    minWidth: '160px',
    padding: '0.8rem 1.1rem',
    fontSize: '1rem',
    borderRadius: '10px',
    border: '2px solid #5b3a29',
    backgroundColor: '#fcf9f7',
    color: '#5b3a29',
    fontFamily: "'Georgia', serif",
    transition: 'border-color 0.3s ease',
  },
  select: {
    flex: '1 1 45%',
    minWidth: '160px',
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    borderRadius: '10px',
    border: '2px solid #5b3a29',
    backgroundColor: '#fcf9f7',
    color: '#5b3a29',
    fontFamily: "'Georgia', serif",
    appearance: 'none',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#a1745f',
    outline: 'none',
    boxShadow: '0 0 8px rgba(161, 116, 95, 0.35)',
  },
  button: {
    flex: '1 1 100%',
    padding: '1rem 0',
    backgroundColor: '#5b3a29',
    color: '#f9f5f0',
    fontSize: '1.2rem',
    fontWeight: '700',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: "'Georgia', serif",
    transition: 'background-color 0.3s ease',
    marginTop: '0.3rem',
  },
  buttonHover: {
    backgroundColor: '#a1745f',
  },
  expenseList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: 0,
  },
  expenseItem: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1.3fr 1.7fr',
    gap: '1rem',
    padding: '1rem 1.2rem',
    borderBottom: '1px solid #d7c9b9',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#5b3a29',
  },
  category: {
    fontStyle: 'italic',
    color: '#a1745f',
  },
  noExpenses: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#a1745f',
    marginTop: '1.2rem',
  },
  filterSortRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  downloadBtn: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#5b3a29',
    color: '#f9f5f0',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: "'Georgia', serif",
  },
  mostSpentCategory: {
    marginTop: '1rem',
    fontWeight: '600',
    fontSize: '1.1rem',
    color: '#5b3a29',
  },
};

const Home = () => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    note: '',
  });
  const [expenses, setExpenses] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [focusedInput, setFocusedInput] = useState(null);
  const [btnHover, setBtnHover] = useState(false);

  // New states for filter & sort
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, amount_desc, amount_asc

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(res.data);

      const todayDate = new Date().toISOString().slice(0, 10);
      const todayTotal = res.data
        .filter(e => e.date.slice(0, 10) === todayDate)
        .reduce((sum, e) => sum + e.amount, 0);
      setTotalToday(todayTotal);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      alert('Could not load expenses');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.amount) return alert('Title & amount required');

    try {
      await axios.post('http://localhost:5000/api/expenses', {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        note: form.note,
      });
      setForm({ title: '', amount: '', category: 'Food', note: '' });
      fetchExpenses();
    } catch (err) {
      console.error('Add expense error:', err);
      alert('Failed to add expense');
    }
  };

  // Filtered and sorted expenses memoized for performance
  const filteredSortedExpenses = useMemo(() => {
    let filtered = expenses;
    if (filterCategory !== 'All') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }

    switch (sortBy) {
      case 'date_asc':
        filtered = filtered.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date_desc':
        filtered = filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'amount_asc':
        filtered = filtered.slice().sort((a, b) => a.amount - b.amount);
        break;
      case 'amount_desc':
        filtered = filtered.slice().sort((a, b) => b.amount - a.amount);
        break;
      default:
        break;
    }
    return filtered;
  }, [expenses, filterCategory, sortBy]);

  // Calculate most spent category
  const mostSpentCategory = useMemo(() => {
    if (expenses.length === 0) return null;
    const categoryTotals = {};
    expenses.forEach(({ category, amount }) => {
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
    let maxCategory = null;
    let maxAmount = 0;
    for (const cat in categoryTotals) {
      if (categoryTotals[cat] > maxAmount) {
        maxAmount = categoryTotals[cat];
        maxCategory = cat;
      }
    }
    return { category: maxCategory, amount: maxAmount };
  }, [expenses]);

  // CSV Download Handler
  const downloadCSV = () => {
    if (expenses.length === 0) {
      alert('No expenses to download');
      return;
    }

    const headers = ['Title', 'Amount', 'Category', 'Note', 'Date'];
    const rows = filteredSortedExpenses.map(e => [
      e.title,
      e.amount,
      e.category,
      e.note || '',
      new Date(e.date).toLocaleDateString(),
    ]);

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.map(field => `"${field}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Home – Personal Expenses</h2>

        <div style={styles.card}>
          <strong>Total spent today:</strong> ₹{totalToday}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{
              ...styles.input,
              ...(focusedInput === 'title' ? styles.inputFocus : {}),
            }}
            onFocus={() => setFocusedInput('title')}
            onBlur={() => setFocusedInput(null)}
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            style={{
              ...styles.input,
              ...(focusedInput === 'amount' ? styles.inputFocus : {}),
            }}
            onFocus={() => setFocusedInput('amount')}
            onBlur={() => setFocusedInput(null)}
          />
          <select
                        name="category"
            value={form.category}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Others">Others</option>
          </select>

          <input
            type="text"
            name="note"
            placeholder="Note (optional)"
            value={form.note}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(focusedInput === 'note' ? styles.inputFocus : {}),
              flex: '1 1 100%',
            }}
            onFocus={() => setFocusedInput('note')}
            onBlur={() => setFocusedInput(null)}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(btnHover ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Add Expense
          </button>
        </form>

        <div style={styles.filterSortRow}>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Others">Others</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Amount High → Low</option>
            <option value="amount_asc">Amount Low → High</option>
          </select>

          <button onClick={downloadCSV} style={styles.downloadBtn}>
            Download CSV
          </button>
        </div>

        {filteredSortedExpenses.length === 0 ? (
          <div style={styles.noExpenses}>No expenses found.</div>
        ) : (
          <ul style={styles.expenseList}>
            {filteredSortedExpenses.map(exp => (
              <li key={exp._id} style={styles.expenseItem}>
                <span>{exp.title}</span>
                <span>₹{exp.amount}</span>
                <span style={styles.category}>{exp.category}</span>
                <span>{new Date(exp.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}

        {mostSpentCategory && (
          <div style={styles.mostSpentCategory}>
            Most spent on <strong>{mostSpentCategory.category}</strong> – ₹
            {mostSpentCategory.amount}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
