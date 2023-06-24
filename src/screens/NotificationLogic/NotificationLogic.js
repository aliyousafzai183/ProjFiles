import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { getNotifications } from '../../database/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationLogic = () => {
  const [notifications, setNotifications] = useState([]);
  const [showIndicator, setShowIndicator] = useState(true);
  const [previousNotificationIds, setPreviousNotificationIds] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          getNotifications(userId, (fetchedNotifications) => {
            setNotifications(fetchedNotifications);
            setShowIndicator(false);
          });
        }
      } catch (error) {
        console.log('Error retrieving userId from AsyncStorage:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const loadNotificationsEnabled = async () => {
      try {
        const storedNotificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
        if (storedNotificationsEnabled !== null) {
          setNotificationsEnabled(JSON.parse(storedNotificationsEnabled));
        }
      } catch (error) {
        console.log('Error loading notifications enabled status from AsyncStorage:', error);
      }
    };

    loadNotificationsEnabled();
  }, []);

  useEffect(() => {
    const newNotificationIds = notifications.map((notification) => notification.notificationId);
    const diff = newNotificationIds.filter((id) => !previousNotificationIds.includes(id));
    if (diff.length > 0 && notificationsEnabled) {
      const newNotification = notifications.find((notification) => notification.notificationId === diff[0]);
      if (newNotification) {
        const { title, limitedDescription } = newNotification;
        ToastAndroid.show(`${title}: ${limitedDescription}`, ToastAndroid.SHORT);
      }
    }
    setPreviousNotificationIds(newNotificationIds);
  }, [notifications, notificationsEnabled]);

  return { notifications, showIndicator, notificationsEnabled };
};

export default NotificationLogic;