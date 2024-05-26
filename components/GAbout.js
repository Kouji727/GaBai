import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Avatar, TouchableHighlight, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


export default function GAbout({ item }) {

    const openLink = () => {
        Linking.openURL('https://web.facebook.com/DYCIGC?_rdc=1&_rdr');
      }

    return(

        <View style={styles.counselorCont}>
                <View style={styles.marginCounselorCont}>

                </View>
                <View style={styles.counselPicName}>

                <TouchableHighlight style={styles.counselorIcons}>

                <Image source={require('../assets/guidance.jpg')} style={styles.pfp} />
                </TouchableHighlight>

                </View>

                <View style={styles.counselorDesc}>
                    <Text style={{textAlign: 'center', fontSize: 15, color: '#BA5255'}}>
                        {item?.info2}
                        </Text>
                </View>

                <TouchableOpacity style={{width: '50%', backgroundColor: '#BA5255', padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                    <TouchableOpacity onPress={openLink} style={{alignItems: 'center'}}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white'}}>
                            Learn More About The DYCI Guidance
                        </Text>
                        <FontAwesome name="heart" size={24} color="white" />

                    </TouchableOpacity>
                </TouchableOpacity>
                
            </View>

    )


}


const styles = StyleSheet.create({
    
    counselorIcons: {
        width: 125,
        height: 125,
        marginVertical: 10,
        //backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        marginHorizontal: 5,
        elevation: 3,
        shadowColor: '#8a344c',
      },

    counselorCont: {
        backgroundColor: '#F3E8EB',
        width: '85%',
        height: 'auto',
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 10,
        paddingVertical: 15, alignItems: 'center'
        

    },

    marginCounselorCont: {
        backgroundColor: 'yellow', //wala pa
    
    },

    counselPicName: {

        alignItems:'center',
        justifyContent:'center',
    },

    pfp: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 100,
        margin: 20,
    },
    
    pfpName: {

    },

    textC: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#BA5255'

    },

    counselorDesc: {
        alignItems: 'center',
        paddingTop: 10,
        padding: 25

    },

    image: {
        width: 300,
        height: 300,
        borderRadius: 1000,
      },


})


 