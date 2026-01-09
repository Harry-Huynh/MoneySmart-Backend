require('dotenv').config();
console.log('✅ index.js started');
const express = require('express');
const cors = require('cors');

const { connectDB, sequelize } = require('./lib/db.js');

const { passport } = require('./lib/passport');
const authRouter = require('./routes/authRoutes.js');
const publicRouter = require('./routes/publicRoutes.js');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get('/', (req, res) => res.json({ message: 'MoneySmart API is running' }));
app.use('/api', authRouter);
app.use('/api', publicRouter);

app.use((req, res) => res.status(404).end());

(async () => {
  try {
    await connectDB();
    console.log('Connect to DB done');
    await sequelize.sync(); // create tables from models if missing tables

    app.listen(HTTP_PORT, () => {
      console.log('API listening on: ' + HTTP_PORT);
    });
  } catch (err) {
    console.error('Project Startup error', err);
  }
})();
