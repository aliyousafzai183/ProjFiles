import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  NotificationScreen, UserTabScreen,
  ClientHomeScreen, JobScreen
} from '../screens/index';

const Tab = createMaterialBottomTabNavigator();

function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      activeColor="white"
      barStyle={{ backgroundColor: 'blue' }}
    >
      <Tab.Screen
        name="Home"
        component={ClientHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />


      <Tab.Screen name="Jobs" component={JobScreen}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={26} />
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

export default ClientNavigator;