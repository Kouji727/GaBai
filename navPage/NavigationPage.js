//import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

//navScreens
import Community from '../navScreens/Community';
import Apps from '../navScreens/Apps';
import Inspo from '../navScreens/Inspo';
import Schedule from '../navScreens/Schedule';
import Home from '../navScreens/Home';
import { TouchableOpacity } from 'react-native';



const NavigationPage = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();
  return (
    //<Community/>

      <Tab.Navigator
      initialRouteName="Home"
      backBehavior='none'
        screenOptions={(
          { route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Inspo') {
              iconName = focused
                ? 'star'
                : 'star-outline';
            } else if (route.name === 'Info') {
              iconName = focused 
              ? 'information-circle'
              : 'information-circle-outline';
            } else if (route.name === 'Home') {
              iconName = focused 
              ? 'home'
              : 'home-outline';
            } else if (route.name === 'Apps') {
              iconName = focused 
              ? 'rocket'
              : 'rocket-outline';
            } else if (route.name === 'Community') {
              iconName = focused 
              ? 'chatbubbles'
              : 'chatbubbles-outline';
            } else if (route.name === 'Schedule') {
              iconName = focused 
              ? 'calendar'
              : 'calendar-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#8a344c',
          tabBarInactiveTintColor: '#b46279',
          headerTitleAlign: 'center',
          headerTintColor: '#8a344c',
          headerStyle: {
          backgroundColor: 'pink'
        },
          headerRight: () => {
            return (
              <TouchableOpacity style={styles.profileButton}>
                <FontAwesome name="user-circle-o" size={30} color="#8a344c" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
              </TouchableOpacity>
            );
          }
        })}
      >
        <Tab.Screen name="Inspo" component={Inspo} />
        <Tab.Screen name="Schedule" component={Schedule} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Apps" component={Apps} />
        <Tab.Screen name="Community" component={Community} />

      </Tab.Navigator>
      
  )
}

export default NavigationPage

const styles = StyleSheet.create({
  profileButton: {
    marginRight: 15
  }
});