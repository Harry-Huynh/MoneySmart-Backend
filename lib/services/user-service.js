const bcrypt = require('bcryptjs');
const { sequelize } = require('../db');
const User = require('../models/User');
const Customer = require('../models/Customer');

module.exports.registerUser = async function (userData) {
  const existing = await User.findOne({
    where: {
      username: userData.username,
    },
  });

  if (existing) {
    throw 'Username is already existed in our system!. Please choose another one';
  }

  const hash = await bcrypt.hash(userData.password, 10);
  await sequelize.transaction(async (t) => {
    const user = await User.create(
      {
        username: userData.username,
        password: hash,
        currencyCode: userData.currencyCode,
      },
      { transaction: t }
    );

    await Customer.create(
      {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        region: userData.region,
        dateFormat: userData.dateFormat,
        userId: user.id,
      },
      { transaction: t }
    );
  });

  return `User ${userData.username} is successfully registered`;
};

module.exports.getUser = async function (userData) {
  const user = await User.findOne({
    where: {
      username: userData.username,
    },
    include: [{ model: Customer }],
  });

  if (!user) {
    throw `Unable to find user ${userData.username}`;
  }

  const passwordMatched = await bcrypt.compare(userData.password, user.password);
  if (!passwordMatched) {
    throw `Incorrect password for user ${userData.username}`;
  }

  return {
    id: user.id,
    username: user.username,
    name: user.Customer?.name,
    region: user.Customer?.region,
    email: user.Customer?.email,
    phoneNumber: user.Customer?.phoneNumber,
    dateFormat: user.Customer?.dateFormat,
  };
};

module.exports.verifyPassword = async function (userId, password) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw `Unable to find user with ID ${userId}`;
  }

  const passwordMatched = await bcrypt.compare(password, user.password);
  return passwordMatched;
};

module.exports.changePassword = async function (userId, password) {
  const hash = await bcrypt.hash(password, 10);
  await User.update(
    {
      password: hash,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  return true;
};

module.exports.getLastPasswordChangeDate = async function (userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw `Unable to find user with ID ${userId}`;
  }

  return user.updatedAt;
};
