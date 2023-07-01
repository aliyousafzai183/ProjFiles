import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Customnput from '../../../../components/Customnput';
import CustomButton from '../../../../components/CustomButton';
import SocialSignInButtons from '../../../../components/SocialSignInButtons';
import {
  Signin,
  checkEmailVerificationStatus,
  resendVerificationEmail,
} from '../../../database/authenticate';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showIndicator, setShowIndicator] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleResendVerification = () => {
    resendVerificationEmail();
  };

  const handleSignIn = async () => {
    try {
      if (email && password) {
        setShowIndicator(true); // Show the activity indicator
        await AsyncStorage.setItem("email", email);
        // Sign in with email and password
        await Signin(email, password, async (data, error) => {
          if (error) {
            console.log(error);
            return;
          }

          const { userRole, isProfileCompleted } = await data;

          // Check email verification status with callback
          checkEmailVerificationStatus((isEmailVerified) => {
            if (isEmailVerified) {
              if (userRole === 'Buyer') {
                // if (isProfileCompleted) {
                  setEmail('');
                  setPassword('');
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Welcome Customer' }],
                    })
                  );
                // } else {
                //   ToastAndroid.show(
                //     'Complete your profile and sign in',
                //     ToastAndroid.SHORT
                //   );
                //   navigation.navigate('Buyer Account', { editing: false, email: email  });
                // }
              } else if (userRole === 'Seller') {
                // if (isProfileCompleted) {
                  setEmail('');
                  setPassword('');
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Skill Finder' }],
                    })
                  );
                // } else {
                //   ToastAndroid.show(
                //     'Complete your profile and sign in',
                //     ToastAndroid.SHORT
                //   );
                //   navigation.navigate('Register Alert', { editing: false, email: email });
                // }
              } else {
                console.log("Error in sign in screen");
              }
            } else {
              ToastAndroid.show(
                'Please verify your email address from your email inbox',
                ToastAndroid.LONG
              );
              setShowButton(true);
            }
          });
        });
      } else {
        ToastAndroid.show('Provide Credentials Please', ToastAndroid.LONG);
      }
      
    } catch (error) {
      console.log(error);
      setShowIndicator(false); // Hide the activity indicator in case of an error
    } finally{
      setShowIndicator(false); // Hide the activity indicator

    }
  };

  const { height } = useWindowDimensions();

  if (showIndicator) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={require('../../../images/logo.jpg')}
          style={[styles.Logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />

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
          secureTextEntry
          isPassword={true}
        />

        <CustomButton
          text="Sign in"
          bgColor="#E7EAF4"
          onPress={() => handleSignIn()}
        />

        <CustomButton
          text="Forgot password?"
          type="TERTIARY"
          onPress={() => navigation.navigate('Forget Password')}
        />

        {showButton && (
          <CustomButton
            text="Resend Verification Email?"
            type="TERTIARY"
            onPress={handleResendVerification}
          />
        )}

        <SocialSignInButtons />

        <CustomButton
          text="Don't have an account? Create One"
          type="TERTIARY"
          onPress={() => navigation.navigate('Get Started')}
        />
      </View>
    </ScrollView>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 70,
  },
  Logo: {
    width: 500,
    marginLeft: 20,
    maxWidth: 500,
    maxHeight: 800,
  },
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
