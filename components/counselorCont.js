import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Avatar } from 'react-native';


export default function CounselorCont({ item }) {

    return(

        <View style={styles.counselorCont}>
                <View style={styles.marginCounselorCont}>

                </View>
                <View style={styles.counselPicName}>

                    <Image
                    style={styles.pfp}
                    source={require(`../assets/p.jpg`)} // Use require for local images
                    onError={(error) => console.error('Image loading error:', error)} // Handle errors
                    />


                    <View style={styles.pfpName}>
                        <Text style={styles.textC}>
                            {item.username}
                        </Text>
                    </View>

                </View>

                <View style={styles.counselorDesc}>
                    <Text style={{textAlign: 'center', fontSize: 15, color: '#8a344c'}}>
                        {item.info1} {'\n'}
                        {item.info2}{'\n'}
                        {item.info3}
                        </Text>
                </View>
                
            </View>

    )


}


const styles = StyleSheet.create({

    counselorCont: {
        backgroundColor: '#F3E8EB',
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
        width: 125,
        height: 125,
        backgroundColor: 'black',
        borderRadius: 100,
        margin: 20
    },
    
    pfpName: {

    },

    textC: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#8a344c'

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


 