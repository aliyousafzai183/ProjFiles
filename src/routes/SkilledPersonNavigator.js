import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
    HomeScreen, NotificationScreen,
    UserTabScreen, ProposalScreen
} from '../screens/index';

const Tab = createMaterialBottomTabNavigator();

function SkilledPersonNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            activeColor="white"
            barStyle={{ backgroundColor: 'blue' }}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Proposals" component={ProposalScreen}
                options={{
                    tabBarLabel: 'Proposals',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="bullseye-arrow" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Notifications" component={NotificationScreen}
                options={{
                    tabBarLabel: 'Alerts',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="User" component={UserTabScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={26} />
                    ),
                }} />
        </Tab.Navigator>
    );
}

export default SkilledPersonNavigator;

