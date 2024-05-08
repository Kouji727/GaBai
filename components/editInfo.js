import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { FontAwesome5 } from '@expo/vector-icons';

const EditInfo = ({ item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(item.Value);

    const startEditing = () => {
        setIsEditing(true);
    };



    const cancelEditing = () => {
        setIsEditing(false);
        setValue(item.Value);
    };

    const submitEdit = async () => {
        saveValue(item.Field.toLowerCase()); // Pass the original field name in lowercase
    };
    
    
    const saveValue = async (field) => { // Accept the field as a parameter
        setIsEditing(false);
        try {
            await db.collection('users').doc(auth.currentUser?.uid).update({
                [field]: value // Use the original field name here
            });
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };
    

    return (
        <View style={styles.editableTexts}>
            <Text style={styles.textTitles}>{item.Field}</Text>
            {isEditing ? (
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.textEditableStyleEdit]}
                            value={value}
                            onChangeText={(text) => setValue(text)}
                            autoFocus={true}
                            multiline={value.length > 18}
                        />
                        <TouchableOpacity onPress={cancelEditing}>
                            <Ionicons name="close-circle" size={20} color="#8a344c" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Button
                            title='Confirm'
                            onPress={submitEdit}
                            color='#8a344c'
                            style={{ fontSize: 18, fontWeight: 'bold' }}
                        />
                    </View>
                </View>
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.textEditableStyle}>{value}</Text>
                    <TouchableOpacity onPress={startEditing} >
                        <MaterialIcons name="mode-edit" size={20} color="#8a344c" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default EditInfo;

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
