import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Avatar, TouchableHighlight } from 'react-native';


export default function CounselorCont({ item }) {

    return(

        <View style={styles.counselorCont}>
                <View style={styles.marginCounselorCont}>

                </View>
                <View style={styles.counselPicName}>

<TouchableHighlight style={styles.counselorIcons}>

                    <Image
                        style={styles.pfp}
                        source={item.img ? { uri: item.img } : require('../assets/defaultPfp.jpg')}
                        onError={(error) => console.error('Image loading error:', error)} // Handle errors
                    />
</TouchableHighlight>


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


 