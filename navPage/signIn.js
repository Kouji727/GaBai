import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginPage from '../screens/login';
import NavigationPage from './NavigationPage';
import MainScreen from './mainscreen';
import Schedule from '../navScreens/Schedule';
import CreatePost from '../documents/CreatePost';
import Settings from '../navScreens/Settings';

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
            headerStyle: { backgroundColor: 'pink' },
            headerTintColor: '#8a344c'
          }}
        />

        <Stack.Screen name="CreatePost" component={CreatePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default SignIn 