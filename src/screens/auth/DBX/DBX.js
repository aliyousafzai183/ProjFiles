import { View, Text, StyleSheet, Image, Button, ScrollView, TouchableOpacity, Alert, BackHandler, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { createUser, getUserData } from '../../../database/authenticate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import DropDown from "react-native-paper-dropdown";
import { db } from '../../../database/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

const DBX = ({ navigation, route }) => {
  const { editing } = route.params;
  const { email } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [countryCity, setCountryCity] = useState('');
  const [cnic, setCnic] = useState('');
  const [about, setAbout] = useState('');
  const [skillText, setSkillText] = useState('');
  const [skills, setSkills] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [showIndicator, setShowIndicator] = useState(true);
  const [showDropDown, setShowDropDown] = useState(false);
  const [cat, setCat] = useState('');

  const CatList = [
    {
      label: "Software Developer",
      value: "Software Developer",
    },
    {
      label: "Plumber",
      value: "Plumber",
    },
    {
      label: "Electrician",
      value: "Electrician",
    },
    {
      label: "Engineer",
      value: "Engineer",
    },
    {
      label: "Architect",
      value: "Architect",
    },
    {
      label: "Painter",
      value: "Painter",
    },
  ];

  useEffect(() => {
    const updateSkillsByCategory = () => {
      // Define a mapping of categories to skills
      const categorySkillsMap = {
        "Software Developer": ["JavaScript", "Python", "Java"],
        "Plumber": ["Pipe Fitting", "Leak Repair", "Drain Cleaning"],
        "Electrician": ["Wiring Installation", "Lighting Fixtures", "Electrical Repairs"],
        "Engineer": ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
        "Architect": ["Architectural Design", "Building Codes", "Blueprint Reading"],
        "Painter": ["Interior Painting", "Exterior Painting", "Color Mixing"],
      };


      // Update the skills based on the selected category
      const selectedSkills = categorySkillsMap[cat] || [];
      // if (skills.length === 0) {
        setSkills(selectedSkills);
      // }
    };

    updateSkillsByCategory();
  }, [cat]);


  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        getUserData(userId, (data) => {
          if (data) {
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            // setEmail(data.email || '');
            setContact(data.contact || '');
            setAddress(data.address || '');
            setCountryCity(data.country || '');
            setCnic(data.cnic || '');
            setAbout(data.about || '');
            setSkills(data.skills || []);
            setProfileImage(data.profileImage);
            setCat(data.category);
          }
          setShowIndicator(false);
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Please Continue",
        "Please provide all details to complete registering your account?",
        editing
          ? [
            {
              text: "Continue Editing",
              onPress: () => null,
              style: "cancel",
            },
            { text: "Discard & Exit", onPress: () => navigation.goBack() },
          ]
          : [
            {
              text: "OK Let's Continue",
              onPress: () => null,
              style: "cancel",
            },
            { text: "No! Exit App Now", onPress: () => BackHandler.exitApp() },
          ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
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

  const handleAddSkill = () => {
    if (skillText.trim()) {
      setSkills([...skills, skillText.trim()]);
      setSkillText('');
    }
  };

  const handleRemoveSkill = index => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleCreateProfile = async () => {
    const userId = await AsyncStorage.getItem('userId');

    // Check for empty or invalid values in the remaining fields
    if (!firstName.trim() || !lastName.trim()) {
      ToastAndroid.show('Please enter your first and last name', ToastAndroid.SHORT);
      return;
    }

    if (!address.trim()) {
      ToastAndroid.show('Please enter your address', ToastAndroid.SHORT);
      return;
    }

    if (!countryCity.trim()) {
      ToastAndroid.show('Please enter your country/city', ToastAndroid.SHORT);
      return;
    }

    if (!cnic.trim() || !/^\d{13}$/.test(cnic)) {
      ToastAndroid.show('Please enter a valid 13-digit CNIC', ToastAndroid.SHORT);
      return;
    }

    if (!contact.trim() || !/^\d{11}$/.test(contact)) {
      ToastAndroid.show('Please enter a valid 11-digit number 03XXXXXXXXX', ToastAndroid.SHORT);
      return;
    }

    if (!about.trim()) {
      ToastAndroid.show('Please enter information about yourself', ToastAndroid.SHORT);
      return;
    }

    if (!cat?.trim()) {
      ToastAndroid.show('Please choose a category', ToastAndroid.SHORT);
      return;
    }

    if (!profileImage?.trim()) {
      ToastAndroid.show('Please choose a profile image', ToastAndroid.SHORT);
      return;
    }

    // Check if skills array is empty or contains undefined values
    if (skills.length === 0 || skills.includes(undefined)) {
      ToastAndroid.show('Please enter valid skills', ToastAndroid.SHORT);
      return;
    }

    // Check if the CNIC, contact, or email is already used by another user
    const userRef = collection(db, 'users');
    const cnicQuery = query(userRef, where('cnic', '==', cnic), where('documentId', '!=', userId), limit(1));
    const cnicSnapshot = await getDocs(cnicQuery);

    if (!cnicSnapshot.empty) {
      ToastAndroid.show('CNIC already taken. Please use a different one.', ToastAndroid.SHORT);
      return;
    }

    // const emailSnapshot = await getDocs(query(userRef, where('email', '==', email), limit(1)));

    // if (!emailSnapshot.empty) {
    //   ToastAndroid.show('Email already taken. Please use a different one.', ToastAndroid.SHORT);
    //   return;
    // }

    const contactQuery = query(userRef, where('contact', '==', contact), where('documentId', '!=', userId), limit(1));
    const contactSnapshot = await getDocs(contactQuery);

    if (!contactSnapshot.empty) {
      ToastAndroid.show('Contact already taken. Please use a different one.', ToastAndroid.SHORT);
      return;
    }

    // All checks passed, proceed with profile creation
    // const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      createUser(
        userId,
        firstName,
        lastName,
        contact,
        email,
        about,
        address,
        cnic,
        countryCity,
        "Seller",
        skills.filter(skill => skill !== undefined),
        cat,
        profileImage
      );
      ToastAndroid.show('Account Details Saved! Verify your email NOW', ToastAndroid.LONG);
      if (editing) {
        navigation.goBack();
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Sign In' }], // Replace 'NewScreen' with the screen you want to navigate to
        })
      );
    } else {
      console.log('userId not found');
    }
  };

  const handleCancel = () => {
    // ...
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
        <Text style={styles.profileHeading}>{editing ? 'Update Your Profile' : 'Create your profile'}</Text>
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
        <View style={styles.dropDownContainer}>

          <DropDown
            label="Category"
            mode="outlined"
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={cat}
            setValue={setCat}
            list={CatList}
            inputProps={{
              right: <TextInput.Icon name="menu-down" />,
            }}
          />
        </View>

        <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <TextInput
            left={<TextInput.Icon name="account-tie" />}
            mode="flat"
            style={styles.input}
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            activeUnderlineColor="yellow"
          />
          <TextInput
            left={<TextInput.Icon name="account-alert" />}
            mode="flat"
            style={styles.input}
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            activeUnderlineColor="yellow"
          />
          {/* <TextInput
            left={<TextInput.Icon name="email-box" />}
            mode="flat"
            style={styles.input}
            label="Email"
            value={email}
            onChangeText={setEmail}
            activeUnderlineColor="yellow"
          /> */}
          <TextInput
            left={<TextInput.Icon name="phone" />}
            mode="flat"
            keyboardType="phone-pad"
            style={styles.input}
            label="Contact"
            value={contact}
            onChangeText={setContact}
            activeUnderlineColor="yellow"
          />
          <TextInput
            left={<TextInput.Icon name="map-marker" />}
            mode="flat"
            style={styles.input}
            label="Address"
            value={address}
            onChangeText={setAddress}
            activeUnderlineColor="yellow"
          />
          <TextInput
            left={<TextInput.Icon name="home-city" />}
            mode="flat"
            style={styles.input}
            label="Country/City"
            value={countryCity}
            onChangeText={setCountryCity}
            activeUnderlineColor="yellow"
          />
          <TextInput
            left={<TextInput.Icon name="smart-card" />}
            mode="flat"
            style={styles.input}
            keyboardType='numeric'
            label="CNIC"
            value={cnic}
            onChangeText={setCnic}
            activeUnderlineColor="yellow"
          />
          <TextInput
            left={<TextInput.Icon name="information" />}
            mode="flat"
            style={styles.input}
            label="About"
            value={about}
            onChangeText={setAbout}
            activeUnderlineColor="yellow"
          />
          <Text>To add a Skill, Enter your skill and press +</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              left={<TextInput.Icon name="account-multiple-plus" />}
              mode="flat"
              style={styles.Skillinput}
              label="Enter Your Skill"
              value={skillText}
              onChangeText={setSkillText}
              activeUnderlineColor="yellow"
            />
            <TouchableOpacity onPress={handleAddSkill} style={{ padding: 10 }}>
              <Ionicons name="add-circle-outline" size={32} color="green" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '90%' }}>
            {skills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRemoveSkill(index)}
                style={{ marginRight: 5, marginBottom: 5 }}
              >
                <View
                  style={{
                    backgroundColor: 'gray',
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white', marginRight: 5 }}>{skill}</Text>
                  <Ionicons name="close-circle-outline" size={18} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Button title={editing ? "Update" : "Register"} onPress={handleCreateProfile} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10
  },
  imageContainer: {
    margin: 20
  },
  profileHeading: {
    top: 10,
    textAlign: 'center',
    fontSize: 28,

  },

  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 20
  },
  image: {
    width: 130,
    height: 130
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
  Skillinput: {
    width: '70%',
    height: 50,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 1,
    marginBottom: 10,
    marginLeft: 20

  },
  dropDownContainer: {
    marginBottom: 10,
    marginHorizontal: '5%'
  },
});

export default DBX;
