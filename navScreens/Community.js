import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, ScrollView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import {db, streamPosts } from '../firebase';
import { FontAwesome } from '@expo/vector-icons';

import CreateMessage from '../components/createMessage';
import ContentItem from '../components/contentItem';
import CounselorPostDesign from '../components/counselorPostDesign';
import UserPostDesign from '../components/userPostDesign';

import {useNavigation} from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

export default function Community() {

    const navigation = useNavigation();

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

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState();

    const mapDocToPost = (document) => {
        return {
            id: document.id,
            username: document.data().username,
            title: document.data().title,
            date: document.data().date.toDate().toLocaleString()
        }
    }

    useEffect( () => {
        const unsubscribe = streamPosts({
            next: querySnapshot => {
                const posts = querySnapshot
                .docs.map(docSnapshot => mapDocToPost(docSnapshot))
                setPosts(posts)
                setLoading(false);
            },
            error: (error) => {
                console.log(error);
                setLoading(false);
            }
        });

        return unsubscribe
    }, [setPosts])

    return (
        <MenuProvider>
            <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator = {false}>
                    <View style={styles.fSpace}>
                        <Text style={styles.fSpaceText}>
                            Freedom Space
                        </Text>

                        <TouchableWithoutFeedback onPress={() => navigation.navigate("CreatePost")}>
                            <FontAwesome name="plus-square-o" size={24} color="black" />
                        </TouchableWithoutFeedback>

                    </View>

                <View style={styles.content}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#8a344c" />
                        </View>
                    ) : (
                        <>
                            {posts?.map(post => <UserPostDesign key={post.id} item={post} />)}
                        </>
                    )}
                </View>

            </ScrollView>

        </MenuProvider>


    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3E8EB'
    },

    content: {
        flex: 1,
        paddingTop: -20,
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

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
