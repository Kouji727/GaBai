import React, { useState } from 'react';
import { StyleSheet,Text, View, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function CreateMessage({submitMsg}) {

    const [msg, setMsg] = useState('');

    const addMsg = (val) => {
        setMsg(val);
    }

    const handleSubmit = () => {
        submitMsg(msg);
        setMsg('');
    };

    return(

        <View style={styles.container}>

            <View style={styles.msgInputCont}>
                <TextInput
                    style={styles.msgInput}
                    placeholder='Message Content'
                    onChangeText={addMsg}
                    value={msg}
                    />

                <TouchableOpacity style={styles.addCont} onPress={handleSubmit}>
                    <FontAwesome6 name="add" size={18} color="#c9585e" />
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,

    },

    msgInputCont: {
        flexDirection: 'row',
        justifyContent: 'center',

    },

    msgInput: {
        borderColor: '#777',
        paddingLeft: 10,
        paddingRight: 10,
        margin: 5,
        width: 200,
        borderRadius: 50,
        backgroundColor: 'white',
        elevation: 10,
        shadowOffset: {width: 3, height: 3 },
        shadowOpacity: 1.0,
        shadowColor: 'black'
    },

    addCont: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 25,
        backgroundColor: 'white',
        margin: 5,
        elevation: 10
      },

})