const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('BUDGET', 'SAVING', 'OTHER'),
    allowNull: false, // change from true -> false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('INCOME', 'EXPENSE'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.ENUM('CASH', 'CHEQUE', 'CARD'),
    allowNull: false,
  },
});

module.exports = Transaction;
