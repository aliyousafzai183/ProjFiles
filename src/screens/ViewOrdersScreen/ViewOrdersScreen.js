import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getBidsForBuyer, updateBidStatus } from '../../database/bids';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Excessive number of pending callbacks']);

const ViewBidsScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPerformingOperation, setIsPerformingOperation] = useState(false);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          getBidsForBuyer(userId, 'accepted', (invites) => {
            setOrders(invites);
          });
        }
      } catch (error) {
        console.log('Error retrieving userId from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, []);

  const handleAcceptDelivery = async (bidId, bidderId, jobTitle, jobId) => {
    try {
      setIsPerformingOperation(true);
      await updateBidStatus(bidId, bidderId, jobTitle, 'completed', jobId);
      navigation.navigate('Rating', { bidderId, jobTitle });
    } catch (error) {
      console.log('Error accepting delivery:', error);
      // Handle the error accordingly
      ToastAndroid.show('Error accepting delivery!', ToastAndroid.SHORT);
    } finally {
      setIsPerformingOperation(false);
    }
  };

  const handleViewDelivery = (link) => {
    Linking.openURL(link);
  };

  if (isLoading || isPerformingOperation) {
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
        <Text style={styles.emptyText}>No Active Orders</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Active Orders</Text>
      {orders.map((bid) => (
        <View style={styles.inviteContainer} key={bid.bidId}>
          <Text style={styles.jobTitle}>{bid.jobTitle}</Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.price}>{bid.bidAmount} Pkr/hour</Text>
            {
              bid.delivery && (
                <TouchableOpacity
                  onPress={() => {
                    handleViewDelivery(bid.delivery);
                  }}
                  disabled={true}
                >

                  <Text style={styles.jobTitle}>"Delivered"</Text>
                </TouchableOpacity>
              )
            }
          </View>
          <Text style={styles.detailValue}>{bid.coverLetter}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Freelancer:</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Seller Profile', { userId: bid.bidderId })}>
              <Text style={[styles.detailValue, styles.profileLink]}>{bid.name}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.detailValue}>{bid.email}</Text>
          <Text style={styles.detailValue2}>Work Status: {bid.status === 'completed' ? "Completed" : "Ongoing"}</Text>
          <Text style={styles.detailValue2}>Payment Status:  {bid.status === 'completed'? "Released" : "Pending"}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={() => {
                navigation.navigate('Message', { jobPosterId: bid.jobPosterId, bidderId: bid.bidderId, name: bid.jobTitle })
              }}
            >
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
            {
              bid.delivery && (
                <TouchableOpacity
                  style={[styles.button, styles.sendButton]}
                  onPress={() => { handleAcceptDelivery(bid.bidId, bid.bidderId, bid.jobTitle, bid.jobId) }}
                >
                  <Text style={styles.buttonText}>Accept Delivery</Text>
                </TouchableOpacity>
              )
            }
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
  detailValue2: {
    fontSize: 18,
    color: '#444444',
    marginTop: 5
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

export default ViewBidsScreen;