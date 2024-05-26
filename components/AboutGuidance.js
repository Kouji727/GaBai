import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Avatar, TouchableHighlight } from 'react-native';
import Logo from '../assets/yabag.png';


export default function AboutGuidance({ item }) {

    return(

        <View style={styles.counselorCont}>
                <View style={styles.marginCounselorCont}>

                </View>
                <View style={styles.counselPicName}>

            <TouchableHighlight style={styles.counselorIcons}>

                <Image source={Logo} style={styles.logo} resizeMode="contain" />
            </TouchableHighlight>


                    <View style={styles.pfpName}>
                        <Text style={styles.textC}>
                            GA-BAI
                        </Text>
                    </View>

                </View>

                <View style={styles.counselorDesc}>
                    <Text style={{textAlign: 'center', fontSize: 15, color: '#BA5255'}}>
                        {item.info1}
                        </Text>
                </View>
                
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

      logo: {
        width: 100
      },

    counselorCont: {
        backgroundColor: '#e8dada',
        width: '85%',
        height: 'auto',
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 10,
        paddingVertical: 15
        

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


 