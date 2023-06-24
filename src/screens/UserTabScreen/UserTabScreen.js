import { Text, TouchableOpacity, View, ActivityIndicator, BackHandler, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Avatar, HStack, VStack } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../../database/authenticate';
import { CommonActions } from '@react-navigation/native';

const UserTabScreen = ({ navigation }) => {
    const [role, setRole] = useState('');
    const [data, setData] = useState([]);
    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedRole = await AsyncStorage.getItem('role');
                const userId = await AsyncStorage.getItem('userId');
                if (storedRole !== null) {
                    setRole(storedRole);
                }
                if (userId !== null) {
                    getUserData(userId, (userData) => {
                        if (userData) {
                            setData(userData);
                        }
                    });
                }
            } catch (error) {
                console.log('Error retrieving role or userId:', error);
            }
        };

        fetchData();
    }, []);

    const handleEditProfile = () => {
        if (role === 'Buyer') {
            navigation.navigate('Buyer Account', { editing: true });
        } else if (role === 'Seller') {
            navigation.navigate('Register Alert', { editing: true });
        }
    };

    const handleWallet = () => {
        navigation.navigate('Your Wallet');
    }

    const handleLogout = async () => {
        // Reset the navigation stack and navigate to the "Get Started" screen
        try {
            await AsyncStorage.removeItem('role');
            await AsyncStorage.removeItem('userId');
        } catch (error) {
            console.log('Error deleting item:', error);
        }
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Get Started' }],
            })
        );
    };

    if (data.length === 0) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView>
            <VStack>
                <HStack style={{ padding: 10, margin: 10 }} >
                    <Avatar bg="purple.600" alignSelf="center" size="xl" source={{
                        uri: data.profileImage
                    }}>
                        RB
                    </Avatar>
                    <View style={{ padding: 10, marginLeft: 20, justifyContent: 'center', }} >
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "blue" }} >{data ? data.firstName + " " + data.lastName : 'Your Name'}</Text>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: '95%'
                        }}>
                            {
                                role === 'Seller' && (
                                    <Text style={{ fontSize: 16 }} >
                                        {
                                            data.skills?.map((item) => {
                                                return item + "  ";
                                            })
                                        }
                                    </Text>
                                )
                            }
                        </View>
                    </View>
                </HStack>
                <TouchableOpacity
                    onPress={handleEditProfile}
                    style={{
                        padding: 15,
                        margin: 5,
                        borderWidth: 1,
                        borderColor: 'blue',
                        borderRadius: 20,
                    }}>
                    <Text style={{ fontSize: 18 }}>🦹 | Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleWallet}
                    style={{ padding: 15, margin: 5, borderWidth: 1, borderColor: "blue", borderRadius: 20 }} >
                    <Text style={{ fontSize: 18 }} >💸 | Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 15, margin: 5, borderWidth: 1, borderColor: "blue", borderRadius: 20 }} onPress={() => { navigation.navigate("Settings") }} >
                    <Text style={{ fontSize: 18 }} >⚙️ | Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 15, margin: 5, borderWidth: 1, borderColor: "blue", borderRadius: 20 }} onPress={() => { navigation.navigate("FAQs") }} >
                    <Text style={{ fontSize: 18 }} >🤔 | FAQs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 15, margin: 5, borderWidth: 1, borderColor: "blue", borderRadius: 20 }} onPress={handleLogout} >
                    <Text style={{ fontSize: 18 }} >👋 | <Text style={{ color: "red", fontWeight: "bold" }} >Logout</Text></Text>
                </TouchableOpacity>
            </VStack>
        </ScrollView>
    )
}

export default UserTabScreen;
