const express = require('express');
const router = express.Router();
const groupExpenseController = require('../controllers/groupExpenseController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/group-expenses
router.post('/', authMiddleware, groupExpenseController.createGroupExpense);

module.exports = router;
