require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');

const userService = require('./services/user-service');
const { RegisterRoute, LoginRoute } = require('./routes/User');
const { GetTasks, AddTask, UpdateTask, DeleteTask } = require('./routes/Task');

const app = express();
app.use(cors());
app.use(express.json());

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET,
};

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  if (jwt_payload) {
    next(null, {
      _id: jwt_payload._id,
      userName: jwt_payload.userName,
    });
  } else {
    next(null, false);
  }
});

passport.use(strategy);
app.use(passport.initialize());

// Routes
app.get('/', (req, res) => res.send('Server is running!'));

app.post(RegisterRoute, (req, res) => {
  userService
    .registerUser(req.body)
    .then((msg) => res.json({ message: msg }))
    .catch((err) => res.status(422).json({ message: err }));
});

app.post(LoginRoute, (req, res) => {
  userService
    .checkUser(req.body)
    .then((user) => {
      const payload = { _id: user._id, userName: user.userName };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ message: 'Login successful', token });
    })
    .catch((err) => res.status(422).json({ message: err }));
});

app.get(GetTasks, passport.authenticate('jwt', { session: false }), (req, res) => {
  userService
    .getTasks(req.user._id)
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(422).json({ message: err }));
});

app.post(AddTask, passport.authenticate('jwt', { session: false }), (req, res) => {
  userService
    .addTask(req.user._id, req.body)
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(422).json({ message: err }));
});

app.put(UpdateTask, passport.authenticate('jwt', { session: false }), (req, res) => {
  userService
    .updateTask(req.user._id, req.params.id, req.body)
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(422).json({ message: err }));
});

app.delete(DeleteTask, passport.authenticate('jwt', { session: false }), (req, res) => {
  userService
    .deleteTask(req.user._id, req.params.id)
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(422).json({ message: err }));
});

app.use((req, res) => res.status(404).send('Not Found'));

// Connect to DB once per cold start
let dbConnected = false;
const connectOnce = async () => {
  if (!dbConnected) {
    await userService.connect();
    dbConnected = true;
    console.log('Database connected');
  }
};

// Export serverless handler
module.exports = serverless(async (req, res) => {
  await connectOnce();
  return app(req, res);
});
