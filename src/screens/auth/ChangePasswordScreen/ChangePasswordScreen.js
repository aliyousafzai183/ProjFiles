import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';

const ChangePasswordScreen = ({navigation}) => {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    // Validate input fields
    if (currentPassword === '') {
      Alert.alert('Please enter your current password.');
      return;
    }

    if (newPassword === '') {
      Alert.alert('Please enter a new password.');
      return;
    }

    if (confirmPassword === '') {
      Alert.alert('Please confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('New password and confirm password do not match.');
      return;
    }

    // Change password using Firebase Authentication
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      updatePassword(user, newPassword)
        .then(() => {
          Alert.alert('Password changed successfully.');
          navigation.goBack();
        })
        .catch((error) => {
          Alert.alert('Error changing password:', error.message);
        });
    } else {
      Alert.alert('No user is currently signed in.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Change Password
      </Text>
      <TextInput
        secureTextEntry={true}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        secureTextEntry={true}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        secureTextEntry={true}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TouchableOpacity
        onPress={handleChangePassword}
        style={{
          backgroundColor: '#007AFF',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;