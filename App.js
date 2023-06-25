import { Provider } from 'react-native-paper';
import RootNavigator from './src/routes/RootNavigator';
import { View, Platform } from 'react-native';
import { app } from "./src/database/config";
import * as Notifications from 'expo-notifications';
import { getNotifications, addNotification, listenToNewItems } from './src/database/notifications'; // Replace with your file name
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const registerForPushNotificationsAsync = async () => {
  let token = null;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return token;
  }

  try {
    const expoPushToken = await Notifications.getExpoPushTokenAsync();
    token = expoPushToken.data;
    console.log('Expo Push Token:', token);
  } catch (error) {
    console.log('Error getting Expo Push Token:', error);
  }

  return token;
};

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [userId, setUserId] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setUserId(userId);
      return userId;
    } catch (error) {
      console.log('Error retrieving userId:', error);
      return null;
    }
  };

  useEffect(() => {
    getUserId();
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    const unsubscribe = listenToNewItems(userId, (newItem) => {
      console.log('New notification received:', newItem);
      // You can update your UI or take any other action based on the new notification
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      unsubscribe(); // Unsubscribe from listening to new notifications
    };
  }, []);

  return (
    <Provider>
      <View style={{ flex: 1, marginTop: 40 }}>
        <RootNavigator />
      </View>
    </Provider>
  );
};

export default App;
