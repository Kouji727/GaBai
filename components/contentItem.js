import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ContentItem({item, deleteCont}) {

    return (
        <View style={styles.containerMain}>

            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.item}>{item.text}</Text>

                </View>

                <TouchableOpacity style={styles.deleteBut} onPress={() => deleteCont(item.key)}>
                    <FontAwesome name="trash" size={18} color="gray" />
                </TouchableOpacity>
            </View>


            <View style={styles.otherBut}>
                
                <View style={styles.deleteBut}>
                    <FontAwesome name="heart" size={18} color="red" />
                </View>
                <View style={styles.deleteBut}>
                    <FontAwesome name="comment" size={18} color="#a5cfc3" />
                </View>
            </View>
            
        </View>
    )


}

const styles = StyleSheet.create({
    containerMain: {
        padding: 16,
        marginTop: 16,
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#FFDFDB',
        elevation: 5,
    },

    container: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        
    },

    textContainer: {
        width: 225
    },

    item: {

    },

    deleteBut: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 25,
        backgroundColor: 'white',
        margin: 5,
      },

      otherBut: {
        flexDirection: 'row'
      },
})