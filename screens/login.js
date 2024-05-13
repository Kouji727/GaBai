import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../assets/yabag.png';
import CustomInput from '../components/textInput';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await db.collection('users').doc(auth.currentUser?.uid).get();
      if (userDoc.exists) {
        setUserData(userDoc.data());
      }
    };
    fetchUserData();

    const unsubscribe = db.collection('users').doc(auth.currentUser?.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        }
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("MainScreen")
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email);
        
        // Fetch user data
        db.collection('users').doc(user.uid).get()
          .then(userDoc => {
            if (userDoc.exists) {
              const userData = userDoc.data();
  
              // Add user data to login history
              db.collection('loginhistory').add({
                email: userData.email,
                role: userData.role,
                timestamp: new Date(),
                userId: user.uid,
                username: userData.username
              })
                .then(docRef => {
                  console.log("Login history added successfully with ID: ", docRef.id);
                })
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      })
      .catch(error => {
        console.log(error);
        alert("Account doesn't exist!\nCheck if your Email and Password are correct.");
      });
  }
  
  
  

  return (
    <KeyboardAvoidingView
      style={styles.containerMain}
      behavior='padding'
    >
      <View style={styles.container}>
        <View>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.signInText}>
            Ga-Bai
          </Text>
        </View>

        <View style={styles.loginCont}>
          <CustomInput iconName='mail' placeholder='Email' value={email} setValue={setEmail} secureTextEntry={false} />
          <CustomInput iconName='lock-closed' placeholder='Password' value={password} setValue={setPassword} secureTextEntry={true} />

          <TouchableHighlight style={styles.loginButton} onPress={handleLogin}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
          </TouchableHighlight>

          <Text style={styles.textTest} >Forgot Password</Text>

          <Text>{email}</Text>
          <Text>{password}</Text>

        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginPage;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: '#e8dada',
  },
  container: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100
  },
  textContainer: {
    alignSelf: 'flex-start',
    marginBottom: 25,
  },
  signInText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#BA5255'
  },
  loginCont: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    paddingHorizontal: 30,
    margin: 30,
    alignItems: 'center',
  },
  loginButton: {
    color: 'blue',
    width: 270,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#BA5255',
    marginTop: 20,
  },
  logo: {
    height: 100,
    marginBottom: 0,
  },
  textTest: {
    fontWeight: 'bold',
    marginTop: 15,
    color: '#BA5255'
  }
});
