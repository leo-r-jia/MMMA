// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createNativeStackNavigator();

import { Amplify } from 'aws-amplify';
import config from './src/aws-exports';

Amplify.configure(config);

function App() {
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default App;