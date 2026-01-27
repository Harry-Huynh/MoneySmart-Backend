const { sequelize } = require('../db');
const SavingGoal = require('../models/SavingGoal');
const User = require('../models/User');

module.exports.addSavingGoal = async function (userId, savingGoal) {
  await sequelize.transaction(async (t) => {
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      throw new Error('User not found');
    }

    await SavingGoal.create(
      {
        purpose: savingGoal.purpose,
        targetAmount: savingGoal.targetAmount,
        targetDate: savingGoal.targetDate,
        note: savingGoal.note,
        userId: user.id,
      },
      {
        transaction: t,
      }
    );
  });

  return 'Saving goal is added successfully!';
};

module.exports.updateSavingGoal = async function (userId, savingGoalId, savingGoal) {
  await sequelize.transaction(async (t) => {
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      throw new Error('User not found');
    }

    const [updatedRows] = await SavingGoal.update(
      {
        note: savingGoal.note,
        targetAmount: savingGoal.targetAmount,
        targetDate: savingGoal.targetDate,
        purpose: savingGoal.purpose,
      },
      {
        where: {
          id: savingGoalId,
          userId: user.id,
        },
        transaction: t,
      }
    );

    if (updatedRows === 0) {
      throw new Error(
        'Failed to update saving goal because saving goal does not exist OR does not belong to current user'
      );
    }
  });

  return 'Saving goal is updated successfully!';
};

module.exports.getAllSavingGoals = async function (userId) {
  return await SavingGoal.findAll({
    where: {
      userId: userId,
    },
    order: [['createdAt', 'DESC']],
  });
};

module.exports.getSavingGoal = async function (userId, savingGoalId) {
  return await SavingGoal.findOne({
    where: {
      userId: userId,
      id: savingGoalId,
    },
  });
};

module.exports.deleteSavingGoal = async function (userId, savingGoalId) {
  const deletedCount = await SavingGoal.destroy({
    where: {
      userId: userId,
      id: savingGoalId,
    },
  });

  if (deletedCount === 0) {
    throw new Error('Saving goal does not exist OR does not belong to current user');
  }

  return 'Saving goal is deleted successfully!';
};
