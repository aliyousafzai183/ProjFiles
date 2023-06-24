import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Customnput from '../../../../components/Customnput';
import CustomButton from '../../../../components/CustomButton';
import { ForgotPassword } from '../../../database/authenticate';

const ForgotPasswordScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');

    const onSendPressed = () => {
        ForgotPassword(username)
            .then(() => {
                console.log('Password reset email sent');
                // Show success message to the user
                alert('Reset password email has been sent! Check your email now.', '', [
                    { text: 'Ok' }
                ]);
                navigation.goBack();
            })
            .catch((error) => {
                console.log('Error sending password reset email:', error);
                // Show error message to the user
                alert('An error occurred while sending the reset password email. Please try again later.');
            });
    };


    return (
        <>
            <View style={styles.root}>
                <Text style={styles.title}>Reset your Password</Text>

                <Customnput
                    placeholder="Your Email"
                    value={username}
                    setValue={setUsername}
                />

                <CustomButton
                    text="Send"
                    bgColor="#E7EAF4"
                    onPress={onSendPressed}
                />


                <Text style={styles.text} />

                <CustomButton
                    text="Back to Sign in"
                    onPress={() => navigation.navigate('Sign In')}
                    type="TERTIARY"
                />


            </View>
        </>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    root: {
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
        marginVertical: 10,
    },


})