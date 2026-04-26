import express from 'express';
import Goal from '../models/Goal.js';

const router = express.Router();

// GET all goals for a user
router.get('/', async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }
    const goals = await Goal.find({ user: req.query.userId }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching goals' });
  }
});

// POST a new goal
router.post('/', async (req, res) => {
  try {
    const { user, title, targetAmount, currentAmount, deadline, color } = req.body;

    if (!user || !title || targetAmount === undefined || targetAmount === null || !deadline) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const goal = new Goal({
      user, title, targetAmount, currentAmount, deadline, color
    });

    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while saving goal' });
  }
});

// PUT (update) a goal
router.put('/:id', async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, color } = req.body;
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id, 
      { title, targetAmount, currentAmount, deadline, color }, 
      { new: true }
    );
    if (!updatedGoal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating goal' });
  }
});

// DELETE a goal
router.delete('/:id', async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting goal' });
  }
});

export default router;
