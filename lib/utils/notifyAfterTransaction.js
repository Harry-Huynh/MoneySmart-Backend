const Budget = require("../models/Budget");
const SavingGoal = require("../models/SavingGoal");

async function checkBudgetAndBuildNotifications({ userId, budgetId, t }) {
  if (!budgetId) return [];

  const budget = await Budget.findOne({
    where: { id: budgetId, userId },
    transaction: t,
  });
  if (!budget) return [];

  const used = Number(budget.usedAmount || 0);
  const amount = Number(budget.amount || 0);
  const threshold = Number(budget.thresholdAmount || 0);
  const notifications = [];

  const now = new Date();

  function isSameDay(a, b) {
    if (!a || !b) return false;
    const da = new Date(a);
    const db = new Date(b);
    return da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate();
  }

  if (amount > 0 && used > amount) {
    if (!budget.lastOverspentEmailAt || !isSameDay(budget.lastOverspentEmailAt, now)) {
      notifications.push({
        type: "BUDGET_OVERSPENT",
        payload: { purpose: budget.purpose, amount, usedAmount: used, thresholdAmount: threshold, endDate: budget.endDate },
      });

      await budget.update({ lastOverspentEmailAt: now }, { transaction: t });
    }
    return notifications;
  }

  if (threshold > 0 && used >= threshold) {
    if (!budget.lastThresholdEmailAt || !isSameDay(budget.lastThresholdEmailAt, now)) {
      notifications.push({
        type: "BUDGET_THRESHOLD",
        payload: { purpose: budget.purpose, amount, usedAmount: used, thresholdAmount: threshold, endDate: budget.endDate },
      });

      await budget.update({ lastThresholdEmailAt: now }, { transaction: t });
    }
  }

  return notifications;
}

async function checkGoalAndBuildNotifications({ userId, savingGoalId, t }) {
  if (!savingGoalId) return [];

  const goal = await SavingGoal.findOne({ where: { id: savingGoalId, userId }, transaction: t });
  if (!goal) return [];

  const current = Number(goal.currentAmount || 0);
  const target = Number(goal.targetAmount || 0);
  if (target <= 0) return [];

  const percent = (current / target) * 100;

  const notifications = [];

  let sentMilestones = [];
  try {
    sentMilestones = JSON.parse(goal.milestonesSent || "[]");
  } catch {
    sentMilestones = [];
  }

  // GOAL ACHIEVED 
  if (percent >= 100 && !goal.achievedEmailAt) {
    notifications.push({
      type: "GOAL_ACHIEVED",
      payload: {
        purpose: goal.purpose || goal.name,
        currentAmount: current,
        targetAmount: target,
        targetDate: goal.targetDate,
      },
    });

    // mark as sent
    await goal.update({ achievedEmailAt: new Date() },  { transaction: t});
    return notifications;
  }


  const milestones = [50,80];

  for (const m of milestones) {
    if (percent >= m && !sentMilestones.includes(m)) {
      notifications.push({
        type: "GOAL_MILESTONE",
        payload: {
          purpose: goal.purpose || goal.name,
          milestone: m,
          currentAmount: current,
          targetAmount: target,
          targetDate: goal.targetDate,
        },
      });

      sentMilestones.push(m);

      await goal.update({
        milestonesSent: JSON.stringify(sentMilestones),
      }, { transaction: t });

      break;
    }
  }

  return notifications;
}
module.exports = { checkBudgetAndBuildNotifications, checkGoalAndBuildNotifications };