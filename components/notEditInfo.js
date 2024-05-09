import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { FontAwesome5 } from '@expo/vector-icons';

const NotEditInfo = ({ fieldName, text }) => {



    return (
        <View style={styles.editableTexts}>
            <Text style={styles.textTitles}>{fieldName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.textEditableStyle}>{text}</Text>
                    <View style={{opacity: 0}}>
                        <MaterialIcons name="mode-edit" size={20} color="#8a344c" />
                    </View>
                </View>
        </View>
    );
};

export default NotEditInfo;

const styles = StyleSheet.create({
    editableTexts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 7,
        backgroundColor: '#F0D0D9',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
    },
    textTitles: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#8a344c',
    },
    textEditableStyle: {
        marginHorizontal: 10,
        width: 150,
        color: '#8a344c',
        fontSize: 15,
    },

    textEditableStyleEdit: {
        marginHorizontal: 10,
        width: 150,
        color: 'black',
        fontSize: 15,
    },
});
