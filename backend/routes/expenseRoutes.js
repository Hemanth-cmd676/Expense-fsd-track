const express = require('express');
const { createExpense, getExpenses, downloadExpenses } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST - Add a new expense
router.post('/', authMiddleware, createExpense);

// GET - Fetch all expenses of user with optional filters and sorting
router.get('/', authMiddleware, getExpenses);

// GET - Download expenses as CSV
router.get('/download', authMiddleware, downloadExpenses);

module.exports = router;
