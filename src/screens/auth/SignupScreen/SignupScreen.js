import React, { useState } from 'react';
import { Image, View, Text, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import Customnput from '../../../../components/Customnput';
import CustomButton from '../../../../components/CustomButton';
import SocialSignInButtons from '../../../../components/SocialSignInButtons';
import { Signup } from '../../../database/authenticate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { confirmPasswordReset } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';

const SignupScreen = ({ navigation, route }) => {
    const { isClient } = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [role, setUserRole] = useState(isClient? "Buyer" : "Seller");

    const handlePress = () => {
        // Email validation regex
        const emailRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
      
        if (email && password && password === passwordRepeat) {
          // Check if email is valid
          if (!emailRegex.test(email)) {
            ToastAndroid.show('Invalid email format!', ToastAndroid.LONG);
            setEmail('');
            return;
          }
      
          Signup(email, password, role , (userId) => {
            if (userId && isClient) {
              console.log(userId);
              AsyncStorage.setItem('role', 'Buyer');
              navigation.navigate('Buyer Account', { editing: false });
            } else if (userId && !isClient) {
              AsyncStorage.setItem('role', 'Seller');
              navigation.navigate('Register Alert', { editing: false, email: email });
            } else {
              console.log('Sign-in failed');
            }
            setPasswordRepeat('');
            setPassword('');
            setEmail('');
          });
        } else if (email.length === 0) {
          setEmail('');
          ToastAndroid.show('Email cannot be left empty!', ToastAndroid.LONG);
        } else if (password !== passwordRepeat) {
          ToastAndroid.show('Password do not match!', ToastAndroid.LONG);
          setPasswordRepeat('');
          setPassword('');
        } else if (password.length < 6) {
          ToastAndroid.show('Password should be at least 6 characters!', ToastAndroid.LONG);
          setPasswordRepeat('');
          setPassword('');
        } else {
          ToastAndroid.show('Password does not match the confirm password!', ToastAndroid.LONG);
          setPasswordRepeat('');
        }
      };
      

    return (

        <View style={styles.root}>
            <Image
                source={require('../../../images/logo.jpg')}
                style={{ height: 100, width: 100 }}
                resizeMode="contain"
            />
            <Text style={{ fontWeight: "600", fontSize: 20 }} >Join <Text style={{ color: "blue" }} >SkillFinder</Text></Text>
            <Text style={{ fontWeight: "100", color: "grey" }}>Explore Oppurtunities</Text>


            <View style={{ marginTop: 20 }} >

                <Customnput
                    placeholder="Email"
                    value={email}
                    setValue={setEmail}
                    isPassword={false}
                />

                <Customnput
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    isPassword={true}
                />

                <Customnput
                    placeholder="Confirm Password"
                    value={passwordRepeat}
                    setValue={setPasswordRepeat}
                    secureTextEntry={true}
                    isPassword={true}
                />

            </View>
            <CustomButton text="Register" bgColor='#E7EAF4'
                onPress={handlePress}
            />

            <Text style={styles.text} >By registering, you confirm that you accept our <Text style={{ color: "blue" }} >Terms  of Use</Text> and <Text style={{ color: "blue" }} >Privacy Policy</Text>
            </Text>


            <SocialSignInButtons />


        </View>

    );
};
export default SignupScreen;
const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,

    },


    text: {
        color: 'gray',
        marginVertical: 10,
    },
})