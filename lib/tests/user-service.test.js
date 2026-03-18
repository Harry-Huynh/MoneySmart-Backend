const bcrypt = require('bcryptjs');
const userService = require('../services/user-service');
const User = require('../models/User');
const Customer = require('../models/Customer');
require('../models/Relationship');

const { sequelize } = require('../db');
jest.setTimeout(20000);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Customer.destroy({ where: {}, force: true });
  await User.destroy({ where: {}, force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('registerUser', () => {
  test('should register user and create customer profile', async () => {
    const userData = {
      username: 'ms_test_01',
      password: '123456',
      name: 'Test Register',
      email: 'register@test.com',
      phoneNumber: '123456789',
      region: 'Canada',
      dateFormat: 'YYYY-MM-DD',
    };

    const result = await userService.registerUser(userData);

    expect(result).toBe('User ms_test_01 is successfully registered');

    const user = await User.findOne({ where: { username: 'ms_test_01' } });
    const customer = await Customer.findOne({ where: { userId: user.id } });

    expect(user).not.toBeNull();
    expect(customer).not.toBeNull();
    expect(user.password).not.toBe('123456');

    const matched = await bcrypt.compare('123456', user.password);
    expect(matched).toBe(true);
  });

  test('should throw if username already exists', async () => {
    await User.create({
      username: 'ms_test_01',
      password: 'hashedpassword',
    });

    await expect(
      userService.registerUser({
        username: 'ms_test_01',
        password: '123456',
        name: 'Test Register',
        email: 'register@test.com',
        phoneNumber: '123456789',
        region: 'Canada',
        dateFormat: 'YYYY-MM-DD',
      })
    ).rejects.toBe('Username is already existed in our system!. Please choose another one');
  });
});
