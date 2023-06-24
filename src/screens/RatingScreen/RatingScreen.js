import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { submitRating } from '../../database/ratings';

const RatingScreen = ({ navigation, route }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmitRating = async () => {
    await submitRating(route.params.bidderId, route.params.jobTitle, rating);
    navigation.navigate('Jobs');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate the Seller for the job {route.params.jobTitle}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.ratingButton, value === rating ? styles.selectedRatingButton : null]}
            onPress={() => handleRating(value)}
          >
            <Ionicons name="star" size={24} color={value <= rating ? '#FFD700' : '#C0C0C0'} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRating}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 16,
    justifyContent:'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
    textAlign:'center'
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ratingButton: {
    marginHorizontal: 8,
  },
  // selectedRatingButton: {
  //   borderRadius: 12,
  //   padding: 8,
  // },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default RatingScreen;