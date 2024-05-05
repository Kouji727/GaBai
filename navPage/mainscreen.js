import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Settings from '../screens/settings';
import NavigationPage from './NavigationPage';
import DrawerContent from './drawerContent';
  const Drawer = createDrawerNavigator();
  
  function MainScreen() {
    return (

      <Drawer.Navigator
      
      drawerContent={props => <DrawerContent {...props}/>}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        headerTitleAlign: 'center',
        headerTintColor: '#8a344c',
        headerStyle: {
        backgroundColor: 'pink'
        }}}>

        <Drawer.Screen name="NavigationPage" component={NavigationPage} />

      </Drawer.Navigator>
    );
  }

  export default MainScreen