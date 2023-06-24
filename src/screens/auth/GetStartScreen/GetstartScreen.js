import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, LogBox } from 'react-native';
LogBox.ignoreLogs(['AsyncStorage has been extracted']);

const GetstartScreen = ({ navigation }) => {
  return (
    <View style={styles.container2}>
      <Image style={styles.img} source={require('../../../images/logo.jpg')} />

      <Text style={styles.text1}>WELCOME TO THE SKILL FINDER APP</Text>
      <TouchableOpacity style={styles.text2}
        onPress={() => { navigation.navigate('Sign Up', { isClient: false }) }}><Text style={styles.p}>Join as a Skilled person</Text></TouchableOpacity>
      <TouchableOpacity style={styles.text2}
        onPress={() => { navigation.navigate('Sign Up', { isClient: true }) }}><Text style={styles.p}> Join as a Customer</Text></TouchableOpacity>
      <Text style={{ textAlign: "center", padding: 5, fontSize: 15 }} >- or -</Text>
      <TouchableOpacity style={styles.text3}
        onPress={() => { navigation.navigate('Sign In') }}><Text style={styles.p}>Sign in</Text></TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    color: 'blue',
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  text2: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    width: 250,
    height: 40,
    maxWidth: 250,
    maxHeight: 40,
    alignItems: 'center',

  },
  text3: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    backgroundColor: '#1434A4',
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
    width: 250,
    height: 40,
    maxWidth: 250,
    maxHeight: 40,
    alignItems: 'center',

  },
  p: {
    color: 'white',
  },
  img: {
    width: 330,
    height: 200,
  },
});

export default GetstartScreen