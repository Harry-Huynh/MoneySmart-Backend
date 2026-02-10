const { DataTypes } = require('sequelize');

const Budget = require('./Budget');
const Currency = require('./Currency');
const Notification = require('./Notification');
const SavingGoal = require('./SavingGoal');
const Transaction = require('./Transaction');
const User = require('./User');
const Customer = require('./Customer');
const NotificationSetting=require('./NotificationSetting');

// User to Customer: One-to-One
User.hasOne(Customer, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
    allowNull: false,
  },
});
Customer.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
    allowNull: false,
  },
});

// User to Budget: One-to-Many
User.hasMany(Budget, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
Budget.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});

// User to Transaction: One-to-Many
User.hasMany(Transaction, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
Transaction.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});

// User to SavingGoal: One-to-Many
User.hasMany(SavingGoal, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});
SavingGoal.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
});

// User to Notification: One-to-Many
User.hasMany(Notification, {
  foreignKey: {
    name: 'userId',
    onDelete: "CASCADE"
  },
});
Notification.belongsTo(User, {
  foreignKey: {
    name: 'userId',
  },
});
// User to Notification Setting: One-to-One
User.hasOne(NotificationSetting, {
  foreignKey: {
    name: 'userId',
  },
  onDelete: "CASCADE",
});
NotificationSetting.belongsTo(User, {
  foreignKey: {
    name: 'userId',
  },
});

// Currency to User: One-to-Many
User.belongsTo(Currency, {
  foreignKey: {
    name: 'currencyCode',
    type: DataTypes.STRING,
  },
});
Currency.hasMany(User, {
  foreignKey: {
    name: 'currencyCode',
    type: DataTypes.STRING,
  },
});

// Budget to Transaction: One-to-Many
Transaction.belongsTo(Budget, {
  foreignKey: {
    name: 'budgetId',
    type: DataTypes.UUID,
  },
});

// SavingGoal to Transaction: One-to-Many
Transaction.belongsTo(SavingGoal, {
  foreignKey: {
    name: 'savingGoalId',
    type: DataTypes.UUID,
  },
});


module.exports = {
  Budget,
  Currency,
  Notification,
  SavingGoal,
  Transaction,
  User,
  Customer,
};
