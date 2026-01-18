const { sequelize } = require('../db');
const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');

module.exports.addTransaction = async function (userId, transactionData) {
  await sequelize.transaction(async (t) => {
    const customer = await Customer.findOne({
      where: { userId },
      transaction: t,
    });

    if (!customer) {
      throw new Error('There is no customer has matching userId with transaction.');
    }

    const trans = await Transaction.create(
      {
        userId,
        type: transactionData.type,
        description: transactionData.description ?? null,
        amount: transactionData.amount,
        date: transactionData.date,
        note: transactionData.note ?? null,
        paymentMethod: transactionData.paymentMethod,
      },
      {
        transaction: t,
      }
    );

    if (trans.type === 'INCOME') {
      await Customer.increment('currentBalance', {
        by: trans.amount,
        where: { id: customer.id },
        transaction: t,
      });
    } else {
      await Customer.decrement('currentBalance', {
        by: trans.amount,
        where: { id: customer.id },
        transaction: t,
      });
    }
  });

  return `Transaction is added successfully`;
};

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

module.exports.getAllTransactions = async function (userId) {
  const transactions = await Transaction.findAll({
    where: {
      userId: userId,
    },
    order: [['date', 'DESC']],
  });
  return transactions;
};

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

    if (deleteTrans.type === 'INCOME') {
      await Customer.decrement('currentBalance', {
        by: deleteTrans.amount,
        where: { userId },
        transaction: t,
      });
    } else {
      await Customer.increment('currentBalance', {
        by: deleteTrans.amount,
        where: { userId },
        transaction: t,
      });
    }

    await deleteTrans.destroy({ transaction: t });
    return `Transaction is deleted successfully!`;
  });
};
