require('dotenv').config();
console.log('index.js started');

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const { connectDB, sequelize } = require('./lib/db.js');
require('./lib/models/User');
require('./lib/models/Customer');
require('./lib/models/Currency');
require('./lib/models/Relationship');
const { passport } = require('./lib/passport');
const authRouter = require('./routes/authRoutes.js');
const publicRouter = require('./routes/publicRoutes.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.get('/', (req, res) => res.json({ message: 'MoneySmart API is running' }));
app.use('/api', authRouter);
app.use('/api', publicRouter);

// 404 fallback
app.use((req, res) => res.status(404).end());

// Connect to DB once per cold start
let dbConnected = false;
const connectOnce = async () => {
  if (!dbConnected) {
    await connectDB();
    await sequelize.sync(); // create tables if missing
    dbConnected = true;
    console.log('Connect to DB done');
  }
};

// Export the serverless handler
module.exports = serverless(async (req, res) => {
  await connectOnce();
  return app(req, res);
});
