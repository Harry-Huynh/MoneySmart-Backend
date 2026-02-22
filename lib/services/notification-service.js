const { sequelize } = require('../db');
const Notification = require('../models/Notification');
const NotificationSetting = require('../models/NotificationSetting');
const User = require('../models/User');

// add
module.exports.addNotification = async function (userId, notificationData, type) {
  const result = await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    if (!user) {
      throw new Error('No notification found with the given userId');
    }

    const notificationSettings = await NotificationSetting.findOne({
      where: { userId },
    });

    if (
      notificationSettings.enableNotifications === false ||
      notificationSettings.pushNotifications === false ||
      (type === 'budget' && notificationSettings.budgetAlerts === false) ||
      (type === 'savingGoals' && notificationSettings.savingsGoalReminders === false)
    ) {
      return false;
    }

    await Notification.create(
      {
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        level: notificationData.level,
        deliveryMethod: notificationData.deliveryMethod,
        status: 'UNREAD',
        userId: user.id,
      },
      {
        transaction: t,
      }
    );

    return true;
  });

  return result;
};

// update
module.exports.updateNotification = async function (userId, notificationId, notificationData) {
  await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    if (!user) {
      throw new Error('No notification found with the given userId');
    }

    const [updatedRows] = await Notification.update(
      {
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        targetDate: notificationData.targetDate,
        deliveryMethod: notificationData.deliveryMethod,
      },
      {
        where: {
          id: notificationId,
          userId: user.id,
        },
        transaction: t,
      }
    );

    if (updatedRows === 0) {
      throw new Error(
        'Failed to update the notification because the notification does not EXIT or not belong to the current user '
      );
    }
  });

  return 'Notification data is updated successfully!';
};

// mark a notification as read
module.exports.markNotificationAsRead = async function (userId, notificationId) {
  await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    if (!user) {
      throw new Error('No notification found with the given userId');
    }

    const [updatedRows] = await Notification.update(
      { status: 'READ' },
      {
        where: {
          id: notificationId,
          userId: user.id,
        },
        transaction: t,
      }
    );

    if (updatedRows === 0) {
      throw new Error('Notification does not EXIT or not belong to the current user');
    }
  });

  return 'Notification is marked as READ successfully!';
};

// mark all as read
module.exports.markAllNotificationsAsRead = async function (userId) {
  await sequelize.transaction(async (t) => {
    const user = await User.findOne({
      where: { id: userId },
      transaction: t,
    });

    if (!user) {
      throw new Error('No notification found with the given userId');
    }

    await Notification.update(
      { status: 'READ' },
      {
        where: {
          userId: user.id,
          status: 'UNREAD',
        },
        transaction: t,
      }
    );
  });

  return 'All notifications are marked as READ successfully!';
};

// get all unread notifications
module.exports.getUnreadNotifications = async function (userId) {
  const notifications = await Notification.findAll({
    where: {
      userId: userId,
      status: 'UNREAD',
    },
    order: [['createdAt', 'DESC']],
  });
  return notifications;
};

// get all
module.exports.getAllNotifications = async function (userId) {
  const notifications = await Notification.findAll({
    where: {
      userId: userId,
    },
    order: [['createdAt', 'DESC']],
  });
  return notifications;
};

// get one
module.exports.getNotification = async function (userId, notificationId) {
  const notification = await Notification.findOne({
    where: {
      userId: userId,
      id: notificationId,
    },
  });
  return notification;
};

// delete
module.exports.deleteNotification = async function (userId, notificationId) {
  const deletedNotification = await Notification.destroy({
    where: {
      userId: userId,
      id: notificationId,
    },
  });

  if (deletedNotification === 0) {
    throw new Error('Notification does not EXIT or not belong to the current user');
  }

  return 'Notification is deleted successfully!';
};
