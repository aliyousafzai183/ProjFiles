import React, { useEffect, useState, useRef } from 'react';
import { getAllBidsForBuyer, getAllBidsForSeller } from '../../database/bids';
import { View, Text, StyleSheet, TouchableOpacity, Share, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NotificationLogic from '../NotificationLogic/NotificationLogic';

const InvoiceScreen = ({ navigation }) => {
  const [completed, setCompleted] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const invoiceRef = useRef(null);
  const { notifications, showIndicator, notificationsEnabled } = NotificationLogic();

  const fetchData = async () => {
    const role = await AsyncStorage.getItem('role');
    const userId = await AsyncStorage.getItem('userId');

    if (role === 'Seller' && userId) {
      getAllBidsForSeller(userId, (bids) => {
        setCompleted(bids);
      });
    } else if (role === 'Buyer' && userId) {
      getAllBidsForBuyer(userId, (bids) => {
        setCompleted(bids);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let total = 0;
    completed.forEach((bid) => {
      total += parseFloat(bid.bidAmount);
    });
    setTotalAmount(total.toString());

  }, [completed]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const generateInvoice = async () => {
    let invoiceContent = 'Invoice\n\n';
    invoiceContent += 'Items:\n';
    completed.forEach((bid, index) => {
      const status = bid.status === 'completed' ? 'Paid' : 'Unpaid';
      invoiceContent += `${index + 1}. ${bid.jobTitle} - $${parseFloat(bid.bidAmount).toString()} (${status})\n`;
    });
    invoiceContent += `\nTotal Amount: $${totalAmount}`;

    // Capture the invoice view as an image
    const imageURI = await captureRef(invoiceRef, {
      format: 'png',
      quality: 1,
    });

    // Share the invoice image
    Share.share({
      url: `file://${imageURI}`,
      message: invoiceContent,
    });
  };

  if (completed.length === 0) {
    return (
      <View style={styles.noRecordsContainer}>
        <MaterialCommunityIcons name="file-document-outline" size={64} color="#999" />
        <Text style={styles.noRecordsText}>No records found</Text>
      </View>
    );
  }

  const totalPaidAmount = completed.filter((bid) => bid.status === 'completed').reduce((total, bid) => total + parseFloat(bid.bidAmount), 0);
  const totalUnpaidAmount = completed.filter((bid) => bid.status !== 'completed').reduce((total, bid) => total + parseFloat(bid.bidAmount), 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Invoice</Text>

      <View style={styles.invoiceItemsContainer} ref={invoiceRef} collapsable={false}>
        {completed.map((bid, index) => (
          bid.status !== 'uninvited' && (
            <View key={index} style={styles.invoiceItemContainer}>
              <Text style={styles.jobTitle}>{bid.jobTitle}</Text>
              <Text style={styles.bidAmount}>Pkr {bid.bidAmount}</Text>
              <Text style={styles.paymentStatus}>{bid.status === 'completed' ? 'Paid' : 'Pending'}</Text>
            </View>
          )
        ))}
      </View>

      <View style={styles.listContainer}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>Total Paid Amount:</Text>
          <Text style={styles.amountValue}>{totalPaidAmount} Pkr</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>Total Pending Amount:</Text>
          <Text style={styles.amountValue}>{totalUnpaidAmount} Pkr</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>Total Amount:</Text>
          <Text style={styles.amountValue}>{totalAmount} Pkr</Text>
        </View>
      </View>


      {/* <TouchableOpacity style={styles.shareButton} onPress={generateInvoice}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  invoiceItemsContainer: {
    marginBottom: 16,
    borderRadius: 8,
  },
  invoiceItemContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bidAmount: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  shareButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  noRecordsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#999',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  amountValue: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: 'bold'
  },
  paymentStatus: {
    backgroundColor: "#1E88E5",
    color: 'white',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 15
  },
  listContainer:{
    backgroundColor:'#FFF',
    paddingVertical:10,
    paddingHorizontal:15,
    borderRadius:20
  }

});

export default InvoiceScreen;
