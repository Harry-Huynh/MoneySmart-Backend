const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connected to Database');
  } catch (err) {
    console.error('Unable to connect to database:', err);
    throw err;
  }
}

module.exports = { sequelize, connectDB, Op };
