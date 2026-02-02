const { sequelize, Op } = require('../db');
const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');
const Budget = require('../models/Budget');
const SavingGoal = require('../models/SavingGoal');

module.exports.addTransaction = async function (userId, transactionData) {
  return await sequelize.transaction(async (t) => {
    // Validate if both savingId and budgetId are passed into function
    if (transactionData.budgetId && transactionData.savingGoalId) {
      throw new Error('Transaction cannot belong to both budgetId and savingId');
    }

    if (transactionData.budgetId && transactionData.type !== 'EXPENSE') {
      throw new Error('BudgetId can only be used with Expense');
    }
    if (transactionData.savingGoalId && transactionData.type !== 'EXPENSE') {
      throw new Error('SavingGoalId can only be used with Expense');
    }

    // Validate if customer exists
    const customer = await Customer.findOne({
      where: { userId },
      transaction: t,
    });

    if (!customer) {
      throw new Error('There is no customer has matching userId with transaction.');
    }

    // Create a transaction
    const trans = await Transaction.create(
      {
        userId,
        type: transactionData.type,
        category: transactionData.category,
        amount: transactionData.amount,
        date: transactionData.date,
        note: transactionData.note ?? null,
        paymentMethod: transactionData.paymentMethod,
        budgetId: transactionData.budgetId ?? null,
        savingGoalId: transactionData.savingGoalId ?? null,
      },
      {
        transaction: t,
      }
    );
    await applyBalanceUpdates({ userId, trans, t });
    return `Transaction is added successfully`;
  });
};

async function applyBalanceUpdates({ userId, trans, t }) {
  // Update Current Balance in Customer Model
  if (trans.type === 'INCOME') {
    await Customer.increment('currentBalance', {
      by: trans.amount,
      where: { userId },
      transaction: t,
    });
  } else {
    await Customer.decrement('currentBalance', {
      by: trans.amount,
      where: { userId },
      transaction: t,
    });
  }

  // Update Budget usedAmount - for budget related expenses only
  if (trans.budgetId) {
    Budget.increment('usedAmount', {
      by: trans.amount,
      where: { id: trans.budgetId, userId },
      transaction: t,
    });
  }

  // Update Saving Goal currentAmount - for savingGoal related expenses only
  if (trans.savingGoalId) {
    SavingGoal.increment('currentAmount', {
      by: trans.amount,
      where: { id: trans.savingGoalId, userId },
      transaction: t,
    });
  }
}

// Get 1 transaction
module.exports.getTransaction = async function (userId, transactionId) {
  const transaction = await Transaction.findOne({
    where: {
      userId: userId,
      id: transactionId,
    },
  });

  if (!transaction) {
    throw new Error(`Transaction does not exist OR does not belong to current user`);
  }
  return transaction;
};

// Get all transactions
module.exports.getAllTransactions = async function (userId) {
  const transactions = await Transaction.findAll({
    where: {
      userId: userId,
    },
    order: [['date', 'DESC']],
  });
  return transactions;
};

// Get transaction by type
module.exports.getTransactionsByType = async function (userId, type) {
  const transactions = await Transaction.findAll({
    where: {
      userId: userId,
      type: type,
    },
    order: [['date', 'DESC']],
  });
  return transactions;
};

module.exports.getTransactionByMonthAndYear = async function (userId, month, year) {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  const monthStart = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));
  const monthEnd = new Date(Date.UTC(yearNum, monthNum + 1, 1, 0, 0, 0));

  const transactions = await Transaction.findAll({
    where: {
      userId: userId,
      date: { [Op.gte]: monthStart, [Op.lt]: monthEnd },
    },
  });
  return transactions;
};

// Delete a Transaction
module.exports.deleteTransaction = async function (userId, transactionId) {
  return await sequelize.transaction(async (t) => {
    const deleteTrans = await Transaction.findOne({
      where: {
        userId: userId,
        id: transactionId,
      },
      transaction: t,
    });

    if (!deleteTrans) {
      throw new Error('Transaction does not exist OR does not belong to current user');
    }

    await reverseBalancesUpdate({ userId, trans: deleteTrans, t });

    await deleteTrans.destroy({ transaction: t });
    return `Transaction is deleted successfully!`;
  });
};

async function reverseBalancesUpdate({ userId, trans, t }) {
  if (trans.type === 'INCOME') {
    await Customer.decrement('currentBalance', {
      by: trans.amount,
      where: { userId },
      transaction: t,
    });
  } else {
    await Customer.increment('currentBalance', {
      by: trans.amount,
      where: { userId },
      transaction: t,
    });

    // Update Budget usedAmount - for budget related expenses only
    if (trans.budgetId) {
      Budget.decrement('usedAmount', {
        by: trans.amount,
        where: { id: trans.budgetId, userId },
        transaction: t,
      });
    }

    // Update Saving Goal currentAmount - for savingGoal related expenses only
    if (trans.savingGoalId) {
      SavingGoal.decrement('currentAmount', {
        by: trans.amount,
        where: { id: trans.savingGoalId, userId },
        transaction: t,
      });
    }
  }
}

// Update a transaction
module.exports.updateTransaction = async function (userId, transactionId, newTransactionInfo) {
  return await sequelize.transaction(async (t) => {
    const oldTransaction = await Transaction.findOne({
      where: { id: transactionId, userId },
      transaction: t,
    });

    if (!oldTransaction) {
      throw new Error('Transaction does not exist OR does not belong to current user');
    }

    // Update current balance as well as usedAmount/currentAmount in Budget/SavingGoal
    await reverseBalancesUpdate({ userId, trans: oldTransaction, t });

    // Verify if the new information contains both budgetId and savingId
    if (newTransactionInfo.budgetId && newTransactionInfo.savingGoalId) {
      throw new Error('Transaction cannot belong to both Budget and Saving');
    }

    // Verify if transaction type != "EXPENSE" but budgetId exists
    if (newTransactionInfo.budgetId && newTransactionInfo.type != 'EXPENSE') {
      throw new Error('BudgetId can only be used with Expense');
    }

    // Verify if transaction type != "EXPENSE" but savingGoalId exists
    if (newTransactionInfo.savingGoalId && newTransactionInfo.type != 'EXPENSE') {
      throw new Error('SavingGoalId can only be used with Expense');
    }

    const updatedTransaction = await oldTransaction.update({
      type: newTransactionInfo.type,
      category: newTransactionInfo.category,
      amount: newTransactionInfo.amount,
      date: newTransactionInfo.date,
      note: newTransactionInfo.note ?? null,
      paymentMethod: newTransactionInfo.paymentMethod,
      budgetId: newTransactionInfo.budgetId ?? null,
      savingGoalId: newTransactionInfo.savingGoalId ?? null,
    });

    await applyBalanceUpdates({ userId, trans: updatedTransaction, t });
    return 'Transaction is updated successfully';
  });
};
