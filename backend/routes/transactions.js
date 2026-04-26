import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// GET all transactions (optionally query by userId: ?userId=...)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.user = req.query.userId;
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching transactions' });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  try {
    const { user, recipient, amount, category, method, status, date } = req.body;

    if (!user || !recipient || !amount || !category || !method) {
      return res.status(400).json({ error: 'Please provide all required fields (user, recipient, amount, category, method)' });
    }

    const transaction = new Transaction({
      user,
      recipient,
      amount,
      category,
      method,
      status,
      date
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while saving transaction' });
  }
});

// UPDATE a transaction
router.put('/:id', async (req, res) => {
  try {
    const { recipient, amount, category, method, status, date } = req.body;
    const updatedTx = await Transaction.findByIdAndUpdate(
      req.params.id, 
      { recipient, amount, category, method, status, date }, 
      { new: true }
    );
    if (!updatedTx) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json(updatedTx);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating transaction' });
  }
});

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  try {
    const deletedTx = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTx) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction deleted successfully', id: deletedTx._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting transaction' });
  }
});

export default router;
