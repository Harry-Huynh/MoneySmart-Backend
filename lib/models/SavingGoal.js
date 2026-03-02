const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const SavingGoal = sequelize.define('SavingGoal', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  milestonesSent: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "[]",
},
achievedEmailAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
exceededEmailAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
});

module.exports = SavingGoal;
