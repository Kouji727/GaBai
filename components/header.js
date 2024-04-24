import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function Header() {

    const clickBut = () => {
        console.log('hi');
      }

    return(
        <View style={styles.header}>
            
            <View style={styles.headerTextsCont}>

                <View>
                    <View onClick={clickBut} style={styles.iconPlaceholder} >
                        <FontAwesome name="fonticons" size={50} color="coral" />
                    </View>
                </View>

                <View style={styles.righticon}>

                    <TouchableOpacity style={styles.iconPlaceholder} onPress={clickBut}>

                            <Ionicons name='notifications' size={24} color='#c9585e'/>

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconPlaceholder} onPress={clickBut}>
                            <FontAwesome name="user" size={24} color="#c9585e" />
                    </TouchableOpacity>
                </View>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 85,
        paddingTop: 25,
        paddingBottom: 25,
        backgroundColor: 'gray',
        overflow: 'hidden'

    },

    headerTextsCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        height:100,
    },

    righticon: {
        flexDirection: 'row'
    },

    headerTexts: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        padding: 5,
        backgroundColor: 'blue',

    },

    iconPlaceholder: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        //padding: 40,
        borderRadius: 25,
        //backgroundColor: '#072942',
        margin: 5
      },
})