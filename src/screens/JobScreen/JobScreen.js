import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserData } from '../../database/authenticate';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobScreen = ({ navigation }) => {
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');
        if (storedRole !== null) {
          setRole(storedRole);
        }
        if (email !== null) {
          setEmail(email);
        }
        if (userId !== null) {
          getUserData(userId, (userData) => {
            if (userData.firstName !== undefined) {
              setIsProfileCompleted(true);
            }
          });
        }
      } catch (error) {
        console.log('Error retrieving role or userId:', error);
      }
    };

    fetchData();
  }, []);

  const handlePostJob = () => {
    if (!isProfileCompleted) {
      Alert.alert(
        'Incomplete Profile!',
        'Your profile is not completed. Please complete your profile to post a job.',
        [
          { text: 'Skip', onPress: () => { } },
          {
            text: 'OK', onPress: () => {
              if (role === 'Seller') {
                navigation.navigate('Register Alert', { editing: false, email: email });
              } else if (role === 'Buyer') {
                navigation.navigate('Buyer Account', { editing: false, email: email });
              }
            }
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.navigate('Post Job');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What You Want to Do?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePostJob} >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Post Job</Text>
            <MaterialIcons name="add" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate("AllJobScreen") }} >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>View Jobs</Text>
            <MaterialIcons name="add" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("View Bids") }} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>View Bids</Text>
            <MaterialIcons name="visibility" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("Invited Bids") }} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Invited Bids</Text>
            <MaterialIcons name="visibility" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("ViewOrdersScreen") }} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Active Orders</Text>
            <MaterialIcons name="reorder" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("CompletedOrders") }} style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Completed Orders</Text>
            <MaterialIcons name="playlist-add-check" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#2196F3',
  },
  buttonContainer: {
    flexDirection: 'column',
    padding: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 8,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});

export default JobScreen