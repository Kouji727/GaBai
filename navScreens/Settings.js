import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

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
                        <MaterialCommunityIcons name="image-edit" size={20} color="#8a344c" />
                    </TouchableOpacity>
                </View>

                <View style={styles.textsCont}>
                    <Text style={styles.textStyle}>Kouji</Text>
                    <Text>Kouji Sukiru</Text>
                    <Text>email@gmail.com</Text>
                </View>

                <View style={styles.editableTexts}>
                    {/* component */}
                </View>



            </View>
            
        </View>
    )


}


const styles = StyleSheet.create({

    editableTexts: {

    },

    container: {
        flex: 1, 
        backgroundColor: '#F3E8EB'
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
        backgroundColor: 'pink',
    },
    
    pfp: {
        marginTop: '20%',
        width: '75%',
        height: '75%',
        borderRadius: 100,
        margin: 10,
    },
    
    editPfp: {
        width: '18%',
        height: '18%',
        backgroundColor: '#F3E8EB',
        borderRadius: 100,
        position: 'relative',
        right: -60,
        top: -50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textsCont: {
        alignItems: 'center'
    },

    textStyle: {
        fontSize: 25,
        fontWeight: 'bold'
    }
})
