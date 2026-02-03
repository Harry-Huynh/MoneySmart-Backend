const { sequelize } = require("../db");
const NotificationSetting = require("../models/NotificationSetting");
const User = require("../models/User");

module.exports.getNotificationSettings = async function (userId) {
  const setting = await NotificationSetting.findOne({
    where: { userId },
  });

  if (!setting) {
    return await NotificationSetting.create({ userId });
  }

  return setting;
};

// update
module.exports.updateNotificationSettings = async function (userId, settingData) {
  await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    if (!user) {
      throw new Error("No user found with the given userId");
    }

    const existing = await NotificationSetting.findOne({
      where: { userId: user.id },
      transaction: t,
    });

    if (!existing) {
      await NotificationSetting.create(
        { userId: user.id, ...settingData },
        { transaction: t }
      );
      return;
    }

    const [updatedRows] = await NotificationSetting.update(
      {
        ...settingData,
      },
      {
        where: { userId: user.id },
        transaction: t,
      }
    );

    if (updatedRows === 0) {
      throw new Error(
        "Failed to update the notification settings because the record does not exist or does not belong to the current user"
      );
    }
  });

  return "Notification settings updated successfully!";
};