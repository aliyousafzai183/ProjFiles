import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getUserDataById } from '../../database/authenticate';
import { getNoOfBidsForSeller } from '../../database/bids';
import { getRatings } from '../../database/ratings';

const ProfileScreen = ({ route }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [countryCity, setCountryCity] = useState('');
    const [cnic, setCnic] = useState('');
    const [about, setAbout] = useState('');
    const [skills, setSkills] = useState([]);
    const [jobs, setJobs] = useState(0);
    const [ongoingJobs, setOngoingJobs] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [ratings, setRatings] = useState([]);

    // Helper function to format earnings
    const formatEarnings = (value) => {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(0)}B`;
        } else if (value >= 1000000) {
            return `${(value / 1000000).toFixed(0)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`;
        } else {
            return value.toString();
        }
    };

    const calculateRatings = (id) => {
        let totalRating = 0;
        ratings.map((item) => {
            if (item.bidderId === id) {
                totalRating += item.ratings;
            }
        })
        if(totalRating === 0){
            return false;
        }
        const finalTotal = totalRating / ratings.length;
        return finalTotal.toFixed(1);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (route.params.userId) {
                getUserDataById(route.params.userId, (data) => {
                    if (data) {
                        setFirstName(data.firstName || '');
                        setLastName(data.lastName || '');
                        setEmail(data.email || '');
                        setContact(data.contact || '');
                        setAddress(data.address || '');
                        setCountryCity(data.country || '');
                        setCnic(data.cnic || '');
                        setAbout(data.about || '');
                        setSkills(data.skills);
                    }
                });
            }
        };

        const fetchJobs = async () => {
            getNoOfBidsForSeller(route.params.userId, 'completed', (count, earnings) => {
                setJobs(count);
                setEarnings(earnings);
            });
        };

        const ongoingOrders = async () => {
            try {
                getNoOfBidsForSeller(route.params.userId, 'accepted', (count, earnings) => {
                    setOngoingJobs(count);
                });
            } catch (error) {
                console.log(error);
            }
        }

        const fetchRatings = async () => {
            try {
                getRatings((ratings) => {
                    setRatings(ratings);
                })
            } catch (error) {
                console.log(error);
            }
        };

        fetchRatings();
        fetchData();
        fetchJobs();
        ongoingOrders();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: 100
            }}
        >
            <View style={styles.headingWrapper}>
                <Text style={styles.heading}>{firstName}  Profile</Text>
                <Text style={styles.ongoinOrders}>({ongoingJobs}) Ongoing orders</Text>
            </View>

            <View style={styles.sectionRatings}>

                <View style={styles.section1}>
                    <Text style={styles.label}>Total Jobs</Text>
                    <Text style={styles.label}>{jobs}</Text>
                </View>
                <View style={styles.section1}>
                    <Text style={styles.label}>Ratings</Text>
                    <Text style={styles.label}>{calculateRatings(route.params.id) ? calculateRatings(route.params.id) + " / 5" : "New Seller"}</Text>
                </View>

            </View>
            <View style={styles.sectionRatings}>
                <View style={styles.section1}>
                    <Text style={styles.label}>Total Earnings</Text>
                    <Text style={styles.label}>Pkr: {formatEarnings(earnings)}</Text>
                </View>
                <View style={styles.section1}>
                    <Text style={styles.label}>Order Rate</Text>
                    {
                        jobs ?
                            <Text style={styles.label}>Pkr: {formatEarnings(earnings) / jobs}</Text>
                            :
                            <Text style={styles.label}>Pkr: 0</Text>
                    }
                </View>

            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.text}>{firstName} {lastName}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.text}>{email}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Contact:</Text>
                <Text style={styles.text}>{contact}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.text}>{address}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Country/City:</Text>
                <Text style={styles.text}>{countryCity}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>CNIC:</Text>
                <Text style={styles.text}>{cnic}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>About:</Text>
                <Text style={styles.text}>{about}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Skills:</Text>
                <View style={styles.skillsContainer}>
                    {skills.map((skill, index) => (
                        <Text key={index} style={styles.skill}>{skill}</Text>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headingWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionRatings: {
        marginBottom: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        height: '10%'
    },
    section1: {
        borderRadius: 20,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        width: '45%',
        height: '100%'
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'skyblue',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 20
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        color: '#555',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skill: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 10,
        color: '#555',
    },
    ongoinOrders: {
        fontSize: 15,
        color: 'black'
    }
});

export default ProfileScreen;
