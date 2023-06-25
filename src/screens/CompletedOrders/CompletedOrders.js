import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getBidsForBuyer, updateBidStatus } from '../../database/bids';

const Completedorders = ({ navigation }) => {

  const [orders, setorders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          getBidsForBuyer(userId, "completed", (invites) => {
            setorders(invites);
          });
        }
      } catch (error) {
        console.log('Error retrieving userId from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBids();
  }, [orders]);

  const handleSendMessage = (jobPosterId, bidderId) => {
    navigation.navigate('Message', {jobPosterId: jobPosterId, bidderId: bidderId })
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="ios-information-circle-outline" size={64} color="#2196F3" />
        <Text style={styles.emptyText}>No Completed Orders</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Completed Orders</Text>
      {orders.map((bid) => (
        <View style={styles.inviteContainer} key={bid.bidId}>
          <Text style={styles.jobTitle}>{bid.jobTitle}</Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.price}>{bid.bidAmount} Pkr</Text>
          </View>
          <Text style={styles.detailValue}>{bid.coverLetter}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Name:</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Seller Profile', { userId: bid.bidderId })}>
              <Text style={[styles.detailValue, styles.profileLink]}>{bid.name}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailValue}>{bid.email}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={() => { handleSendMessage(bid.jobPosterId, bid.bidderId) }}
            >
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#444444',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  inviteContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444444',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4CAF50',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#777777',
  },
  profileLink: {
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
    paddingBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#444444',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#2196F3',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#F2103B',
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Completedorders;