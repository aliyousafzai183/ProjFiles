import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Linking } from 'react-native';
import { getJobById } from '../../database/jobs';
import { getUserData } from '../../database/authenticate';
import { updateBidStatus, getBidByBidId, DeliverBid } from '../../database/bids';

const ViewJobScreen = ({ route, navigation }) => {
  const [buyerData, setBuyerData] = useState(null);
  const [jobData, setJobData] = useState([]);
  const [bidData, setBidData] = useState(null);
  const [delivery, setDelivery] = useState('Delivered');
  const [modalVisible, setModalVisible] = useState(false); // State to control the visibility of the modal
  const { type } = route.params;
  const buyerId = route.params.buyerId;
  const jobId = route.params.jobId;
  const bidId = route.params.bidId;


  useEffect(() => {
    const fetchBuyerData = async () => {
      if (buyerId) {
        getUserData(buyerId, (data) => {
          setBuyerData(data);
        });
      }
    };

    const fetchJobData = async () => {
      if (jobId) {
        getJobById(jobId, (data) => {
          setJobData(data);
          console.log(data);
        });
      }
    };

    const fetchBidData = async () => {
      if (bidId) {
        getBidByBidId(bidId, (data) => {
          setBidData(data);
        });
      }
    };

    fetchBuyerData();
    fetchJobData();
    fetchBidData();
  }, []);

  const handleMessaging = () => {
    navigation.navigate('Message', { jobPosterId: bidData.jobPosterId, bidderId: bidData.bidderId,name: bidData.name })
  };

  const handleAcceptInvite = async () => {
    await updateBidStatus(bidId, bidData.jobPosterId, bidData.jobTitle, 'accepted', jobId);
    navigation.goBack();
  };

  const handleDeliverNow = async () => {
    setModalVisible(true); // Open the modal
  };

  const handleModalSubmit = async () => {
    await DeliverBid(bidId, bidData.jobPosterId, bidData.jobTitle, delivery, 'accepted');
    setModalVisible(false); // Close the modal
    navigation.goBack();
  };

  const handleViewDelivery = () => {
    Linking.openURL(bidData.delivery);
  }

  return (
    <ScrollView style={styles.container}>

      {/* Button container */}
      <View style={styles.buttonContainer}>
        {type === 'offers' && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleMessaging}>
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAcceptInvite}>
              <Text style={styles.buttonText}>Accept Offer</Text>
            </TouchableOpacity>
          </>
        )}
        {type === 'ongoing' && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleMessaging}>
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeliverNow}>
              <Text style={styles.buttonText}>Deliver Now</Text>
            </TouchableOpacity>
          </>
        )}
        {type === 'completed' && (
          <TouchableOpacity style={styles.button} onPress={handleMessaging}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        )}
        {type === 'pending' && (
          <View>
            {bidData?.delivery && (
              <>
                {/* <TouchableOpacity style={styles.button} onPress={handleViewDelivery}>
                  <Text style={styles.buttonText}>View Delivery</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.button} onPress={handleDeliverNow} disabled={true} >
                  <Text style={styles.buttonText}>Delivered</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleMessaging}>
              <Text style={styles.buttonText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {buyerData && (
        <View style={styles.section}>
          <Text style={styles.heading}>Buyer Details</Text>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.text}>
            {buyerData.firstName} {buyerData.lastName}
          </Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{buyerData.email}</Text>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.text}>{buyerData.contact}</Text>
        </View>
      )}

      {jobData && (type==='offers' || type==='appliedfor') &&(
        <View style={styles.section}>
          <Text style={styles.heading}>Job Details</Text>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.text}>{jobData.title}</Text>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>{jobData.description}</Text>
          <Text style={styles.label}>Budget:</Text>
          <Text style={styles.text}>{jobData.salary} Pkr/hour</Text>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.text}>{jobData.duration}</Text>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.text}>{jobData.category}</Text>
        </View>
      )}

      {bidData && (
        <View style={styles.section}>
          <Text style={styles.heading}>Bid Details</Text>
          <Text style={styles.label}>Job Title:</Text>
          <Text style={styles.text}>{bidData.jobTitle}</Text>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>{bidData.coverLetter}</Text>
          <Text style={styles.label}>Budget:</Text>
          <Text style={styles.text}>{bidData.bidAmount} Pkr/hour</Text>
          {/* <Text style={styles.label}>Duration:</Text>
          <Text style={styles.text}>{bidData.duration}</Text> */}
        </View>
      )}

      {/* {
            jobData.category === 'Software Developer' && (
              <View>
                <Text style={styles.modalTitle}>Enter Cloud Drive URL:</Text>
                <TextInput
                  style={styles.modalInput}
                  onChangeText={(text) => setDelivery(text)}
                  value={delivery}
                  placeholder="Cloud Drive URL"
                />
              </View>
            )
          } */}

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Are you sure that you have completed your work ?</Text>
          {/* <TextInput
            style={styles.modalInput}
            onChangeText={(text) => setDelivery(text)}
            value={delivery}
            placeholder="Cloud Drive URL"
          /> */}
          <TouchableOpacity style={styles.modalButton1} onPress={handleModalSubmit}>
            <Text style={styles.modalButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 120,
    alignItems: 'center',
  },
  modalButton1: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ViewJobScreen;
