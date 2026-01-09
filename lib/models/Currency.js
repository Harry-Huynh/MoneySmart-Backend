const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Currency = sequelize.define('Currency', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  decimalDigits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  decimalSeparator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thousandSeparator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Currency;
