import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotifications } from '../../database/notifications';
import { Alert, Box, HStack, IconButton, VStack } from 'native-base';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          getNotifications(userId, async (notifications) => {
            const data = [];
            notifications.map((item) => {
              if (item.type !== 'message') {
                data.push(item);
              }
            })
            setNotifications(data);
            setShowIndicator(false);
          });
        }
      } catch (error) {
        console.log('Error retrieving userId from AsyncStorage:', error);
      }
    };

    fetchNotifications();
  }, []);

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
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
