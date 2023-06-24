import React from 'react';
import { View, Text, TextInput, StyleSheet } from "react-native";
const Customnput = ({value, setValue, placeholder, isPassword}) => {
    return(
        <View style={StyleSheet.container}>
        <TextInput
        value ={value}
        onChangeText={setValue} 
        placeholder={placeholder}
        secureTextEntry={isPassword ? true : false}
        style={{margin:5,padding:10,height:40,width:250,borderColor: 'black', borderWidth: 1,borderRadius:10}} />
        </View>
    );
};


export default Customnput;