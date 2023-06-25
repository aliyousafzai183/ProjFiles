import { db } from './config';
import { collection, onSnapshot, query, orderBy, serverTimestamp, addDoc } from 'firebase/firestore';
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
      createdAt: serverTimestamp() // Add server timestamp to the notification
    };
    const newNotificationRef = await addDoc(notificationsRef, notificationData);
    const notificationId = newNotificationRef.id;
    return notificationId;
  } catch (error) {
    console.log('Error adding notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId, lastReceivedTimestamp, callback) => {
  try {
    getNotifications(userId, (allNotifications) => {
      
      const unreadNotifications = allNotifications.filter(notification =>
        notification.createdAt.seconds > lastReceivedTimestamp
        );
      callback(unreadNotifications);
    });
  } catch (error) {
    console.log('Error retrieving unread notifications:', error);
    callback([]);
  }
};
