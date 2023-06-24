import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationLogic from '../NotificationLogic/NotificationLogic';

const SettingScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  
  useEffect(() => {
    // Load the status of notifications from AsyncStorage on component mount
    loadNotificationsStatus();
  }, []);

  useEffect(() => {
    // Save the status of notifications to AsyncStorage whenever it changes
    saveNotificationsStatus();
  }, [notificationsEnabled]);

  const loadNotificationsStatus = async () => {
    try {
      const storedNotificationsStatus = await AsyncStorage.getItem('notificationsEnabled');
      if (storedNotificationsStatus !== null) {
        setNotificationsEnabled(JSON.parse(storedNotificationsStatus));
      }
    } catch (error) {
      console.log('Error loading notifications status from AsyncStorage:', error);
    }
  };

  const saveNotificationsStatus = async () => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    } catch (error) {
      console.log('Error saving notifications status to AsyncStorage:', error);
    }
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLocationToggle = () => {
    setLocationEnabled(!locationEnabled);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>SETTINGS</Text> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Switch value={locationEnabled} onValueChange={handleLocationToggle} />

      </View> */}

      <TouchableOpacity style={styles.button1} onPress={() => { navigation.navigate("FAQs") }}>
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button1}
        onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    paddingTop: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button1: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 50,
    marginTop: 20,

  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',

  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 3,

    textAlign: 'center',
    paddingBottom: 10,

  },
});

export default SettingScreen;