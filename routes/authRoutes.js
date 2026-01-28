const express = require('express');
const { passport } = require('../lib/passport');
const transactionService = require('../lib/services/transaction-service');
const savingGoalService = require('../lib/services/saving-goal-service');
const budgetService = require('../lib/services/budget-service');
const notificationService = require('../lib/services/notification-service');

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
    const type = req.query.type;
    let transactions = [];
    if (type) {
      transactions = await transactionService.getTransactionsByType(userId, type);
    } else {
      transactions = await transactionService.getAllTransactions(userId);
    }
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

router.put(
  '/transaction/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const transactionId = req.params.id;
      const transactionMsg = await transactionService.updateTransaction(
        userId,
        transactionId,
        req.body
      );
      return res.status(200).json({ message: transactionMsg });
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

// Budget Routes
router.post('/budget', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgetMsg = await budgetService.addBudget(userId, req.body);
    return res.status(201).json({ message: budgetMsg });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
});

router.get('/budget/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgetId = req.params.id;
    const budget = await budgetService.getBudget(userId, budgetId);
    return res.status(200).json({ budget });
  } catch (e) {
    return res.status(404).json({ message: e.message });
  }
});

router.get('/budgets', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgets = await budgetService.getAllBudgets(userId);
    return res.status(200).json({
      count: budgets.length,
      budgets,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.put('/budget/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgetId = req.params.id;
    const budgetMsg = await budgetService.updateBudget(userId, budgetId, req.body);
    return res.status(200).json({ message: budgetMsg });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
});

router.delete('/budget/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgetId = req.params.id;
    const budgetMsg = await budgetService.deleteBudget(userId, budgetId);
    return res.status(200).json({ message: budgetMsg });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
});

// notification routes
router.post('/notification', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationMsg = await notificationService.addNotification(userId, req.body);
    return res.status(201).json({ message: notificationMsg });
  } catch (e) {
    return res.status(422).json({ message: e.message });
  }
});

router.get(
  '/notifications/unread',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const notifications = await notificationService.getUnreadNotifications(userId);
      return res.status(200).json({
        count: notifications.length,
        notifications,
      });
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  }
);

router.get('/notifications', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await notificationService.getAllNotifications(userId);
    return res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.get(
  '/notification/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const notificationId = req.params.id;
      const notificationMsg = await notificationService.getNotification(userId, notificationId);
      return res.status(200).json({ message: notificationMsg });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

router.put(
  '/notification/:id/read',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const notificationId = req.params.id;
      const notificationMsg = await notificationService.markNotificationAsRead(
        userId,
        notificationId
      );
      return res.status(200).json({ message: notificationMsg });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

router.put(
  '/notifications/read-all',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const notificationMsg = await notificationService.markAllNotificationsAsRead(userId);
      return res.status(200).json({ message: notificationMsg });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

router.delete(
  '/notification/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const notificationId = req.params.id;
      const notificationMsg = await notificationService.deleteNotification(userId, notificationId);
      return res.status(200).json({ message: notificationMsg });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

module.exports = router;
