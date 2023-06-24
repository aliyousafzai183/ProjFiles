import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomButton = ({onPress,text, type = 'PRIMARY', bgColor , fgColor}) => {
    return ( 
        <TouchableOpacity
        onPress={onPress}
        style= {[
        styles.container,
        styles['container_${type}'],
        bgColor ? {backgroundColor: 'royalblue'} : {}
      ]}>
        <Text
         style={[
            styles.text, 
            fgColor ? {color : fgColor} : {},
            ]}>
            {text}
        </Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        marginVertical: 5,

        alignItems: 'center',
        borderRadius: 5,
    },
     

    text: {
        fontWeight: 'bold',
        color: 'White',
    },

});
export default CustomButton;