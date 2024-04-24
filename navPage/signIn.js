import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginPage from '../screens/login';
import NavigationPage from './navigation';
import Profile from './profile';
import Schedule from '../navScreens/Schedule';

const Stack = createNativeStackNavigator();

const SignIn = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center'}}>
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginPage} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Schedule" component={Schedule} 
        options={screenOptions={headerShown: true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default SignIn 