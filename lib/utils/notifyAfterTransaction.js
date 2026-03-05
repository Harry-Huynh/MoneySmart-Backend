const Budget = require('../models/Budget');
const SavingGoal = require('../models/SavingGoal');

async function checkBudgetAndBuildNotifications({ userId, budgetId, t }) {
  if (!budgetId) return [];

  const budget = await Budget.findOne({
    where: { id: budgetId, userId },
    ...(t ? { transaction: t } : {}),
  });
  if (!budget) return [];

  const usedAmount = Number(budget.usedAmount || 0);
  const totalAmount = Number(budget.amount || 0);
  const thresholdAmount = Number(budget.thresholdAmount || 0);

  if (totalAmount <= 0) return [];

  const progress = (usedAmount / totalAmount) * 100;
  const remaining = totalAmount - usedAmount;
  const EPSILON = 0.01;

  const now = new Date();
  const notifications = [];

  const sameDay = (a, b) => {
    if (!a || !b) return false;
    const da = new Date(a);
    const db = new Date(b);
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  };

  // exceed
  if (usedAmount > totalAmount) {
    if (!budget.lastOverspentEmailAt || !sameDay(budget.lastOverspentEmailAt, now)) {
      notifications.push({
        type: 'BUDGET_EXCEEDED',
        payload: {
          purpose: budget.purpose,
          amount: totalAmount,
          usedAmount,
          thresholdAmount,
          endDate: budget.endDate,
          overBy: usedAmount - totalAmount,
        },
      });
      await budget.update({ lastOverspentEmailAt: now }, t ? { transaction: t } : {});
    }
    return notifications;
  }

  // used all the budget
  if (Math.abs(usedAmount - totalAmount) < EPSILON) {
    if (!budget.sentUsedAllEmailAt || !sameDay(budget.sentUsedAllEmailAt, now)) {
      notifications.push({
        type: 'BUDGET_USED_ALL',
        payload: {
          purpose: budget.purpose,
          amount: totalAmount,
          usedAmount,
          thresholdAmount,
          endDate: budget.endDate,
        },
      });
      await budget.update({ sentUsedAllEmailAt: now }, t ? { transaction: t } : {});
    }
    return notifications;
  }

  // 80% reach
  if (progress >= 80 && remaining > thresholdAmount) {
    if (!budget.sent80EmailAt || !sameDay(budget.sent80EmailAt, now)) {
      notifications.push({
        type: 'BUDGET_PROGRESS_80',
        payload: {
          purpose: budget.purpose,
          amount: totalAmount,
          usedAmount,
          thresholdAmount,
          endDate: budget.endDate,
          progress,
        },
      });
      await budget.update({ sent80EmailAt: now }, t ? { transaction: t } : {});
    }
    return notifications;
  }

  // 50% reach
  if (progress >= 50 && progress < 80 && remaining > thresholdAmount) {
    if (!budget.sent50EmailAt || !sameDay(budget.sent50EmailAt, now)) {
      notifications.push({
        type: 'BUDGET_PROGRESS_50',
        payload: {
          purpose: budget.purpose,
          amount: totalAmount,
          usedAmount,
          thresholdAmount,
          endDate: budget.endDate,
          progress,
        },
      });
      await budget.update({ sent50EmailAt: now }, t ? { transaction: t } : {});
    }
    return notifications;
  }

  // threshold
  if (remaining <= thresholdAmount) {
    if (!budget.lastThresholdEmailAt || !sameDay(budget.lastThresholdEmailAt, now)) {
      notifications.push({
        type: 'BUDGET_THRESHOLD',
        payload: {
          purpose: budget.purpose,
          amount: totalAmount,
          usedAmount,
          thresholdAmount,
          endDate: budget.endDate,
          remaining,
        },
      });
      await budget.update({ lastThresholdEmailAt: now }, t ? { transaction: t } : {});
    }
  }

  return notifications;
}

async function checkGoalAndBuildNotifications({ userId, savingGoalId, t, addedAmount = 0 }) {
  if (!savingGoalId) return [];

  const goal = await SavingGoal.findOne({
    where: { id: savingGoalId, userId },
    ...(t ? { transaction: t } : {}),
  });
  if (!goal) return [];

  const currentAfter = Number(goal.currentAmount || 0);
  const target = Number(goal.targetAmount || 0);
  if (target <= 0) return [];

  const currentBefore = Math.max(0, currentAfter - Number(addedAmount || 0));

  const ratioBefore = currentBefore / target;
  const ratioAfter = currentAfter / target;

  const notifications = [];

  // parse sent milestones
  let sent = [];
  try {
    sent = JSON.parse(goal.milestonesSent || '[]');
  } catch {
    sent = [];
  }

  if (ratioBefore >= 1 && Number(addedAmount) > 0) {
    if (!goal.exceededEmailAt) {
      notifications.push({
        type: 'GOAL_EXCEEDED',
        payload: {
          purpose: goal.purpose || goal.name,
          currentAmount: currentAfter,
          targetAmount: target,
          targetDate: goal.targetDate,
          exceededBy: Math.max(0, currentAfter - target),
        },
      });
      await goal.update({ exceededEmailAt: new Date() }, t ? { transaction: t } : {});
    }
    return notifications;
  }

  // exceed 100% first time
  if (ratioAfter >= 1 && ratioBefore < 1 && !goal.achievedEmailAt) {
    notifications.push({
      type: 'GOAL_ACHIEVED',
      payload: {
        purpose: goal.purpose || goal.name,
        currentAmount: currentAfter,
        targetAmount: target,
        targetDate: goal.targetDate,
      },
    });
    await goal.update({ achievedEmailAt: new Date() }, t ? { transaction: t } : {});
    return notifications;
  }

  const milestones = [0.3, 0.5, 0.8];
  const crossed = milestones
    .filter((m) => ratioBefore < m && ratioAfter >= m)
    .sort((a, b) => b - a)[0];

  if (crossed) {
    const milestonePct = Math.round(crossed * 100);
    if (!sent.includes(milestonePct)) {
      notifications.push({
        type: 'GOAL_MILESTONE',
        payload: {
          purpose: goal.purpose || goal.name,
          milestone: milestonePct,
          currentAmount: currentAfter,
          targetAmount: target,
          targetDate: goal.targetDate,
        },
      });

      sent.push(milestonePct);
      await goal.update({ milestonesSent: JSON.stringify(sent) }, t ? { transaction: t } : {});
    }
  }

  return notifications;
}

module.exports = { checkBudgetAndBuildNotifications, checkGoalAndBuildNotifications };
