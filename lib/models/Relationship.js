const { DataTypes } = require('sequelize');

const Budget = require('./Budget');
const Currency = require('./Currency');
const Notification = require('./Notification');
const SavingGoal = require('./SavingGoal');
const Transaction = require('./Transaction');
const User = require('./User');
const Customer = require('./Customer');

// Customer to User: One-to-One
Customer.hasOne(User, {
  foreignKey: {
    name: 'customerId',
    type: DataTypes.UUID,
    allowNull: false,
  },
});
User.belongsTo(Customer);

// User to Budget: One-to-Many
User.hasMany(Budget, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
Budget.belongsTo(User);

// User to Transaction: One-to-Many
User.hasMany(Transaction, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
Transaction.belongsTo(User);

// User to SavingGoal: One-to-Many
User.hasMany(SavingGoal, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
SavingGoal.belongsTo(User);

// User to Notification: One-to-Many
User.hasMany(Notification, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
Notification.belongsTo(User);

// User to Currency: One-to-One
User.hasOne(Currency, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
Currency.belongsTo(User);

module.exports = {
  Budget,
  Currency,
  Notification,
  SavingGoal,
  Transaction,
  User,
  Customer,
};
