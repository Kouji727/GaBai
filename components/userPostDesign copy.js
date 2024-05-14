import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { db, auth } from '../firebase';
import EditPost from './editPost';
import { Ionicons } from '@expo/vector-icons';

const UserPostDesign2 = ({ item, index, id }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [userUID, setUserUID] = useState(null);
    const [hideSettingsIcon, setHideSettingsIcon] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
    const [showFullContent, setShowFullContent] = useState(false);
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        const postRef = db.collection('questions').doc(id);
    
        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setPostData(doc.data());
            } else {
                console.log('No such document!');
            }
        });
    
        return () => unsubscribe();
    }, [id]);


    const [editedContent, setEditedContent] = useState(item.comments);

    useEffect(() => {
        const unsubscribe = db.collection('questions').doc(item.id)
          .onSnapshot((snapshot) => {
            const threadData = snapshot.data();
            if (threadData) {
              const thread = {
                id: snapshot.id,
                comments: threadData.comments,
              };
              setEditedContent(thread.comments || []);
            }
          });
      
        return () => unsubscribe();
      }, [item.id]);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                if (item.commentedBy) {
                    const username = item.commentedBy;
                    const userRef = db.collection('users').where('username', '==', username);

                    const snapshot = await userRef.get();
                    if (!snapshot.empty) {
                        const user = snapshot.docs[0].data();
                        setFirebaseImageUrl(user.img || null);
                    } else {
                        setFirebaseImageUrl(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching user image:', error);
            }
        };

        fetchUserImage();
    }, [item.commentedBy]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = await db.collection('questions').where('username', '==', item.commentedBy).get();
                if (!userDoc.empty) {
                    userDoc.forEach((doc) => {
                        setUser(doc.data());
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [item.commentedBy]);


    //gets all info about auth.uid which is current user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDoc = await db.collection('users').doc(currentUser.uid).get();
                    if (userDoc.exists) {
                        setUserUID(userDoc.data());
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (userUID && user && userUID.username === user.username) {
            setHideSettingsIcon(false);
        }
    }, [user, userUID]);
    

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const submit = () => {
        setModalVisible(false);
    };

    const editOption = () => {
        toggleModal();
    };

    const deleteOption = () => {
        Alert.alert(
            'Delete Post?',
            'Are you sure you want to delete this post?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'Delete', onPress: deletePost },
            ],
            { cancelable: true }
        );
    };

    const deletePost = async () => {
        try {
            const updatedComments = postData.comments.filter((comment, i) => i !== index);
            const newCommentCount = postData.comment - 1;
            await db.collection('questions').doc(id).update({
                comments: updatedComments,
                comment: newCommentCount
            });
            console.log('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    };
    
    

    const toggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    return (
        <View style={styles.allCont}>
            <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => {}}>
                <View style={styles.modalContainer}>
                    <EditPost item={item} index={index} id={id} onPress={toggleModal} submit={() => setModalVisible(false)} />
                </View>
            </Modal>

            <View style={{ marginHorizontal: 5 }}>
                <View style={styles.profileName}>
                    <View style={styles.topItems}>
                        <View style={styles.pfpCont}>
                            <View>
                                <Image
                                    style={styles.pfp}
                                    resizeMode='cover'
                                    source={firebaseImageUrl ? { uri: firebaseImageUrl } : require('../assets/defaultPfp.jpg')}
                                    onError={(error) => console.error('Image loading error:', error)}
                                />
                            </View>
                        </View>

                        <View style={styles.nameAndCont}>
                            <View style={styles.name}>
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{item.commentedBy}</Text>
                            </View>

                            <View style={styles.postTitle}>
                                <Text style={{ fontSize: 12 }}>{showFullContent ? item.content : `${item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}`}
                                    {item.content.length > 100 && (
                                            <Text style={styles.seeMoreButton} onPress={toggleContent}>{showFullContent ? '  Hide' : 'See More'}</Text>
                                    )}
                                </Text>
                            </View>


                        </View>

                        {/* Conditionally render the settings icon */}
                        {!hideSettingsIcon && (
                            <View style={styles.settingsIcon}>
                                <Menu>
                                    <MenuTrigger>
                                        <View style={{alignItems: 'center', justifyContent: 'center', width: 25, height: 25, transform: [{ rotate: '90deg' }] }}>
                                            <Octicons name="kebab-horizontal" size={15} color="black" />
                                        </View>
                                    </MenuTrigger>

                                    <MenuOptions customStyles={menuStyles}>
                                        <MenuOption onSelect={editOption} style={styles.menuItemStyle}>
                                            <Text style={styles.menuItemTextStyle}>Edit</Text>
                                        </MenuOption>

                                        <MenuOption onSelect={deleteOption} style={styles.menuItemStyle}>
                                            <Text style={styles.menuItemTextStyle}>Delete</Text>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default UserPostDesign2;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalRemoveButton: {
        width: '15%',
        aspectRatio: 1,
        backgroundColor: '#F3E8EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginTop: 10,
    },
    
    modalEditButton: {
        width: '25%',
        height: 35,
        backgroundColor: '#F3E8EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 10,
    },

    allCont: {
        alignSelf: 'center',
        width: '95%',
        padding: 5,

    },
    profileName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingsIcon: {
        padding: 10,
    },

    topItems: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    pfp: {
        height: 35,
        borderRadius: 100,
        marginRight: 5,
        aspectRatio: 1,
    },
    name: {
        marginRight: 5,
    },
    postTitle: {
        marginTop: 0,
    },
    lowerButtonCont: {
        flexDirection: 'row',
        marginVertical: 15,
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
    },
    seeMoreButton: {
        color: '#BA5255',
        fontWeight: 'bold',
        fontSize: 12,
    },
    nameAndCont: {
        backgroundColor: '#e8dada',
        borderRadius: 5,
        padding: 8,
        paddingVertical: 5,
        maxWidth: '87%'
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
