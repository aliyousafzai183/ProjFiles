import React from 'react';
import {View, Text} from 'react-native';
import CustomButton from './CustomButton'
const SocialSignInButtons = () => {
const onSigninFacebook = () => {
    console.warn('onSigninfacebook');
};

const onSigninGoogle = () => {
    console.warn('onSigninGoogle');
};

const onSigninApple = () =>{
    console.warn('onSigninApple');
};


const SocialSignInButtons = () => {
    return (
        <>
            <CustomButton
        text="Sign in with Facebook"
        onPress={onSigninFacebook}
        bgColor="#E7EAF4"
        fgColor="#4765A9"  
        />

        <CustomButton
         text="Sign in with Google"
          onPress={onSigninGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44" 
        />

        <CustomButton
         text="Sign in with Apple"
        onPress={onSigninApple} 
        bgColor="#e3e3e3"
        fgColor="#363636"
        />
        </>
    );
}};
export default SocialSignInButtons;