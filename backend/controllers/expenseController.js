const Expense = require('../models/Expense');
const { Parser } = require('json2csv');

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, note, date } = req.body;

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category,
      note,
      date
    });

    await expense.save();
    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (err) {
    res.status(500).json({ message: 'Error adding expense', error: err.message });
  }
};

// Get all expenses of logged-in user with optional filters and sorting
const getExpenses = async (req, res) => {
  try {
    const { category, sortBy, order } = req.query;
    const filter = { user: req.user.id };
    if (category) {
      filter.category = category;
    }

    let sort = {};
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      sort[sortBy] = sortOrder;
    } else {
      sort = { date: -1 };
    }

    const expenses = await Expense.find(filter).sort(sort);
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', error: err.message });
  }
};

// Download expenses as CSV
const downloadExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    const fields = ['title', 'amount', 'category', 'note', 'date'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(expenses);

    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Error downloading expenses', error: err.message });
  }
};

module.exports = { createExpense, getExpenses, downloadExpenses };
