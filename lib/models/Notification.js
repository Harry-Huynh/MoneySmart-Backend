const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('BILL', 'BUDGET', 'SAVING_GOAL', 'AI_INSIGHT'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deliveryMethod: {
    type: DataTypes.ENUM('EMAIL', 'PUSH_NOTIFICATION'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('UNREAD', 'READ'),
    allowNull: false,
    defaultValue: 'UNREAD',
  },
});

module.exports = Notification;
