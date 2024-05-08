import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db, firebase } from '../firebase';
import 'firebase/storage'; // Import firebase storage
import img from '../assets/defaultPfp.jpg';

function DrawerContent(props) {

  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const userRef = db.collection('users').doc(user.uid);
        const unsubscribeUserData = userRef.onSnapshot(doc => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData.img && userData.img.startsWith("https://")) {
              setUserData({ ...userData, pfpUrl: userData.img });
            } else if (userData.img) {
              firebase.storage().ref().child(userData.img).getDownloadURL().then(url => {
                setUserData({ ...userData, pfpUrl: url });
              }).catch(error => {
                console.error('Error fetching profile picture:', error);
                setUserData(userData);
              });
            } else {
              setUserData(userData);
            }
          }
        });
  
        return () => {
          unsubscribeUserData();
        };
      } else {
        setUserData(null);
      }
    });
  
    return unsubscribe;
  }, []);
  
  

  const DrawerList = [
    { icon: 'settings', label: 'Profile Settings', navigateTo: 'Profile Settings' },
  ];

  const DrawerLayout = ({ icon, label, navigateTo }) => {

    return (
      <DrawerItem
        icon={() => <Ionicons name={icon} color='#8a344c' size={24} />}
        label={label}
        onPress={() => {
          navigation.navigate(navigateTo);
        }}
      />
    );
  };

  const DrawerItems = () => {
    return DrawerList.map((el, i) => {
      return (
        <DrawerLayout
          key={i}
          icon={el.icon}
          label={el.label}
          navigateTo={el.navigateTo}
        />
      );
    });
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))

  };

  const imgUri = Image.resolveAssetSource(img).uri;

  return (
    <View style={{ flex: 1, backgroundColor: '#edd9df' }}>
      <DrawerContentScrollView {...props}>

        <View style={styles.drawerContent}>

          <View activeOpacity={0.8}>
            <View style={styles.userInfoSection}>
              <View style={{ marginVertical: 15, alignItems: 'center' }}>
                <Avatar.Image
                  source={{
                    uri: userData?.pfpUrl || imgUri, // Use default image if pfpUrl is not available
                  }}
                  size={150}
                  style={{ marginTop: 5 }}
                />

                <View style={{ flexDirection: 'column' }}>
                  <Title style={styles.title}>{userData?.username}</Title>
                  <Text style={styles.caption} numberOfLines={1}>
                    {userData?.displayName}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.drawerSection}>
            <DrawerItems />
          </View>
        </View>

      </DrawerContentScrollView>

      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={() => (
            <Ionicons name="exit" color='#8a344c' size={24} />
          )}
          label="Sign Out"
          onPress={handleSignOut}
        />
      </View>

    </View>
  );
}
export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfoSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  caption: {
    fontSize: 15,
    lineHeight: 14,
    textAlign: 'center'
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    backgroundColor: '#f4e9ec'
  },
});
