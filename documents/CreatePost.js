import React from 'react';
import { StyleSheet, Text, Button, TextInput, View, TouchableOpacity, Image, Modal } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import { db } from '../firebase';
import PostContent from '../components/postContent';
import { useState } from 'react';

const CreatePost = ({cancel, closeAfter}) => {

    const navigation = useNavigation();

    const validationSchema = yup.object().shape({
        username: yup.string().required(),
        title: yup.string().required(),
    });

    return (

            <View style={styles.container}>
                <Formik
                    initialValues={{ title: '', username: '' }}
                    onSubmit={(values) => {

                        db.collection('posts').add({
                            username: values.username,
                            title: values.title,
                            date: new Date()
                        }).then(result => {
                            closeAfter();
                        })
                        .catch(err => console.log(err));
                    }}
                    validationSchema={validationSchema}
                >
                    {({
                        values,
                        handleChange,
                        errors,
                        handleSubmit}) => (

                            <View style={styles.allCont}>

            <View style={styles.borderBottom}>

                <View style={{margin: 5}}>
                    <View style={styles.profileName}>
                        
                            <View style={styles.topItems}>
                                <View style={styles.pfpCont}>

                                    <TouchableOpacity>

                                    <Image
                                        source={require('../assets/stan.jpg')}
                                        style={styles.pfp}
                                        resizeMode="contain"
                                    />

                                    </TouchableOpacity>

                                </View>

                                    <TextInput style={styles.name}
                                    onChangeText={handleChange('username')}
                                    placeholder={'Username'}
                                    value={values.username}
                                    autoFocus={true} />
                                { errors['username'] ? <Text style={styles.error}>{errors['username']}</Text> : null}


                                <View style={styles.datePosted}>
                                    <Text style={{color: 'grey', fontSize: 12}}>
                                        date
                                    </Text>
                                    
                                </View>

                            </View>

                    </View>

                    <View style={styles.postTitle}>

                        <TextInput style={{fontWeight: 'bold', fontSize: 18}}
                                    onChangeText={handleChange('title')}
                                    placeholder={'Title'}
                                    value={values.title}
                                    autoFocus={true} />
                                { errors['title'] ? <Text style={styles.error}>{errors['title']}</Text> : null}
                    </View>
                    
                    <View style={styles.lowerButtonCont}> 
                    </View>
                </View>


            </View>

            <View style={styles.canAndSub}>

                <TouchableOpacity style={styles.cancelButton} onPress={cancel}>
                    <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text>Create</Text>
                </TouchableOpacity>
                
                
            </View>
        </View>
                    )}
                </Formik>
            </View>
    )
}

export default CreatePost;

const styles = StyleSheet.create({

    cancelButton: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },

    submitButton: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    
    canAndSub: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    allCont: {
        alignSelf: 'center',
        width: '95%',

        padding: 5,
        backgroundColor: '#F3E8EB',
        borderRadius: 15,
        paddingTop: 15,



    },

    borderBottom: {
        borderBottomColor: '#E2AFBF',
        borderBottomWidth: 1,
    },

    profileName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    settingsIcon: {
    },

    topItems: {
        flexDirection: 'row',
        alignItems: 'center',

    },

    pfp: {
        height: 35,
        borderRadius: 100,
        marginRight: 5,
        aspectRatio: 1
    },

    name: {
        marginRight: 5,
        fontWeight: 'bold', 
        fontSize: 12
    },

    postTitle: {
        marginTop: 5
    },

    lowerButtonCont: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-around',
    },

    icontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemStyle: {
        padding: 10,
    },

    menuItemTextStyle: {
        fontSize: 16,
    }

});

const menuStyles = {
    optionsContainer: {
        marginTop: -50,
        backgroundColor: '#F5F5F5',
        padding: 1,
        borderRadius: 10,
    },
};
