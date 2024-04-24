import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';

import CreateMessage from '../components/createMessage';
import ContentItem from '../components/contentItem';
import Header from '../components/header';

export default function Community() {

    const [content, setContent] = useState([
        { text: 'this is a test ', key: '1'},
        { text: 'this is another test', key: '2'}
    ]);

    const deleteCont = (key) => {
        setContent((oldCont) => {
            return oldCont.filter(content => content.key != key)
        })
    }

    const submitMsg = (msg) => {

        if(msg.length > 0){

            setContent((oldCont) => {
                return [
                    { text: msg, key: Math.random().toString()},
                    ...oldCont
                ];


            });
            

        }else{
            Alert.alert('', 'Message should not be Blank!', [
                {text: 'Got it'}
            ])
        }

    }

    return (

        //<TouchableWithoutFeedback onPress={() => {
        //    Keyboard.dismiss();
        //}}>
            <View style={styles.container}>

                    <Header/>

                    <View style={styles.fSpace}>
                        <Text style={styles.fSpaceText}>
                            Freedom Space
                        </Text>

                    </View>

                <View style={styles.content}>
                    <CreateMessage submitMsg={submitMsg}/>

                        <View style={styles.list}>
                            <FlatList
                                data={content}
                                renderItem={({ item }) => (
                                    <ContentItem item={item} deleteCont={deleteCont}/>
                                )}
                                />
                        </View>
                </View>

            </View>

        //</TouchableWithoutFeedback>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    content: {
        flex: 1,
        padding: 40,
        paddingTop: -20,
        backgroundColor: 'yellow'
    },

    list: {
        flex: 1, 
        marginTop: 20,
    },

    fSpace: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFDFDB'
    },

    fSpaceText: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        borderRadius: 90,
    },


})