import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EStyleSheet from 'react-native-extended-stylesheet'
import {Dimensions} from 'react-native'
import Drawer from './src/Screens/Drawer'
import LoginScreen from './src/Screens/LoginScreen';
import LoadingScreen from './src/Screens/Loading'
import FirstSignUp from './src/Screens/FirstSignUp'

const Stack = createStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: false,
            headerShown: false,
            headerTintColor: 'black',
            headerTitleStyle:{
              fontWeight: 'bold',
              fontSize: 20,
            },
            headerBackTitleStyle:{
              fontWeight: '500',
              fontSize: 17,
            },
            headerStyle: {
              backgroundColor: '#67e2d9',
              height: 100
            }
          }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="FirstSignUp" component={FirstSignUp} />
          <Stack.Screen name="Note App" component={Drawer} />
        </Stack.Navigator>
      </NavigationContainer>
    )
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 27});