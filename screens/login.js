import React, { useEffect, useState } from 'react';
//import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Text, View, KeyboardAvoidingView, Image , TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../assets/yabag.png';
import CustomInput from '../components/textInput';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {

    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("MainScreen")
      }
    })

    return unsubscribe
  }, [])

  const handleSignIn = () => {
    auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Registered with: ', user.email);
    })
    .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Logged in with: ', user.email);
    })
    .catch(error => alert("Account doesn't exist!\nCheck if your Email and Password are correct."))
  }

  
  // start

  return (

    <KeyboardAvoidingView 
    style={styles.containerMain}
    behavior='padding'
    >

        <View style={styles.container}>
            <View>
                <Image source={Logo} style={styles.logo} resizeMode="contain"/>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.signInText}>
                Ga-Bai
              </Text>
            </View>


          <View style={styles.loginCont}>
            <CustomInput iconName='mail' placeholder='Email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomInput iconName='lock-closed' placeholder='Password' value={password} setValue={setPassword} secureTextEntry={true}/>

            <TouchableHighlight style={styles.loginButton} onPress={handleLogin}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Login</Text>
            </TouchableHighlight>

    {/* 
            <TouchableNativeFeedback  onPress={onForgotPress}>
              <View style={styles.forgotPassBut}>
                <Text style={{color: 'red', fontWeight: 'bold'}}>Forgot Password</Text>
              </View>
            </TouchableNativeFeedback> */}

            <Text style={styles.textTest} >Forgot Password</Text>

            <Text>{email}</Text>
            <Text>{password}</Text>
            
          </View>
          
          {/* <StatusBar style="auto"/>*/}

        </View>
    </KeyboardAvoidingView>

    
  )
}

export default LoginPage

const styles = StyleSheet.create({
    containerMain: {
      flex: 1,
      backgroundColor: '#edd9df',
      //paddingTop: 40,
      //paddingHorizontal: 20,
      //alignItems: 'center',
      //justifyContent: 'center',
    },

    container: {
      flex: 1,
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 100 //can delete
    },

    textContainer: {
      alignSelf: 'flex-start',
      marginBottom: 25,
    },

    signInText: {
      fontSize: 35,
      fontWeight: 'bold',
      color: '#8a344c'
    },
  
    loginCont: {
      backgroundColor: 'white',
      borderRadius: 25,
      padding: 30,
      paddingHorizontal: 30,
      margin: 30,
      alignItems: 'center',
    },
  
    items: {
      marginTop: 20,
      marginHorizontal: 10,
      marginTop: 24,
      padding: 30,
      backgroundColor: 'pink',
      fontSize: 24,
      borderRadius: 25
    },

    loginButton: {
      color: 'blue',
      width: 270,
      alignItems: 'center',
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#8a344c',
      marginTop: 20,
    },

    logo: {
      height: 100,
      marginBottom: 0,
    },

    textTest: {
      fontWeight: 'bold',
      marginTop: 15,
      color: '#8a344c'

    }
  
  
  });