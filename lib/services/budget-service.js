const { sequelize, Op } = require('../db');
const Budget = require('../models/Budget');
const User = require('../models/User');

// add
module.exports.addBudget = async function (userId, budgetData) {
  await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    if (!user) {
      throw new Error('No budget found with the given userId');
    }

    await Budget.create(
      {
        amount: budgetData.amount,
        purpose: budgetData.purpose,
        startDate: budgetData.startDate,
        endDate: budgetData.endDate,
        thresholdAmount: budgetData.thresholdAmount,
        note: budgetData.note,
        userId: user.id,
      },
      {
        transaction: t,
      }
    );
  });

  return 'Budget is added successfully!';
};
// update
module.exports.updateBudget = async function (userId, budgetId, budgetData) {
  await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    if (!user) {
      throw new Error('No budget found with the given userId');
    }

    const [updatedRows] = await Budget.update(
      {
        amount: budgetData.amount,
        purpose: budgetData.purpose,
        startDate: budgetData.startDate,
        endDate: budgetData.endDate,
        thresholdAmount: budgetData.thresholdAmount,
        note: budgetData.note,
      },
      {
        where: {
          id: budgetId,
          userId: user.id,
        },
        transaction: t,
      }
    );

    if (updatedRows === 0) {
      throw new Error(
        'Failed to update the budget because the budget does not EXIT or not belong to the current user '
      );
    }
  });

  return 'Budget data is updated successfully!';
};

// get all
module.exports.getAllBudgets = async function (userId) {
  const budgets = await Budget.findAll({
    where: {
      userId: userId,
    },
    order: [['createdAt', 'DESC']],
  });
  return budgets;
};

// get one
module.exports.getBudget = async function (userId, budgetId) {
  const budget = await Budget.findOne({
    where: {
      userId: userId,
      id: budgetId,
    },
  });
  return budget;
};

module.exports.getBudgetsByMonthAndYear = async function (userId, month, year) {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  const monthStart = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));
  const monthEnd = new Date(Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59));

  const budget = await Budget.findAll({
    where: {
      userId: userId,
      startDate: { [Op.lte]: monthEnd },
      endDate: { [Op.gte]: monthStart },
    },
  });

  return budget;
};

// delete
module.exports.deleteBudget = async function (userId, budgetId) {
  const deletedBudget = await Budget.destroy({
    where: {
      userId: userId,
      id: budgetId,
    },
  });

  if (deletedBudget === 0) {
    throw new Error('Budget does not EXIT or not belong to the current user');
  }

  return 'Budget is deleted successfully!';
};
