import { db } from './config';
import { collection, onSnapshot, query, orderBy, serverTimestamp, addDoc, writeBatch, doc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

export const getNotifications = (userId, callback) => {
  const notificationsRef = collection(db, 'notifications');
  const queryRef = query(notificationsRef, orderBy('createdAt', 'desc'));

  onSnapshot(queryRef, (snapshot) => {
    const notifications = [];
    snapshot.forEach((doc) => {
      const notification = {
        notificationId: doc.id,
        ...doc.data()
      };

      // Check if the userId matches the recipientId of the notification
      if (notification.userId === userId) {
        notifications.push(notification);
      }
    });
    callback(notifications);
  });
};

export const addNotification = async (userId, title, description, type) => {
  try {
    const limitedDescription = description.split(' ').slice(0, 15).join(' ');
    const notificationsRef = collection(db, 'notifications');
    const notificationData = {
      userId,
      title,
      limitedDescription,
      type,
      createdAt: serverTimestamp(),
      read: false
    };
    const newNotificationRef = await addDoc(notificationsRef, notificationData);
    const notificationId = newNotificationRef.id;
    return notificationId;
  } catch (error) {
    console.log('Error adding notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId, callback) => {
  try {
    getNotifications(userId, (allNotifications) => {
      const unreadNotifications = allNotifications?.filter(notification =>
        notification.read === false
      );

      // Mark unread notifications as read
      if (unreadNotifications.length > 0) {
        const notificationIds = unreadNotifications.map(notification => notification.notificationId);
        markNotificationsAsRead(notificationIds);
      }

      callback(unreadNotifications);
    });
  } catch (error) {
    console.log('Error retrieving unread notifications:', error);
    callback([]);
  }
};

const markNotificationsAsRead = async (notificationIds) => {
  try {
    const notificationsRef = collection(db, 'notifications');

    // Create a batch write for updating multiple documents
    const batch = writeBatch(db);

    // Iterate over each notification ID and update its read status
    notificationIds.forEach(notificationId => {
      const notificationDocRef = doc(notificationsRef, notificationId);
      batch.update(notificationDocRef, { read: true });
    });

    // Commit the batch write
    await batch.commit();
  } catch (error) {
    console.log('Error marking notifications as read:', error);
    throw error;
  }
};

