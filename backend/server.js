const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // allow requests from frontend
app.use(express.json()); // to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const groupRoutes = require('./routes/groupRoutes');
app.use('/api/groups', groupRoutes);

const groupExpensesRoutes = require('./routes/groupExpense');
app.use('/api/group-expenses', groupExpensesRoutes);
console.log(typeof groupExpensesRoutes); 

const usersRouter = require('./routes/userRoutes');
app.use('/api/users', usersRouter);


// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/expenseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server after DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
