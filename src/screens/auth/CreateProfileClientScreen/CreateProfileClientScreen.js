import { View, Text, StyleSheet, Image, Button, ScrollView, ActivityIndicator, Alert, BackHandler, ToastAndroid, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { createUser, getUserData } from '../../../database/authenticate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { db } from '../../../database/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

const CreateProfileClientScreen = ({ navigation, route }) => {
  const { editing } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  // const [address, setAddress] = useState('');
  // const [countryCity, setCountryCity] = useState('');
  // const [cnic, setCnic] = useState('');
  // const [about, setAbout] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        getUserData(userId, (userData) => {
          if (userData) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            // setEmail(userData.email);
            setContact(userData.contact);
            // setAddress(userData.address);
            // setCountryCity(userData.country);
            // setCnic(userData.cnic);
            // setAbout(userData.about);
            setProfileImage(userData.profileImage);
          }
          setShowIndicator(false);
        });
      } else {
        console.log('userId not found');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Confirm Exit", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Exit", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    if (!editing) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }

  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  const handleCreateProfile = async () => {
    // Check for empty or invalid values in the remaining fields
    if (!firstName.trim() || !lastName.trim()) {
      ToastAndroid.show('Please enter your first and last name', ToastAndroid.SHORT);
      return;
    }

    // if (!email.trim() || !email.includes('@')) {
    //   ToastAndroid.show('Please enter a valid email address', ToastAndroid.SHORT);
    //   return;
    // }

    // if (!address.trim()) {
    //   ToastAndroid.show('Please enter your address', ToastAndroid.SHORT);
    //   return;
    // }

    // if (!countryCity.trim()) {
    //   ToastAndroid.show('Please enter your country/city', ToastAndroid.SHORT);
    //   return;
    // }

    // if (!cnic.trim() || !/^\d{13}$/.test(cnic)) {
    //   ToastAndroid.show('Please enter a valid 13-digit CNIC', ToastAndroid.SHORT);
    //   return;
    // }

    if (!contact.trim() || !/^\d{11}$/.test(contact)) {
      ToastAndroid.show('Please enter a valid 11-digit number 03XXXXXXXXX', ToastAndroid.SHORT);
      return;
    }

    // if (!about.trim()) {
    //   ToastAndroid.show('Please enter information about yourself', ToastAndroid.SHORT);
    //   return;
    // }

    if (!profileImage.trim()) {
      ToastAndroid.show('Please choose a profile image!', ToastAndroid.SHORT);
      return;
    }

    if (!editing) {
      // Check if the CNIC, contact, or email is already used by another user
      const userRef = collection(db, 'users');
      // const snapshot = await getDocs(query(userRef, where('cnic', '==', cnic), limit(1)));

      // if (!snapshot.empty) {
      //   ToastAndroid.show('CNIC already taken. Please use a different one.', ToastAndroid.SHORT);
      //   return;
      // }

      // const emailSnapshot = await getDocs(query(userRef, where('email', '==', email), limit(1)));

      // if (!emailSnapshot.empty) {
      //   ToastAndroid.show('Email already taken. Please use a different one.', ToastAndroid.SHORT);
      //   return;
      // }

      const contactSnapshot = await getDocs(query(userRef, where('contact', '==', contact), limit(1)));

      if (!contactSnapshot.empty) {
        ToastAndroid.show('Contact already taken. Please use a different one.', ToastAndroid.SHORT);
        return;
      }
    }

    // All checks passed, proceed with profile creation
    const userId = await AsyncStorage.getItem('userId');

    if (userId) {
      createUser(
        userId,
        firstName,
        lastName,
        contact,
        'abc#gmail.com',
        "nothing",
        "haha",
        '3443',
        'Pakistan',
        "Buyer",
        ["nothing"],
        "user",
        profileImage
      );
      if (editing) {
        ToastAndroid.show('Account Details Updated!', ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        ToastAndroid.show('Account Details Saved! Login Now!', ToastAndroid.SHORT);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Sign In' }],
          })
        );
      }
    } else {
      console.log('userId not found');
    }
  };


  if (showIndicator) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <Text style={styles.profileHeading}>{editing ? 'Update your Profile' : 'Create Your Profile'}</Text>

        <View style={styles.imageContainer}>
          <View style={styles.addImageContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                resizeMode='cover'
                style={styles.image}
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../../../images/profile.jpg')
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={{ padding: 20, textAlign: 'center' }}>
            Click on the Image to select one
          </Text>
        </View>

        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            left={<TextInput.Icon name='account-tie' />}
            mode='flat'
            style={styles.input}
            label='First Name'
            activeUnderlineColor='yellow'
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            left={<TextInput.Icon name='account-alert' />}
            mode='flat'
            style={styles.input}
            label='Last Name'
            activeUnderlineColor='yellow'
            value={lastName}
            onChangeText={setLastName}
          />
          {/* <TextInput
            left={<TextInput.Icon name='email-box' />}
            mode='flat'
            style={styles.input}
            label='Email'
            activeUnderlineColor='yellow'
            value={email}
            onChangeText={setEmail}
          /> */}
          <TextInput
            left={<TextInput.Icon name='phone' />}
            mode='flat'
            keyboardType='phone-pad'
            style={styles.input}
            label='Contact'
            activeUnderlineColor='yellow'
            value={contact}
            onChangeText={setContact}
          />
          {/* <TextInput
            left={<TextInput.Icon name='map-marker' />}
            mode='flat'
            style={styles.input}
            label='address'
            activeUnderlineColor='yellow'
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            left={<TextInput.Icon name='home-city' />}
            mode='flat'
            style={styles.input}
            label='Country/City'
            activeUnderlineColor='yellow'
            value={countryCity}
            onChangeText={setCountryCity}
          />

          <TextInput
            left={<TextInput.Icon name='smart-card' />}
            mode='flat'
            style={styles.input}
            keyboardType='numeric'
            label='CNIC'
            activeUnderlineColor='yellow'
            value={cnic}
            onChangeText={setCnic}
          />
          <TextInput
            left={<TextInput.Icon name='information' />}
            mode='flat'
            style={styles.input}
            label='About'
            activeUnderlineColor='yellow'
            value={about}
            onChangeText={setAbout}
          /> */}
        </View>
        <Button title={editing ? 'Update Details' : 'Register'} onPress={handleCreateProfile} />
      </View>
    </ScrollView>
  );
};

export default CreateProfileClientScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  imageContainer: {
    margin: 20,
  },
  profileHeading: {
    top: 10,
    textAlign: 'center',
    fontSize: 28,
  },
  addImageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  image: {
    width: 130,
    height: 130,
  },
  inputContainer: {
    flex: 1,
    padding: 1,
  },
  input: {
    width: '90%',
    height: 50,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 1,
    marginBottom: 10,
  },
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
