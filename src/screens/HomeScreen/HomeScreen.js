import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Button, Alert, BackHandler } from 'react-native';
import { Box, VStack, Center, Stack, Heading, AspectRatio, HStack, NativeBaseProvider } from "native-base";
import Swiper from 'react-native-swiper';
import { getJobs } from '../../database/jobs';
import moment from 'moment';
import { checkBidExists } from '../../database/bids';
import { getBidCountByJobId } from '../../database/bids'; // Import the new function
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { getUnreadNotifications, getNotifications } from '../../database/notifications';
import { LogBox } from 'react-native';
import { getUserData } from '../../database/authenticate';

LogBox.ignoreLogs([
  'Internal React error: Attempted to capture a commit phase error inside a detached tree.',
  'ReferenceError: Can\'t find variable: unsubscribe',
]);

const HomeScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [jobTime, setJobTime] = useState('');
  const [time, setTime] = useState('');
  const [bidButtonTextMap, setBidButtonTextMap] = useState({});
  const [bidIdMap, setBidIdMap] = useState({});
  const [bidderIdMap, setBidderIdMap] = useState({});
  const [submittedBids, setSubmittedBids] = useState([]);
  const [bidCountMap, setBidCountMap] = useState({}); // State for storing bid counts
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);

  const [isProfileCompleted, setIsProfileCompleted] = useState(true);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');
        if (storedRole !== null) {
          setRole(storedRole);
        }
        if (email !== null) {
          setEmail(email);
        }
        if (userId !== null) {
          getUserData(userId, (userData) => {
            if (userData.firstName !== undefined) {
              setIsProfileCompleted(true);
            } else {
              setIsProfileCompleted(false);
            }
          });
        }
      } catch (error) {
        console.log('Error retrieving role or userId:', error);
      }
    };

    fetchData();
  }, []);

  const handleBannerClick = (from) => {
    if (from === 'banner') {
      if (role === 'Seller') {
        navigation.navigate('Register Alert', { editing: true, email: email });
      } else if (role === 'Buyer') {
        navigation.navigate('Buyer Account', { editing: true, email: email });
      }
    } else {
      Alert.alert(
        'Incomplete Profile!',
        'Your profile is not completed. Please complete your profile to post a job.',
        [
          { text: 'Skip', onPress: () => { } },
          {
            text: 'OK', onPress: () => {
              if (role === 'Seller') {
                navigation.navigate('Register Alert', { editing: true, email: email });
              } else if (role === 'Buyer') {
                navigation.navigate('Buyer Account', { editing: true, email: email });
              }
            }
          },
        ],
        { cancelable: false }
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowActivityIndicator(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Confirm Exit", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Exit", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  // Store the last received notification timestamp
  // const storeLastReceivedTimestamp = async (timestamp) => {
  //   try {
  //   } catch (error) {
  //     console.log('Error storing last received timestamp:', error);
  //   }
  // };

  // Retrieve the last received notification timestamp
  const getLastReceivedTimestamp = async () => {
    try {
      const timestamp = await AsyncStorage.getItem('lastReceivedTimestamp2');
      return timestamp;
    } catch (error) {
      console.log('Error retrieving last received timestamp:', error);
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
    const fetchUnreadNotifications = async () => {
      await getUserId().then((userId) => {
        getLastReceivedTimestamp().then((lastReceivedTimestamp) => {

          getUnreadNotifications(userId, lastReceivedTimestamp, (newNotifications) => {
            newNotifications.forEach(async (element) => {
              // console.log(element);
              showNotification(element.title, element.limitedDescription);
              await AsyncStorage.setItem('lastReceivedTimestamp2', element.createdAt.seconds.toString());
            });
            // if (newNotifications.length > 0) {
            //   const latestTimestamp = newNotifications[newNotifications.length-1].createdAt.seconds;
            //   storeLastReceivedTimestamp(latestTimestamp.toString());
            // }
            // });
          });
        })
      }).catch((error) => {
        console.log('Error retrieving userId:', error);
      });

    };

    fetchUnreadNotifications();

  }, []);


  const checkBid = async (jobId, bidderId) => {
    checkBidExists(jobId, bidderId, (bidId) => {
      if (bidId) {
        setBidButtonTextMap((prevState) => ({
          ...prevState,
          [jobId]: 'UPDATE BID'
        }));
        setBidIdMap((prevState) => ({
          ...prevState,
          [jobId]: bidId
        }));
        setSubmittedBids((prevState) => [...prevState, bidId]); // Add the bidId to the submittedBids array
      } else {
        setBidButtonTextMap((prevState) => ({
          ...prevState,
          [jobId]: 'BID NOW'
        }));
        setBidIdMap((prevState) => ({
          ...prevState,
          [jobId]: null
        }));
      }
    });
  };


  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId !== null) {
        // userId exists in AsyncStorage
        return userId;
      } else {
        // userId does not exist in AsyncStorage
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const checkBids = async (job) => {
    const userId = await getUserId();
    setBidderIdMap((prevState) => ({
      ...prevState,
      [job.jobId]: userId
    }));
    if (userId) {
      checkBid(job.jobId, userId);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const currentTime = new Date().toISOString();
        getJobs((jobs) => {
          setJobs(jobs);
          setTime(currentTime);
          setJobTime(currentTime); // Store the job time in the state
          jobs.forEach(async (job) => {
            checkBids(job);
            try {
              const count = await getBidCountByJobId(job.jobId);
              setBidCountMap((prevState) => ({
                ...prevState,
                [job.jobId]: count
              }));
            } catch (error) {
              console.log(error);
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs();
  }, []);



  return (
    <ScrollView>
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

          <View>
            <Swiper
              loop
              autoplay
              style={{ height: 250 }}
            >
              <Image
                source={require('../../images/5326050.jpg')}
                resizeMode="center"
                style={{ flex: 1, height: 360, width: 450 }}
              />

              <Image
                source={require('../../images/4786.jpg')}
                resizeMode="center"
                style={{ flex: 1, height: "100%", width: "100%" }}
              />
            </Swiper>

            <Box bg="#fff" alignItems="center" justifyContent="center">
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome to Skill<Text style={{ color: "blue" }}>Finder
              </Text>App</Text>
              {
                !isProfileCompleted && (
                  <TouchableOpacity
                    onPress={() => {
                      handleBannerClick("banner");
                    }}
                    style={{
                      alignSelf: 'center',
                      paddingHorizontal: 10,
                      backgroundColor: 'red',
                      borderRadius: 10,
                      paddingVertical: 5,
                      marginHorizontal: 10
                    }}>
                    <Text style={{
                      color: 'white'
                    }}>Incomplete profile! Complete your profile to activate your account!</Text>
                  </TouchableOpacity>
                )
              }
            </Box>

            {jobs.length === 0 ? (
              <View style={styles.noJobsContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="gray" />
                <Text style={styles.noJobsText}>No jobs found</Text>
              </View>
            ) : (
              jobs.map((job) => (
                <Box key={job.jobId} style={{ marginTop: 15 }} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }} _web={{
                  shadow: 2,
                  borderWidth: 0
                }} _light={{
                  backgroundColor: "gray.50"
                }}
                >
                  <Box>
                  </Box>
                  <Stack p="4" space={3}>
                    <Stack space={2}>
                      <Heading size="md" ml="-1">
                        {job.title}
                      </Heading>
                      <Text fontSize="xs" _light={{
                        color: "violet.500"
                      }} _dark={{
                        color: "violet.400"
                      }} fontWeight="500" ml="-0.5" mt="-1">
                        Category: {job.category}
                      </Text>
                      <Text fontSize="xs" _light={{
                        color: "violet.500"
                      }} _dark={{
                        color: "violet.400"
                      }} fontWeight="500" ml="-0.5" mt="-1">
                        salary: {job.salary + "Pkr / Hour"}
                      </Text>
                      <Text fontSize="xs" _light={{
                        color: "violet.500"
                      }} _dark={{
                        color: "violet.400"
                      }} fontWeight="500" ml="-0.5" mt="-1">
                        Duration: {job.duration}
                      </Text>
                      <HStack alignItems="center">
                        <Text color="coolGray.600" _dark={{
                          color: "warmGray.200"
                        }} fontWeight="400">
                          {moment(job.time).format('MMMM Do YYYY, h:mm a')}
                        </Text>
                      </HStack>
                    </Stack>
                    <Text fontWeight="400">
                      {job.description}
                    </Text>
                    {bidCountMap[job.jobId] !== undefined && (
                      <Text fontWeight="400">
                        Total Bids: {bidCountMap[job.jobId]} {/* Display the bid count */}
                      </Text>
                    )}
                    {bidButtonTextMap[job.jobId] && (
                      <HStack alignItems="center" space={4} justifyContent="space-between">
                        <Button
                          onPress={() => {
                            if (isProfileCompleted) {
                              navigation.navigate("Bid Now", {
                                jobPosterId: job.jobPosterId,
                                jobId: job.jobId,
                                jobTitle: job.title,
                                bidId: bidIdMap[job.jobId],
                                bidderId: bidderIdMap[job.jobId],
                              });
                            } else {
                              handleBannerClick("button");
                            }
                          }}
                          title={submittedBids.includes(bidIdMap[job.jobId]) ? "Bid Submitted" : bidButtonTextMap[job.jobId]}
                          disabled={submittedBids.includes(bidIdMap[job.jobId])} // Disable the button if the bid has been submitted
                        />
                      </HStack>
                    )}


                  </Stack>
                </Box>
              ))
            )}
          </View>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noJobsText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 10,
  },
});

export default HomeScreen;