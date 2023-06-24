import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotifications, listenToNewItems } from '../../database/notifications';
import { Alert, Box, HStack, IconButton, VStack } from 'native-base';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [showIndicator, setShowIndicator] = useState(true);
  const [notificationShownIds, setNotificationShownIds] = useState([]);

  useEffect(() => {
    const registerForNotifications = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('Notification permission not granted!');
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo push token:', token);
      } catch (error) {
        console.log('Error registering for push notifications:', error);
      }
    };

    registerForNotifications();

    const unsubscribe = listenToNewItems((newItem) => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: newItem.title,
          body: newItem.body,
        },
        trigger: null, // show immediately
      });

      handleNotificationShown(newItem.notificationId);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          getNotifications(userId, async (notifications) => {
            const shownNotificationIds = await getShownNotificationIds();
            const filteredNotifications = notifications.filter(
              (notification) => !shownNotificationIds.includes(notification.notificationId)
            );

            setNotifications(filteredNotifications);
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
    saveShownNotificationIds();
  }, [notificationShownIds]);

  const getShownNotificationIds = async () => {
    try {
      const shownNotificationIdsString = await AsyncStorage.getItem('shownNotificationIds');
      return shownNotificationIdsString ? JSON.parse(shownNotificationIdsString) : [];
    } catch (error) {
      console.log('Error retrieving shown notification IDs from AsyncStorage:', error);
      return [];
    }
  };

  const saveShownNotificationIds = async () => {
    try {
      const shownNotificationIdsString = JSON.stringify(notificationShownIds);
      await AsyncStorage.setItem('shownNotificationIds', shownNotificationIdsString);
    } catch (error) {
      console.log('Error storing shown notification IDs in AsyncStorage:', error);
    }
  };

  const handleNotificationShown = async (notificationId) => {
    if (!notificationShownIds.includes(notificationId)) {
      const updatedShownNotificationIds = [...notificationShownIds, notificationId];
      setNotificationShownIds(updatedShownNotificationIds);
    }
  };

  if (showIndicator) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.container1}>
        <Ionicons name="notifications-off-outline" size={32} color="gray" />
        <Text style={styles.noNotificationsText}>Notifications not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <Alert
          key={notification.notificationId}
          style={styles.notification}
          status={notification.type}
          colorScheme="info"
          variant="subtle"
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="row"
          px={4}
          py={2}
          rounded="lg"
          _text={{ fontSize: 'md', fontWeight: 'medium', color: 'coolGray.800' }}
          _action={{
            justifyContent: 'center',
            alignItems: 'center',
            ml: 2,
          }}
          onOpen={() => handleNotificationShown(notification.notificationId)}
        >
          <Alert.Icon />
          <Box flexShrink={1} ml={2}>
            <Text numberOfLines={1}>{notification.title}</Text>
            <Text numberOfLines={1} color="coolGray.600">
              {notification.limitedDescription}
            </Text>
          </Box>
        </Alert>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  container1: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    marginVertical: 10,
  },
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotificationsText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 10,
  },
});

export default NotificationScreen;
