const {DataTypes} = require("sequelize");
const {sequelize} = require("../db");

const User = sequelize.define('User', {
    name: {type: DataTypes.STRING, allowNull: false},
    userName: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    region: {type: DataTypes.STRING},
    currency: {type: DataTypes.STRING},
    date_format: {type: DataTypes.STRING},
})

module.exports = User;