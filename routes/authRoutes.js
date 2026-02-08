const express = require('express');
const { passport } = require('../lib/passport');
const transactionService = require('../lib/services/transaction-service');
const savingGoalService = require('../lib/services/saving-goal-service');
const budgetService = require('../lib/services/budget-service');
const notificationService = require('../lib/services/notification-service');
const notificationSettingService = require('../lib/services/notification-setting-service');
const userService = require('../lib/services/user-service');

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
    const month = req.query.month;
    const year = req.query.year;
    let transactions = [];
    if (type) {
      transactions = await transactionService.getTransactionsByType(userId, type);
    } else if (month && year) {
      transactions = await transactionService.getTransactionByMonthAndYear(userId, month, year);
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
    const month = req.query.month;
    const year = req.query.year;

    const userId = req.user.userId;

    let budgets;

    if (month && year) {
      budgets = await budgetService.getBudgetsByMonthAndYear(userId, month, year);
    } else {
      budgets = await budgetService.getAllBudgets(userId);
    }

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

// notification-setting route
// get settings
router.get(
  '/notification-settings',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const settings = await notificationSettingService.getNotificationSettings(userId);
      return res.status(200).json({ settings });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

// update
router.put(
  '/notification-settings',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const msg = await notificationSettingService.updateNotificationSettings(userId, req.body);
      return res.status(200).json({ message: msg });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

// Security Setting - Change Password
// Verify Password
router.post(
  '/user/verify-password',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { password } = req.body;
      const isMatch = await userService.verifyPassword(userId, password);
      return res.status(200).json({ success: isMatch });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

router.put(
  '/user/change-password',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { newPassword } = req.body;
      const isSuccess = await userService.changePassword(userId, newPassword);
      return res.status(200).json({ success: isSuccess });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

router.get(
  '/user/change-password/date',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const lastChangeDate = await userService.getLastPasswordChangeDate(userId);
      return res.status(200).json({ lastChangeDate: lastChangeDate });
    } catch (e) {
      return res.status(422).json({ message: e.message });
    }
  }
);

// Account Setting Routes
router.get('/user/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const profile = await userService.getUserProfileById(req.user.userId);
    return res.status(200).json(profile);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.put('/user/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const allowedDateFormats = ['MM-DD-YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'];
    if (req.body.dateFormat && !allowedDateFormats.includes(req.body.dateFormat)) {
      return res.status(400).json({ message: 'Invalid dateFormat' });
    }

    const updated = await userService.updateCustomerProfileByUserId(req.user.userId, req.body);

    return res.status(200).json(updated);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
