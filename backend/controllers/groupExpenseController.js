const Group = require('../models/Group');
const GroupExpense = require('../models/GroupExpense');
const Expense = require('../models/Expense');

// Create a group expense and corresponding personal expenses
exports.createGroupExpense = async (req, res) => {
  try {
   const { groupId, paidBy, amount, splitBetween, category, date } = req.body;


    // 1. Find group by id to get group name
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // 2. Create the GroupExpense document
    const groupExpense = new GroupExpense({
  group: groupId,
  paidBy,
  amount,
  title: 'Group Expense',
  note: category || '',  // or create a separate 'category' field in GroupExpense model
  splitAmong: splitBetween,
  settled: false
});

    await groupExpense.save();

    // 3. Calculate share per member
    const share = amount / splitBetween.length;

    // 4. Create personal Expense for each member
    const personalExpenses = splitBetween.map(userId => ({
  user: userId,
  title: `GROUP: ${group.name}`,
  amount: share,
  category: category,          // correctly set the category
  note: category || '',        // optionally still keep a note
  date: date || Date.now(),
}));


    // 5. Save all personal expenses at once
    await Expense.insertMany(personalExpenses);

    res.status(201).json({ 
      message: 'Group expense created and personal expenses recorded', 
      groupExpense 
    });

  } catch (err) {
    console.error('Error creating group expense:', err);
    res.status(500).json({ message: 'Server error creating group expense' });
  }
};
