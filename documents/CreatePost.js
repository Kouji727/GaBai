import React from 'react';
import { StyleSheet, Text, Button, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import { db } from '../firebase';

const CreatePost = () => {

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
                    }).then(result => navigation.navigate('Community'))
                    .catch(err => console.log(err));
                }}
                validationSchema={validationSchema}
            >
                {({
                    values,
                    handleChange,
                    errors,
                    handleSubmit}) => (
                    <View>
                        <TextInput
                            onChangeText={handleChange('username')}
                            placeholder={'Username'}
                            value={values.username}
                            autoFocus={true} />

                        <TextInput
                            onChangeText={handleChange('title')}
                            placeholder={'Title'}
                            value={values.title}
                            autoFocus={true} />
                        { errors['username'] ? <Text>{errors['username']}</Text> : null}
                        { errors['title'] ? <Text>{errors['title']}</Text> : null}
                        <Button title={'Create'} onPress={() => handleSubmit()} />
                    </View>
                )}
            </Formik>
        </View>
    )
}

export default CreatePost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    }
})