import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { sendMessage, receiveMessage } from '../../database/messages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const MessageScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [role, setRole] = useState('Seller');
  const { jobPosterId, bidderId } = route.params;
  const flatListRef = useRef(null);
  useEffect(() => {
    const unsubscribe = receiveMessage(jobPosterId, bidderId, (messageList) => {
      setMessages(messageList);
    });

    // Retrieve user role from AsyncStorage
    AsyncStorage.getItem('role')
      .then((value) => {
        if (value !== null) {
          setRole(value);
        }
      })
      .catch((error) => {
        console.log('Error retrieving user role:', error);
      });

    // Add a listener for the hardware back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true; // Return true to prevent the default back action
    });

    return () => {
      unsubscribe();
      backHandler.remove(); // Clean up the hardware back button listener
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput) {
      sendMessage(jobPosterId, bidderId, messageInput, role);
      setMessageInput('');
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100); // Add a slight delay before scrolling to end
    }
  };
  

  useEffect(() => {
    // Add a listener to adjust the screen when the keyboard is shown or hidden
    Keyboard.addListener('keyboardDidShow', () => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });

    return () => {
      // Clean up the keyboard listener
      Keyboard.removeAllListeners('keyboardDidShow');
    };
  }, []);

  const renderItem = ({ item }) => (
    <Text
      key={item.id}
      style={[
        styles.messageText,
        item.role === role ? styles.myMessage : styles.otherMessage,
      ]}
    >
      {item.message}
    </Text>
  );

  return (
    <View style={styles.container}>
      {messages.length === 0 ? (
        <View style={styles.noMessageContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="gray" />
          <Text style={styles.noMessageText}>Let's start a conversation</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.messageContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust the offset based on your UI
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false} // Hide vertical scroll bar
          />
        </KeyboardAvoidingView>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message"
          value={messageInput}
          onChangeText={setMessageInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flex: 1,
    marginBottom: 16,
  },
  noMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMessageText: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MessageScreen;