const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('INCOME', 'EXPENSE', 'TRANSFER'),
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
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Transaction;
