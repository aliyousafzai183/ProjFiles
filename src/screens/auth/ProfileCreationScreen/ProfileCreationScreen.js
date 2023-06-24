import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, BackHandler, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const ProfileCreationScreen = ({ route }) => {
  const { editing } = route.params;
  const [fname, setfName] = useState('');
  const [lname, setlName] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [image, setImage] = useState(null);
  const [showIndicator, setShowIndicator] = useState(true);

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

  const handleSaveProfile = () => {

  }

  const handleCountryChange = country => {
    setCountry(country);
    setCity('');
  };

  const handleImageUpload = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editing? 'Update your Profile' : 'Create Your Profile'}</Text>
      {/* <TouchableOpacity style={styles.imageContainer} onPress={handleImageUpload}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Upload Profile Image</Text>
        )}
      </TouchableOpacity> */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={fname}
        onChangeText={setfName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lname}
        onChangeText={setlName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        value={cnic}
        onChangeText={setCnic}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Skills"
        value={skill}
        onChangeText={setSkill}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={5}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Text>Select Country</Text>
      <Picker
        selectedValue={country}
        onValueChange={handleCountryChange}
      >
        <Picker.Item label="USA" value="USA" />
        <Picker.Item label="Canada" value="Canada" />
        <Picker.Item label="Mexico" value="Mexico" />
      </Picker>
      <Text>Select City</Text>
      <Picker
        selectedValue={city}
        onValueChange={setCity}
        enabled={!!country}
      >
        {country === 'USA' && (
          <>
            <Picker.Item label="New York" value="New York" />
            <Picker.Item label="Los Angeles" value="Los Angeles" />
            <Picker.Item label="Chicago" value="Chicago" />
          </>
        )}

        {country === 'Canada' && (
          <>
            <Picker.Item label="Toronto" value="Toronto" />
            <Picker.Item label="Vancouver" value="Vancouver" />
            <Picker.Item label="Montreal" value="Montreal" />
          </>
        )}

        {country === 'Mexico' && (
          <>
            <Picker.Item label="Mexico City" value="Mexico City" />
            <Picker.Item label="Cancun" value="Cancun" />
            <Picker.Item label="Puerto Vallarta" value="Puerto Vallarta" />
          </>
        )}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>{editing ? 'Update Details' : 'Register Now'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  imagePlaceholder: {
    color: '#999',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileCreationScreen;
