const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const NotificationSetting = sequelize.define('NotificationSetting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: true,
  },

  enableNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  pushNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  billReminders: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  budgetAlerts: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  savingsGoalReminders: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  aiInsights: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = NotificationSetting;
