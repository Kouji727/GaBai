import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { db } from '../firebase';

import CreateMessage from '../components/createMessage';
import ContentItem from '../components/contentItem';
import PostDesign from '../components/postDesign';

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



    const [ posts, setPosts ] = useState();

    useEffect( () => {
        const unsubscribe = db.collection('posts')
        .onSnapshot(snapshot => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                username: doc.data().username,
                title: doc.data().title,
                date: doc.data().date.toDate().toLocaleString()
            }));
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, [])


    return (

            <View style={styles.container}>
                    <View style={styles.fSpace}>
                        <Text style={styles.fSpaceText}>
                            Freedom Space
                        </Text>

                    </View>

                <View style={styles.content}>


                    {
                        posts?.map(post => 
                        <PostDesign 
                            key={post.id}
                            username={post.username} 
                            title={post.title} 
                            date={post.date}
                        />)
                    }

                </View>

            </View>

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


})