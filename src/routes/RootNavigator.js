import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-native-paper';
import {
  ConfirmEmailScreen, ForgotPasswordScreen,
  NewPasswordScreen, SigninScreen,
  SignupScreen, DBX,
  GetstartScreen, SettingScreen, FaqScreen,
  BidNowScreen, ChangePasswordScreen,
  ViewBidsScreen, CreateProfileClientScreen,
  PostJobScreen, SellerProfileScreen,
  ViewJobScreen, ViewOrdersScreen,
  CompletedOrders, InvitedBidScreen,
  MessageScreen, ViewSellers,
  WalletScreen, RatingScreen,
  AllJobScreen
} from '../screens/index';
import ClientNavigator from './ClientNavigator';
import SkilledPersonNavigator from './SkilledPersonNavigator';
const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <Provider>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Get Started"
              component={GetstartScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="View Bids"
              component={ViewBidsScreen}
            />
            <Stack.Screen
              name="Sign In"
              component={SigninScreen}
            />
            <Stack.Screen
              name="Sign Up"
              component={SignupScreen}
            />
            <Stack.Screen
              name="Bid Now" component={BidNowScreen}
            />
            <Stack.Screen
              name="Confirm Email"
              component={ConfirmEmailScreen}
            />

            <Stack.Screen
              name="Forget Password"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="Post Job"
              component={PostJobScreen}
            />
            <Stack.Screen
              name="Seller Profile"
              component={SellerProfileScreen}
            />
            <Stack.Screen
              name="View Seller"
              component={ViewSellers}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
            <Stack.Screen
              name="Your Wallet"
              component={WalletScreen}
            />
            <Stack.Screen
              name="New Password"
              component={NewPasswordScreen}
            />
            <Stack.Screen
              name="CompletedOrders"
              component={CompletedOrders}
              options={{
                headerTitle: "Completed Orders"
              }}
            />
            <Stack.Screen
              name="ViewOrdersScreen"
              component={ViewOrdersScreen}
              options={{
                headerTitle: "Active Orders"
              }}

            />
            <Stack.Screen
              name="Register Alert"
              component={DBX}
              options={{
                headerTitle: "Skilled Person Account"
              }}
            />
            <Stack.Screen
              name="AllJobScreen"
              component={AllJobScreen}
              options={{
                headerTitle: "Your Jobs"
              }}
            />
            <Stack.Screen
              name="Rating"
              component={RatingScreen}
              options={{
                headerTitle: "Submit Ratings"
              }}
            />
            <Stack.Screen
              name="Buyer Account"
              component={CreateProfileClientScreen}
              options={{
                headerTitle: "Customer Account"
              }}
            />
            <Stack.Screen
              name="Invited Bids"
              component={InvitedBidScreen}
            />
            <Stack.Screen
              name="Message"
              component={MessageScreen}
            />
            <Stack.Screen
              name="View Job"
              component={ViewJobScreen}
            />
            <Stack.Screen
              name="Skill Finder"
              component={SkilledPersonNavigator}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="Welcome Customer"
              component={ClientNavigator}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="FAQs"
              component={FaqScreen}
            />
            <Stack.Screen
              name="Settings"
              component={SettingScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;