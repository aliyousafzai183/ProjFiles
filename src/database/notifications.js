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

export const listenToNewItems = (userId, callback) => {
  const notificationsRef = collection(db, 'notifications');
  const queryRef = query(notificationsRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(queryRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const newItem = {
          notificationId: change.doc.id,
          ...change.doc.data()
        };
        if (newItem.userId === userId) {
          callback(newItem);
          showNotification(newItem.title, newItem.limitedDescription); // Show the notification
        }
      }
    });
  });

  return unsubscribe;
};


// Function to show the notification using Expo Notifications
const showNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: null,
  });
};
