const bcrypt = require('bcryptjs');
const { sequelize } = require('./db');
const User = require('./models/User');
const Customer = require('./models/Customer');


module.exports.registerUser = async function (userData) {
  const existing = await User.findOne({
    where: {
      userName: userData.userName,
    },
  });

  if (existing) {
    throw 'UserName is already existed in our system!';
  }

  const hash = await bcrypt.hash(userData.password, 10);
  await sequelize.transaction(async(t)=>{
    const user= await User.create({
      userName: userData.userName,
      password: hash,
      },
      {transaction:t }
    );
    await user.createCustomer(
      {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        region: userData.region,
        dateFormat: userData.dateFormat,
      },
      {transaction:t }
    );
  });


  return `User ${userData.userName} is successfully registered`;
};

module.exports.getUser = async function (userData) {
  const user = await User.findOne({
    where: {
      userName: userData.userName,
    },
    include: [{model: Customer}],
  });

  if (!user) {
    throw `Unable to find user ${userData.userName}`;
  }

  const passwordMatched = await bcrypt.compare(userData.password, user.password);
  if (!passwordMatched) {
    throw `Incorrect password for user ${userData.userName}`;
  }

  return {
    userName:user.userName,
    name: user.Customer?.name,
    region: user.Customer?.region,
    email: user.Customer?.email,
    phoneNumber: user.Customer?.phoneNumber,
    dateFormat: user.Customer?.dateFormat,
  };
};
