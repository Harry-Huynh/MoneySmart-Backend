const express = require('express');
const { passport } = require('../lib/passport');
const transactionService = require('../lib/transaction-service');

const router = express.Router();

router.post('/transaction', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const transMsg = await transactionService.addTransaction(userId, req.body);
    return res.status(201).json({ message: transMsg });
  } catch (e) {
    return res.status(422).json({ message: String(e) });
  }
});

router.get(
  '/transaction/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const id = req.params.id;
      const transaction = await transactionService.getTransaction(userId, id);
      return res.status(200).json({ transaction });
    } catch (e) {
      return res.status(404).json({ message: String(e) });
    }
  }
);

router.get('/transactions', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await transactionService.getAllTransactions(userId);
    return res.status(200).json({
      count: transactions.length, // may put it here or can check at front end
      transactions,
    });
  } catch (e) {
    return res.status(500).json({ message: String(e) });
  }
});

router.delete(
  '/transaction/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const transactionId = req.params.id;
      const deleteMsg = await transactionService.deleteTransaction(userId, transactionId);
      return res.status(200).json({ message: deleteMsg });
    } catch (e) {
      return res.status(422).json({ message: String(e) });
    }
  }
);

module.exports = router;
