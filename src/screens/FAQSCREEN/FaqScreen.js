import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Linking } from 'react-native';
import NotificationLogic from '../NotificationLogic/NotificationLogic';

const FaqScreen = () => {
  const { notifications, showIndicator, notificationsEnabled } = NotificationLogic();
  const [faqs, setFaqs] = useState([
    {
      id: '1',
      question: 'How do I search for a skill?',
      answer:
        'To search for a skill, simply enter a keyword in the search bar and tap the search button.',
    },
    {
      id: '2',
      question: 'How do I create a new skill?',
      answer:
        'To create a new skill, go to your profile page and tap the "Create Skill" button. Fill in the required information and tap "Create Skill" to save your new skill.',
    },
    {
      id: '3',
      question: 'How do I contact a skill owner?',
      answer:
        'To contact a skill owner, go to the skill details page and tap the "Contact Owner" button. This will open a page where you can send a message to the skill owner.',
    },
  ]);

  const renderFAQItem = ({ item }) => (
    <View style={styles.faqItem}>
      <Text style={styles.question}>{item.question}</Text>
      <Text style={styles.answer}>{item.answer}</Text>
    </View>
  );

  const handleContactUs = () => {
    const phoneNumber = '+923473766183';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAQs</Text>
      <FlatList
        data={faqs}
        renderItem={renderFAQItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <TouchableOpacity style={styles.button} onPress={handleContactUs}>
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  faqItem: {
    marginBottom: 20,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  answer: {
    marginTop: 5,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FaqScreen;
