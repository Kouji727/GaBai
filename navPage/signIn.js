import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginPage from '../screens/login';
import MainScreen from './mainscreen';
import Settings from '../navScreens/Settings';
import ThreadCommentPage from '../components/ThreadCommentPage';
const Stack = createNativeStackNavigator();

const SignIn = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center'}}>
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginPage} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen
          name="Profile Settings"
          component={Settings}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#BA5255' },
            headerTintColor: 'white'
          }}
          
        />

        <Stack.Screen
          name="View Post"
          component={ThreadCommentPage}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#BA5255' },
            headerTintColor: 'white'
          }}
          
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default SignIn 