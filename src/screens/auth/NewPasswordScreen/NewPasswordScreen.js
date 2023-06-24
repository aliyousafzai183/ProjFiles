import React, {useState} from 'react';
import {View,Text,StyleSheet,ScrollView} from "react-native";
import Customnput from '../../../../components/Customnput'
import CustomButton from '../../../../components/CustomButton';
import SocialSignInButtons from '../../../../components/SocialSignInButtons';
const NewPasswordScreen=({navigation})=> {
     const [code, setCode] = useState('');
     const [newPassword, setnewPassword] = useState('');
  

     const onSubmitPressed = () => {
         console.warn('onSubmitPressed');
     };

     const onSigninPressed = ()=> {
         console.warn('onSignUpPressed');
     };

    return (
     
        
      <View style = {styles.root}>
        <Text style={styles.title}>Reset your Password</Text>
        
         <Customnput
         placeholder="Code" 
        value={code} 
        setValue={setCode} 
           />

 <Customnput
         placeholder="Enter your new password" 
        value={newPassword} 
         setValue={setnewPassword} 
         />

          <CustomButton
           text="Submit" 
           onPress={() => navigation.navigate('Sign In')}
           bgColor='#e7eaf4'/>
         <Text style={styles.text}/>
          <CustomButton
         text="Back to Sign in"
         onPress={() => navigation.navigate('Sign In')}
        type="TERTIARY"
         />
         </View>
        
    );
};
export  default NewPasswordScreen;
const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding: 20,
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'Black',
        margin: 10,
    },
    text: {
        color: 'gray',
        marginVertical:  10,
    },
    


})