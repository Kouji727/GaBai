import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity, Image } from 'react-native';

export default function Settings() {

    return (
        <View style={styles.container}>
            <View style={styles.profilePic}>
                <View style={styles.counselorIcons}>
                    <Image
                    style={styles.pfp}
                    source={require('../assets/p.jpg')} // Use require for local images
                    onError={(error) => console.error('Image loading error:', error)} // Handle errors
                    />

                    <TouchableOpacity style={styles.editPfp}>
                        <Text style={{textAlign: 'center'}}>x</Text>
                    </TouchableOpacity>
                </View>



            </View>
            
        </View>
    )


}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'pink'
    },

    profilePic: {
        flex: 1,
        alignItems: 'center',
    },

    counselorIcons: {
        marginTop: 35,
        width: '55%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: 'red',
    },
    
    pfp: {
        width: '75%',
        height: '75%',
        borderRadius: 100,
        margin: 10,
    },
    
    editPfp: {
        width: '18%',
        height: '18%',
        backgroundColor: 'blue',
        borderRadius: 100,
        position: 'relative',
        right: -60,
        top: -50
    }
})
