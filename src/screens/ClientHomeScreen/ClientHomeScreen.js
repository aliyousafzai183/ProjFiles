import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, NativeBaseProvider, Box, Center, Container, Heading, VStack, HStack } from "native-base";
import Swiper from 'react-native-swiper';
import * as Notifications from 'expo-notifications';
import { getUnreadNotifications, getNotifications } from '../../database/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClientHomeScreen = ({ navigation }) => {
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);

  // Store the last received notification timestamp
  const storeLastReceivedTimestamp = async (timestamp) => {
    try {
      await AsyncStorage.setItem('lastReceivedTimestamp1', timestamp);
    } catch (error) {
      console.log('Error storing last received timestamp:', error);
    }
  };

  // Retrieve the last received notification timestamp
  const getLastReceivedTimestamp = async () => {
    try {
      const timestamp = await AsyncStorage.getItem('lastReceivedTimestamp1');
      return timestamp;
    } catch (error) {
      console.log('Error retrieving last received timestamp:', error);
      return null;
    }
  };

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      return userId;
    } catch (error) {
      console.log('Error retrieving userId:', error);
      return null;
    }
  };

  const showNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    let unsubscribe;
    const fetchUnreadNotifications = async () => {
      await getUserId().then((userId) => {
        getLastReceivedTimestamp().then((lastReceivedTimestamp) => {

          getUnreadNotifications(userId, lastReceivedTimestamp, (newNotifications) => {
            newNotifications.forEach((element) => {
              showNotification(element.title, element.limitedDescription);
            });
            if (newNotifications.length > 0) {
              const latestTimestamp = newNotifications[0].createdAt.seconds;
              storeLastReceivedTimestamp(latestTimestamp.toString());
            }
            // });
          });
        })
      }).catch((error) => {
        console.log('Error retrieving userId:', error);
      });

    };

    fetchUnreadNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleSearch = (searchText) => {
    navigation.navigate('View Seller', { category: searchText });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowActivityIndicator(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={{
      flex: 1
    }}>
      {
        showActivityIndicator
          ?
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {/* <ActivityIndicator size="large" color="blue" /> */}
          </View>
          :

          <ScrollView>
            <Swiper
              loop
              autoplay
              style={{ height: 250 }}
            >
              <Image
                source={require('../../images/client1.jpg')}
                resizeMode="center"
                style={{ flex: 1, height: "100%", width: "100%" }}
              />


              <Image
                source={require('../../images/client2.jpg')}
                resizeMode="center"
                style={{ flex: 1, height: "100%", width: "100%" }}
              />

            </Swiper>
            <View>


              <View>
                <Center>
                  <Container style={{ paddingTop: 20 }}>
                    <Heading>
                      What are
                      <Text color="emerald.500"> You</Text> Looking for ?
                    </Heading>
                    <Text style={{ marginTop: 20, marginBottom: 20 }} fontWeight="medium">
                      Here are some Fields where you can hire skilled personals
                    </Text>
                  </Container>
                </Center>

                <VStack space={4} alignItems="center">
                  <HStack>
                    <TouchableOpacity
                      onPress={() => handleSearch('Plumber')}
                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }}><Image
                        source={require('../../images/plumbing-icon.png')}
                        style={{ width: 80, height: 60, alignItems: "center" }}
                      /><Text style={{ fontWeight: "bold" }}>Plumber</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleSearch('Electrician')}
                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }} ><Image
                        source={require('../../images/electrician.png')}
                        style={{ width: 40, height: 50, padding: 40, marginLeft: 30 }}
                      /><Text style={{ fontWeight: "bold", textAlign: "center" }}>Electrician</Text></TouchableOpacity>
                  </HStack>
                  <HStack>
                    <TouchableOpacity
                      onPress={() => handleSearch('Painter')}

                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }} ><Image
                        source={require('../../images/painting.png')}
                        style={{ width: 50, height: 50, padding: 40, marginLeft: 30 }}
                      /><Text style={{ fontWeight: "bold", textAlign: "center" }}>Painter</Text></TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleSearch('Architect')}

                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }} ><Image
                        source={require('../../images/architect.png')}
                        style={{ width: 50, height: 50, padding: 40, marginLeft: 30 }}
                      /><Text style={{ fontWeight: "bold", textAlign: "center" }}>Architect</Text></TouchableOpacity>
                  </HStack>
                  <HStack>
                    <TouchableOpacity
                      onPress={() => handleSearch('Engineer')}
                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }} ><Image
                        source={require('../../images/engineer.png')}
                        style={{ width: 50, height: 50, padding: 40, marginLeft: 30 }}
                      /><Text style={{ fontWeight: "bold", textAlign: "center" }}>Engineer</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleSearch('Software Developer')}

                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }} ><Image
                        source={require('../../images/swd.png')}
                        style={{ width: 50, height: 50, padding: 40, marginLeft: 30 }}
                      /><Text style={{ fontWeight: "bold", textAlign: "center" }}>SoftwareDeveloper</Text></TouchableOpacity>
                  </HStack>
                  <HStack>
                    <TouchableOpacity
                      onPress={() => handleSearch('Carpenter')}
                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }} ><Image
                        source={require('../../images/carpenter.png')}
                        style={{ width: 50, height: 50, padding: 40, marginLeft: 30 }}
                      /><Text style={{ fontWeight: "bold", textAlign: "center" }}>Carpenter</Text></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleSearch('Mechanic')}

                      style={{ height: 140, width: 140, margin: 10, display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "#DDDDDD", borderRadius: 10 }} ><Image
                        source={require('../../images/mechanic.png')}
                        style={{ width: 50, height: 50, padding: 40, marginLeft: 30 }}
                      /><Text style={{ fontWeight: "bold", textAlign: "center" }}>Mechanic</Text></TouchableOpacity>
                  </HStack>
                </VStack>

              </View>
            </View>
          </ScrollView>
      }
    </View>
  )
}

export default ClientHomeScreen