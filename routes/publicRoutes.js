const express = require('express');
const userService = require('../lib/services/user-service');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const msg = await userService.registerUser(req.body);
    res.status(201).json({ message: msg });
  } catch (e) {
    res.status(422).json({ message: String(e) });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await userService.getUser(req.body);

    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'login successful', token });
  } catch (e) {
    res.status(422).json({ message: String(e) });
  }
});

module.exports = router;
