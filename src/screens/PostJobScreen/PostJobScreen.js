import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { postJob, getJobById, deleteJob } from '../../database/jobs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostJobScreen = ({ navigation, route }) => {
  const { jobId, userId, email } = route.params ?? {}; // Use optional chaining (??) to handle undefined route.params
  const [salary, setSalary] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);
  const [cat, setCat] = useState('');
  const [jobPosterId, setJobPosterId] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    // Fetch jobPosterId from AsyncStorage and set it in the state
    const fetchJobPosterId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setJobPosterId(id);
        }
      } catch (error) {
        console.log(error);
      }
    }; 

    fetchJobPosterId();

    if (jobId) {
      // Fetch job data if jobId is provided
      getJobById(jobId, (jobData) => {
        setTitle(jobData.title);
        setSalary(jobData.salary);
        setJobPosterId(jobData.jobPosterId);
        setDuration(jobData.duration);
        setDescription(jobData.description);
        setCat(jobData.category);
        setLoading(false); // Set loading to false once data is loaded
      });
    } else {
      setLoading(false); // Set loading to false if jobId is not provided
    }
  }, []);

  const handleDeleteJob = (jobId) => {
    deleteJob(jobId);
    navigation.goBack();
  };

  const handleJobSubmit = async () => {
    // Check title length
    if (title.length < 5) {
      ToastAndroid.show('Title should contain at least 5 characters', ToastAndroid.SHORT);
      return;
    }

    // Check description length
    if (description.length < 20) {
      ToastAndroid.show('Description should contain at least 20 characters', ToastAndroid.SHORT);
      return;
    }

    // Check if category is chosen
    if (!cat) {
      ToastAndroid.show('Please choose a category', ToastAndroid.SHORT);
      return;
    }

    if (!salary || isNaN(Number(salary)) || Number(salary) <= 0) {
      ToastAndroid.show('Please include a valid salary or remove any extra characters', ToastAndroid.SHORT);
      return;
    }

    // Check if duration is a valid format
    const durationRegex = /^\d+ (day|days|week|weeks|month|months|year|years)$/i;
    if (!durationRegex.test(duration)) {
      ToastAndroid.show('Please enter a valid duration (e.g., 1 week 2 days, 3 months, 4 years)', ToastAndroid.SHORT);
      return;
    }

    try {
      const currentTime = new Date().toISOString(); // Get the current time

      await postJob(
        jobId,
        title,
        salary,
        email,
        jobPosterId,
        duration,
        description,
        cat,
        currentTime
      );
      ToastAndroid.show('Job Posted!', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      ToastAndroid.show('Failed! ' + error.message, ToastAndroid.SHORT);
    }
  };

  const CatList = [
    {
      label: "Software Developer",
      value: "Software Developer",
    },
    {
      label: "Plumber",
      value: "Plumber",
    },
    {
      label: "Electrician",
      value: "Electrician",
    },
    {
      label: "Engineer",
      value: "Engineer",
    },
    {
      label: "Architect",
      value: "Architect",
    },
    {
      label: "Painter",
      value: "Painter",
    },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post a Job</Text>

      <View style={styles.form}>
        <TextInput
          left={<TextInput.Icon name="account-tie" />}
          mode="flat"
          style={styles.input}
          label="Enter the title of your job"
          activeUnderlineColor="yellow"
          value={title}
          onChangeText={setTitle}
          disabled={jobId}
        />

        <TextInput
          left={<TextInput.Icon name="card-account-mail" />}
          mode="flat"
          style={styles.height}
          label="Enter the description"
          activeUnderlineColor="yellow"
          multiline
          value={description}
          onChangeText={setDescription}
          disabled={jobId}
        />

        {
          !jobId ?
            <DropDown
              label={"Category"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={cat}
              setValue={setCat}
              list={CatList}
            />
            :
            <TextInput
              disabled={jobId}
              left={<TextInput.Icon name="card-account-mail" />}
              mode="flat"
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Category"
              value={cat}
              onChangeText={setCat}
            />
        }

        <TextInput
          disabled={jobId}
          left={<TextInput.Icon name="currency-usd" />}
          mode="flat"
          style={[styles.input, { marginTop: 10 }]}
          placeholder="Hourly Salary in Pkr"
          value={salary}
          onChangeText={setSalary}
          keyboardType='numeric'
        />

        <TextInput
          left={<TextInput.Icon name="clipboard-text-clock" />}
          mode="flat"
          disabled={jobId}
          style={styles.input}
          placeholder="Contract Duration"
          value={duration}
          onChangeText={setDuration}
        />

        {
          !jobId && (
            <TouchableOpacity style={styles.button} onPress={handleJobSubmit}>
              <Text style={styles.buttonText}>Post Job</Text>
            </TouchableOpacity>
          )
        }


        {/* {jobId && (
          <TouchableOpacity style={styles.button1} onPress={() => { handleDeleteJob(jobId) }}>
            <Text style={styles.buttonText}>Delete Job</Text>
          </TouchableOpacity>
        )} */}

        {
          jobId && (
            <TouchableOpacity style={styles.button} onPress={() => {
              navigation.goBack();
            }}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          )
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '15%',
    paddingBottom: '10%'
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
    marginTop: 10,
  },
  button1: {
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
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

export default PostJobScreen;