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
                    source={require(`../assets/Neil Tamondong.jpg`)} // Use require for local images
                    onError={(error) => console.error('Image loading error:', error)} // Handle errors
                    />


                    <View style={styles.pfpName}>
                        <Text style={styles.textC}>
                            {item}
                        </Text>
                    </View>

                </View>

                <View style={styles.counselorDesc}>
                    <Text>Institutional Guidance Counselor
                        Bachelor of Science in Industrial Education, BulSU.
                        Master of Arts in School Counselling, DLSU.</Text>
                </View>
                
            </View>

    )


}


const styles = StyleSheet.create({

    counselorCont: {
        backgroundColor: 'white',
        width: '85%',
        height: 'auto',
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 10
        

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
        fontSize: 18,

    },

    counselorDesc: {
        alignItems: 'center',
        padding: 25

    },

    image: {
        width: 300,
        height: 300,
        borderRadius: 1000,
      },


})


 