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

const HomeScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [jobTime, setJobTime] = useState('');
  const [time, setTime] = useState('');
  const [bidButtonTextMap, setBidButtonTextMap] = useState({});
  const [bidIdMap, setBidIdMap] = useState({});
  const [bidderIdMap, setBidderIdMap] = useState({});
  const [submittedBids, setSubmittedBids] = useState([]);
  const [bidCountMap, setBidCountMap] = useState({}); // State for storing bid counts

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
                        navigation.navigate("Bid Now", {
                          jobPosterId: job.jobPosterId,
                          jobId: job.jobId,
                          jobTitle: job.title,
                          bidId: bidIdMap[job.jobId],
                          bidderId: bidderIdMap[job.jobId],
                        });
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