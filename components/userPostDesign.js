import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { db, auth } from '../firebase';
import EditPost from './editPost';
import { Ionicons } from '@expo/vector-icons';

const UserPostDesign = ({ item }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [userUID, setUserUID] = useState(null);
    const [hideSettingsIcon, setHideSettingsIcon] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                if (item.username) {
                    const username = item.username;
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
    }, [item.username]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = await db.collection('threads').where('username', '==', item.username).get();
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
    }, [item.username]);

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
            await db.collection('threads').doc(item.id).delete();
            console.log('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    };

    return (
        <View style={styles.allCont}>
            <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => {}}>
                <View style={styles.modalContainer}>
                    <EditPost item={item} onPress={toggleModal} submit={() => setModalVisible(false)} />
                </View>
            </Modal>

            <View style={{ margin: 5 }}>
                <View style={styles.profileName}>
                    <View style={styles.topItems}>
                        <View style={styles.pfpCont}>
                            <TouchableOpacity>
                                        <Image
                                            style={styles.pfp}
                                            resizeMode='cover'
                                            source={firebaseImageUrl ? { uri: firebaseImageUrl } : require('../assets/defaultPfp.jpg')}
                                            onError={(error) => console.error('Image loading error:', error)}
                                        />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.name}>
                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{user ? user.username : 'Loading...'}</Text>
                        </View>

                        <View style={styles.datePosted}>
                            <Text style={{ color: 'grey', fontSize: 12 }}>{item.createdAt}</Text>
                        </View>
                    </View>

                    {/* Conditionally render the settings icon */}
                    {!hideSettingsIcon && (
                        <View style={styles.settingsIcon}>
                            <Menu>
                                <MenuTrigger>
                                    <View style={{ width: 20, height: 20, transform: [{ rotate: '90deg' }] }}>
                                        <Octicons name="kebab-horizontal" size={20} color="black" />
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

                <View style={styles.postTitle}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.content}</Text>
                </View>

            </View>
        </View>
    );
};

export default UserPostDesign;

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
    twoButtonsBelow: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'red',
    },
    allCont: {
        alignSelf: 'center',
        width: '95%',
        borderBottomColor: '#E2AFBF',
        borderBottomWidth: 1,
        padding: 5,

    },
    profileName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingsIcon: {},
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
        marginTop: 5,
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
});

const menuStyles = {
    optionsContainer: {
        marginTop: -50,
        backgroundColor: '#F5F5F5',
        padding: 1,
        borderRadius: 10,
    },
};
