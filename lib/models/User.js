const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notificationSettings: {
  type: DataTypes.JSONB,
  allowNull: false,
  defaultValue: {
    enableNotifications: true,
    pushNotifications: true,
    emailNotifications: true,
    billReminders: true,
    budgetAlerts: true,
    savingsGoalReminders: true,
    aiInsights: true
  }
}

});

module.exports = User;
