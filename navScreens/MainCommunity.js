import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const MainCommunity = () => {

const navigation = useNavigation();
const [loading, setLoading] = useState(true);
const [community, setcommunity] = useState(null);

useEffect(() => {
    const docRef = doc(db, 'content', 'community');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {

        const cData = docSnap.data();
        setcommunity(cData);
        // setNewTitle(adminData.title);
        // setNewInfo(adminData.info);
        // setNewAchievementInfo(adminData.achievementInfo); // Set newAchievementInfo here
      } else {
        console.log('No such document!');
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  const openLink = () => {
    Linking.openURL('https://web.facebook.com/ProyektoPasaHERO?_rdc=1&_rdr');
  }

//   const openLink2 = () => {
//     Linking.openURL('https://web.facebook.com/ProyektoPasaHERO?_rdc=1&_rdr');
//   }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity 
                style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#BA5255',
                width: "90%",
                padding: 50,
                borderRadius: 7,
                marginTop: 15
                }}
                onPress={() => { navigation.navigate("Freedom Wall") }}
                >
                <Text style={{marginRight: 10, fontWeight: 'bold', color: 'white', fontSize: 20}}>
                    Enter Freedom Wall
                </Text>

                <FontAwesome name="arrow-right" size={24} color="white" />

            </TouchableOpacity>

        </View>

        <View>

            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                
                    <View style={{justifyContent: 'center', alignItems: 'center', width: '90%'}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#BA5255', width: "100%", padding: 25, borderTopStartRadius: 7, borderTopEndRadius: 7}}>
                            <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Featured Student Projects</Text>
                        </View>
                    </View>

                <View style={{backgroundColor: 'white', width: "90%", justifyContent: 'center', alignItems: 'center', padding: 50, borderBottomEndRadius: 7, borderBottomStartRadius: 7}}>

                <View style={{ width: '50%', aspectRatio: 1, borderRadius: 100, overflow: 'hidden', marginBottom: 10}}>
                    <Image
                        source={require('../assets/pPasaHero1.jpg')}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                </View>

                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#BA5255', marginBottom: 15}}>
                        {community?.cardtitle1}
                    </Text>

                <TouchableOpacity style={{width: '90%', backgroundColor: '#BA5255', padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                    <TouchableOpacity onPress={openLink} style={{alignItems: 'center'}}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white'}}>
                            Learn More About This Project
                        </Text>
                        <FontAwesome name="heart" size={24} color="white" />

                    </TouchableOpacity>
                </TouchableOpacity>

                </View>
            </View>
        </View>

        <View  style={{paddingBottom: 50}}>

            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                
                    <View style={{justifyContent: 'center', alignItems: 'center', width: '90%'}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#BA5255', width: "100%", padding: 25, borderTopStartRadius: 7, borderTopEndRadius: 7}}>
                            <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Support a Project</Text>
                        </View>
                    </View>

                <View style={{backgroundColor: 'white', width: "90%", justifyContent: 'center', alignItems: 'center', padding: 50, borderBottomEndRadius: 7, borderBottomStartRadius: 7}}>

                <View style={{ width: '50%', aspectRatio: 1, borderRadius: 100, overflow: 'hidden', marginBottom: 10}}>
                    <Image
                        source={require('../assets/pPasaHero.jpg')}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                </View>

                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#BA5255', marginBottom: 15}}>
                        {community?.cardtitle1}
                    </Text>

                <TouchableOpacity style={{width: '90%', backgroundColor: '#BA5255', padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                    <TouchableOpacity onPress={openLink} style={{alignItems: 'center'}}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white'}}>
                            Learn More About This Project
                        </Text>
                        <FontAwesome name="heart" size={24} color="white" />

                    </TouchableOpacity>
                </TouchableOpacity>

                </View>
            </View>
        </View>

        
        
    </ScrollView>
  )
}

export default MainCommunity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3E8EB',
    },
})