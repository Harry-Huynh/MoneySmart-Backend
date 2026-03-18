const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const pg = require('pg');

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  isTest ? process.env.TEST_DB_USER : process.env.DB_USER,
  isTest ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
  {
    host: isTest ? process.env.TEST_DB_HOST : process.env.DB_HOST,
    dialect: 'postgres',
    dialectModule: pg,
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

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
