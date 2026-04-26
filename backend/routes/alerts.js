import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

// GET all alerts (optionally query by userId: ?userId=...)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.user = req.query.userId;
    }
    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching alerts' });
  }
});

// POST a new alert (Upsert)
router.post('/', async (req, res) => {
  try {
    const { user, category, thresholdAmount, isActive } = req.body;

    if (!user || thresholdAmount === undefined) {
      return res.status(400).json({ error: 'Please provide required fields (user, thresholdAmount)' });
    }

    const savedAlert = await Alert.findOneAndUpdate(
      { user, category },
      { thresholdAmount, isActive },
      { new: true, upsert: true }
    );

    res.status(201).json(savedAlert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while saving alert' });
  }
});

// DELETE an alert
router.delete('/', async (req, res) => {
  try {
    const { user, category } = req.body;
    if (!user || !category) {
      return res.status(400).json({ error: 'Please provide required fields (user, category)' });
    }
    
    await Alert.findOneAndDelete({ user, category });
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting alert' });
  }
});

export default router;
