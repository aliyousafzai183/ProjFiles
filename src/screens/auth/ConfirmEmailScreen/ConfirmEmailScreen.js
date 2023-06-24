import React, {useState} from 'react';
import {View,Text,StyleSheet,ScrollView} from "react-native";
import Customnput from '../../../../components/Customnput'
import CustomButton from '../../../../components/CustomButton';

 const ConfirmEmailScreen=({navigation})=> {
    const [code, setCode] = useState('');
  

    const onConfirmPressed = () => {
        console.warn('onConfirmPressed');
    };

    const onSigninPressed = ()=> {
        console.warn('onSignUpPressed');
    };

    const onResendPressed = () => {
        console.warn('onResendPressed');
    }
    return (
        
        <View style = {styles.root}>
        <Text style={styles.title}>Confirm Your Email</Text>
        
        <Customnput
        placeholder="Enter your Confirmation Code" 
        value={code} 
        setValue={setCode} 
         />

         <CustomButton text="Confirm" onPress={()=>navigation.navigate('New Password')} bgColor='#E7EAF4'/>
         {/* <Text style={styles.text}/> */}

         <CustomButton
        text="Resend Code"
        onPress={()=> navigation.navigate('Confirm Email')}
        bgColor='#E7EAF4'
        type="SECONDARY"
        />
         
       <CustomButton
        text="Back to Sign in"
        onPress={onSigninPressed}
        type="TERTIARY"
        />

        </View>
        
    );
};
export default ConfirmEmailScreen;
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