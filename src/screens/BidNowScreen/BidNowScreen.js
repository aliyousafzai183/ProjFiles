import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { getBidByJobIdAndBidderId, postBid } from '../../database/bids';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BidNowScreen = ({ navigation, route }) => {
  const { jobId, jobPosterId, jobTitle, bidId } = route.params;
  const [name, setname] = useState('');
  const [coverLetter, setcoverLetter] = useState('');
  const [email, setEmail] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidderId, setBidderId] = useState('');
  const [isNew, setIsNew] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        setBidderId(userId);
        if (bidId && bidId !== null) {
          await getBidByJobIdAndBidderId(jobId, userId, (bid) => {
            setIsNew(false);
            setname(bid.name);
            setcoverLetter(bid.coverLetter);
            setEmail(bid.email);
            setBidAmount(bid.bidAmount);
          });
        }
      } catch (error) {
        console.log('Error fetching bid details:', error);
      } finally {
        setIsLoading(false); // Set loading state to false when fetching is done
      }
    };

    fetchBidDetails();
  }, []);

  const handleBidSubmit = async () => {
    try {
      // Check name length
      if (name.length < 3) {
        ToastAndroid.show('Name must be at least 3 characters long', ToastAndroid.SHORT);
        return;
      }

      // Check cover letter length
      if (coverLetter.length < 10) {
        ToastAndroid.show('Cover letter must be at least 10 characters long', ToastAndroid.SHORT);
        return;
      }
  
      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        ToastAndroid.show('Please enter a valid email address', ToastAndroid.SHORT);
        return;
      }

      if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
        ToastAndroid.show('Please include a valid bid amount or remove any extra characters', ToastAndroid.SHORT);
        return;
      } 
  
      setIsLoading(true);
      await postBid(
        bidId,
        jobId,
        jobPosterId,
        name,
        coverLetter,
        email,
        bidAmount,
        bidderId,
        jobTitle,
        isNew
      );
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      ToastAndroid.show(
        'Error submitting bid: ' + error.message,
        ToastAndroid.SHORT
      );
      console.log('Error submitting bid:', error);
    }
  };
  

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Place Your Bid</Text>

      <View style={styles.form}>
        <TextInput
          left={<TextInput.Icon name="account-tie" />}
          mode="flat"
          style={styles.input}
          label="Name"
          value={name}
          onChangeText={setname}
          activeUnderlineColor="yellow"
        />

        <TextInput
          left={<TextInput.Icon name="card-account-mail" />}
          mode="flat"
          style={styles.height}
          label="Cover Letter"
          multiline
          numberOfLines={6}
          value={coverLetter}
          onChangeText={setcoverLetter}
          activeUnderlineColor="yellow"
        />

        <TextInput
          left={<TextInput.Icon name="email" />}
          mode="flat"
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          left={<TextInput.Icon name="currency-usd" />}
          mode="flat"
          style={styles.input}
          placeholder="Your Hourly Bid Amount in Pkr"
          value={bidAmount}
          onChangeText={setBidAmount}
          keyboardType='numeric'
        />

        <TouchableOpacity style={styles.button} onPress={handleBidSubmit}>
          <Text style={styles.buttonText}>{isNew ? "Submit Bid" : "Update Bid"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:'10%',
    paddingBottom:'10%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 2,
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  height: {
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default BidNowScreen;
