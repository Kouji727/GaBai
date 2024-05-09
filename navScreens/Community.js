import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Modal } from 'react-native';
import {db, streamPosts } from '../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import CreateMessage from '../components/createMessage';
import ContentItem from '../components/contentItem';
import CounselorPostDesign from '../components/counselorPostDesign';
import UserPostDesign from '../components/userPostDesign';
import EditPost from '../components/editPost';

import {useNavigation} from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import CreatePost from '../documents/CreatePost';

export default function Community() {

    const navigation = useNavigation();
    
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [threads, setThreads] = useState();


    const mapDocToPost = (document) => {
        return {
            id: document.id,
            username: document.data().username,
            content: document.data().content,
            createdAt: document.data().createdAt.toDate().toLocaleString(),
            like: document.data().like,
            comment: document.data().comment,
        }
    }

    useEffect( () => {
        const unsubscribe = streamPosts({
            next: querySnapshot => {
                const threads = querySnapshot
                .docs.map(docSnapshot => mapDocToPost(docSnapshot))
                setThreads(threads)
                setLoading(false);
            },
            error: (error) => {
                console.log(error);
                setLoading(false);
            }
        });

        return unsubscribe
    }, [setThreads])



    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <MenuProvider>
            <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator = {false}>

                    <View style={styles.fSpace}>
                        <Text style={styles.fSpaceText}>
                            Freedom Space
                        </Text>

                        <TouchableWithoutFeedback onPress={toggleModal}>
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
                            {threads?.map(thread => <CounselorPostDesign key={thread.id} item={thread} />)}
                        </>
                        
                    )}
                </View>

                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <CreatePost cancel={toggleModal} closeAfter={() => setModalVisible(false)}/>
                    </View>
                </Modal>

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

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})
