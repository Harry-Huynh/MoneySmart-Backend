const bcrypt = require("bcryptjs");
const User = require("./models/User");

module.exports.registerUser = async function(userData)
{
    const existing = await User.findOne({
        where: {
            userName : userData.userName
        }
    })

    if(existing){
        throw "UserName is already existed in our system!"
    }

    const hash = await bcrypt.hash(userData.password, 10);

    await User.create({
        name: userData.name,
        userName: userData.userName,
        password: hash,
        region: userData.region,
        currency: userData.currency,
        date_format: userData.date_format,
    });

    return `User ${userData.userName} is successfully registered`;
}

module.exports.getUser = async function(userData){
    const user = await User.findOne({
        where: {
            userName : userData.userName
        }
    })

    if(!user){
        throw `Unable to find user ${userData.userName}`;
    }

    const passwordMatched = await bcrypt.compare(userData.password, user.password);
    if(!passwordMatched){
        throw `Incorrect password for user ${userData.userName}`;
    }

    return {
        name: user.name,
        userName: user.userName,
        region: user.region,
        currency: user.currency,
        date_format: user.date_format,
    }
}
