import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getUsersByCategory } from '../../database/authenticate';
import { AntDesign } from '@expo/vector-icons';
import { getRatings } from '../../database/ratings';

const ViewSellers = ({ route , navigation }) => {
    const { category } = route.params;
    const [users, setUsers] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        const unsubscribe = getUsersByCategory(category, (filteredUsers) => {
            setUsers(filteredUsers);
        });

        return () => {
            unsubscribe();
        };
    }, [category]);

    useEffect(() => {
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
    }, []);

    const calculateRatings = (sellerId) => {
        let totalRating = 0;
        ratings.map((item) => {
            if (ratings.bidderId === sellerId) {
                totalRating += item.ratings;
            }
        })
        const finalTotal = totalRating / ratings.length;
        return finalTotal;
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
         style={styles.userItem}
         onPress={() => navigation.navigate('Seller Profile', { userId: item.contact })}
         >
            <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={styles.userEmail}>Email: {item.email}</Text>
            <Text style={styles.userContact}>Mobile : {item.contact}</Text>
            <Text style={styles.userCountry}>From : {item.country}</Text>
            <Text style={styles.userContact}>Ratings : {calculateRatings(item.userId) ? calculateRatings(item.userId) + " / 5" : "New Seller"}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {users.length === 0 ? (
                <View style={styles.noUsersContainer}>
                    <AntDesign name="frowno" size={48} color="gray" />
                    <Text style={styles.noUsersText}>No users found</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.cnic}
                    contentContainerStyle={styles.flatListContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    userItem: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    userContact: {
        fontSize: 14,
        marginBottom: 4,
    },
    userCountry: {
        fontSize: 14,
    },
    noUsersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noUsersText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        color: 'gray',
    },
    flatListContent: {
        paddingBottom: 16,
    },
});

export default ViewSellers;