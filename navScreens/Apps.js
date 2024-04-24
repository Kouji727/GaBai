import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity } from 'react-native';

export default function Apps() {

    return (
        <View style={{ flex: 1, backgroundColor: '#edd9df' }}>
            <View style={styles.forestAppCont}> 
                <TouchableOpacity style={styles.forestAppContIn}>
                    <Text>Forest App</Text>
                    <Text>Coming Soon May 2024</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.plantGameCont}>
                <TouchableOpacity style={styles.plantGameContIn}>
                    <Text>Plant Pou Game</Text>
                    <Text>Coming Soon May 2024</Text>
                </TouchableOpacity>

            </View>
        </View>
    )


}


const styles = StyleSheet.create({
    forestAppCont: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        

    },

    plantGameCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    forestAppContIn: {
        width: '85%',
        height: '85%',
        backgroundColor: 'white',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },

    plantGameContIn: {
        width: '85%',
        height: '85%',
        backgroundColor: 'white',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
})