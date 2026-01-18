const express = require('express');
const { passport } = require('../lib/passport');
const transactionService = require('../lib/services/transaction-service');
const savingGoalService = require('../lib/services/saving-goal-service');

const router = express.Router();

// Transaction Routes
router.post('/transaction', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const transMsg = await transactionService.addTransaction(userId, req.body);
    return res.status(201).json({ message: transMsg });
  } catch (e) {
    return res.status(422).json({ message: e.message });
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
      return res.status(404).json({ message: e.message });
    }
  }
);

router.get('/transactions', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await transactionService.getAllTransactions(userId);
    return res.status(200).json({
      count: transactions.length,
      transactions,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
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
      return res.status(422).json({ message: e.message });
    }
  }
);

// Saving Goal Routes
router.post('/saving-goal', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const savingGoalMsg = await savingGoalService.addSavingGoal(userId, req.body);
    return res.status(201).json({ message: savingGoalMsg });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
});

router.get('/saving-goals', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const savingGoals = await savingGoalService.getAllSavingGoals(userId);
    return res.status(200).json({
      count: savingGoals.length,
      savingGoals,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.get(
  '/saving-goal/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const savingGoalId = req.params.id;
      const savingGoal = await savingGoalService.getSavingGoal(userId, savingGoalId);
      return res.status(200).json({ savingGoal });
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  }
);

router.put(
  '/saving-goal/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const savingGoalId = req.params.id;
      const savingGoalMsg = await savingGoalService.updateSavingGoal(
        userId,
        savingGoalId,
        req.body
      );
      return res.status(200).json({ message: savingGoalMsg });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

router.delete(
  '/saving-goal/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const savingGoalId = req.params.id;
      const savingGoalMsg = await savingGoalService.deleteSavingGoal(userId, savingGoalId);
      return res.status(200).json({ message: savingGoalMsg });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

module.exports = router;
