import { Provider } from 'react-native-paper';
import RootNavigator from './src/routes/RootNavigator';
import { View } from 'react-native';
import { app } from "./src/database/config";

const App = () => {

  return (
    <Provider>
      <View style={{flex:1, marginTop:40}}>
       <RootNavigator />
      </View>
    </Provider>
  );
};

export default App;