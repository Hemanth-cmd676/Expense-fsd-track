const Group = require('../models/Group');
const User = require('../models/User');

// Create a group
exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Error creating group' });
  }
};

// Get all groups the user is part of
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching groups' });
  }
};
