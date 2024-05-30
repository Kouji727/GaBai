import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TouchableHighlight, ScrollView, TextInput } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { db, auth, firebase } from '../firebase';
import EditPostCounselor from './editPostCounselor';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import UserPostDesign2 from './userPostDesign copy';

const ThreadCommentPage2 = ({ route }) => {
    const { item } = route.params;
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState(null);
    const [firebaseImageUrlp, setFirebaseImageUrlp] = useState(null);
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalImgVisible, setModalImgVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [likeCount, setLikeCount] = useState(item.like || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);
    const [editedContent, setEditedContent] = useState('');
    const [addingComorBlank, setaddingComorBlank] = useState(true);
    const [threads, setThread] = useState([]);

    const inappropriateWords = [
        'tanga', 'gago', 'gaga', 'putangina', 'tarantado', 'puke', 'pepe', 'pokpok', 'shit', 'bullshit',
        'fuck', 'fck', 'whore', 'puta', 'tangina', 'syet', 'tite', 'kupal', 'kantot', 'hindot', 'nigga', 'motherfucker', 'kinginamo', 'taenamo',
        'asshole', 'kike', 'cum', 'pussy'
    ];

    useEffect(() => {
        const unsubscribe = db.collection('questions').doc(item.id)
            .onSnapshot((snapshot) => {
                const threadData = snapshot.data();
                if (threadData) {
                    const thread = {
                        id: snapshot.id,
                        comments: threadData.comments || [], // Initialize comments as an empty array
                        username: threadData.username,
                        comment: threadData.comment,
                        flaggedComments: threadData.flaggedComments || []
                    };
                    setThread(thread); // Set the whole thread object
                }
            });

        return () => unsubscribe();
    }, [item.id]);

    // Set current user by targeting UID in the users collection
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await db.collection('users').doc(auth.currentUser?.uid).get();
                if (userDoc.exists) {
                    setCurrentUser(userDoc.data());
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

        const unsubscribe = db.collection('users').doc(auth.currentUser?.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setCurrentUser(doc.data());
                }
            }, (error) => {
                console.error('Error in user snapshot:', error);
            });

        return () => unsubscribe();
    }, []);

    // Fetch the content image
    useEffect(() => {
        const unsubscribe = db.collection('questions').doc(item.id)
            .onSnapshot((threadSnapshot) => {
                try {
                    if (threadSnapshot.exists) {
                        const threadData = threadSnapshot.data();
                        if (threadData.image && threadData.image.img) {
                            setFirebaseImageUrlp(threadData.image.img);
                        } else {
                            setFirebaseImageUrlp(null);
                        }

                        setUpdatedItem(prevItem => ({
                            ...prevItem,
                            like: threadData.like,
                            comment: threadData.comment,
                            username: threadData.username,
                            content: threadData.content
                        }));
                    } else {
                        setFirebaseImageUrlp(null);
                    }
                } catch (error) {
                    console.error('Error fetching thread image:', error);
                }
            }, (error) => {
                console.error('Error fetching thread:', error);
            });

        return () => unsubscribe();
    }, [item.id]);

    // Fetch username profile pic
    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                if (updatedItem.username) {
                    const username = updatedItem.username;
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
    }, [updatedItem.username]); // Remove 'threads' from the dependency array

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const threadRef = db.collection('questions').doc(item.id);

        const unsubscribe = threadRef.onSnapshot(snapshot => {
            const threadData = snapshot.data();
            const currentUserLiked = threadData.likedBy && threadData.likedBy.includes(currentUser.username);
            setIsLiked(currentUserLiked);
            setLikeCount(threadData.like || 0);
            setUpdatedItem(prevItem => ({
                ...prevItem,
                like: threadData.like,
                comment: threadData.comment,
                username: threadData.username,
                content: threadData.content
            }));
        }, (error) => {
            console.error('Error fetching thread:', error);
        });

        return unsubscribe;
    }, [item.id, currentUser?.username]);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleImgModal = () => {
        setModalImgVisible(!modalImgVisible);
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
        navigation.goBack();
        try {
            // Get the post image URL
            const threadSnapshot = await db.collection('questions').doc(updatedItem.id).get();
            if (threadSnapshot.exists) {
                const threadData = threadSnapshot.data();
                if (threadData.image && threadData.image.img) {
                    const imageUrl = threadData.image.img;
                    // Delete the post image from Firebase Storage
                    const imageRef = firebase.storage().refFromURL(imageUrl);
                    await imageRef.delete();
                }
            }
            // Delete the post document from Firestore
            await db.collection('questions').doc(updatedItem.id).delete();
            console.log('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    };

    const handleAddComment = async () => {
        try {
            console.log("Item ID:", item?.id);
            if (item?.id) {
                setaddingComorBlank(true);
                setEditedContent('');
                const newComment = { content: editedContent, commentedBy: currentUser.username };

                // Check if the comment contains inappropriate words
                const containsInappropriateWords = inappropriateWords.some(word => newComment.content.toLowerCase().includes(word));

                if (containsInappropriateWords) {
                    const updatedComments = [...threads.flaggedComments, newComment];
                    Alert.alert('Inappropriate Content', 'Your post contains inappropriate text.');
                    await db.collection('questions').doc(item.id).update({
                        flaggedComments: updatedComments,
                    });
                    console.log('Comment added to flagged comments successfully!');

                } else {
                    const updatedComments = [...threads.comments, newComment];
                    await db.collection('questions').doc(item.id).update({
                        comments: updatedComments,
                        comment: threads.comment + 1
                    });
                    console.log('Comment added successfully!');
                }

                setEditedContent('');
            } else {
                console.error('Item is null or undefined');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLike = async () => {
        try {
            const threadRef = db.collection('questions').doc(updatedItem.id);

            const threadSnapshot = await threadRef.get();
            const threadData = threadSnapshot.data();

            const newLikes = isLiked ? threadData.like - 1 : threadData.like + 1;

            const newLikedBy = isLiked ?
                threadData.likedBy.filter(u => u !== currentUser.username)
                : [...(threadData.likedBy || []), currentUser.username];

            await threadRef.update({
                like: newLikes,
                likedBy: newLikedBy
            });

            setIsLiked(!isLiked);
            setLikeCount(newLikes);
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const sanitizeContent = (content) => {
        let sanitizedContent = content;
        inappropriateWords.forEach(word => {
            sanitizedContent = sanitizedContent.replace(new RegExp(word, "ig"), "*".repeat(word.length));
        });
        return sanitizedContent;
    };

    return (
        <MenuProvider skipInstanceCheck>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.foHeader}>
                    <View style={styles.allCont}>
                        {/* Modal components */}
                        <Modal
                            transparent={true}
                            visible={modalVisible}
                            animationType="slide"
                            onRequestClose={() => { }}>
                            <View style={styles.modalContainer}>
                                <EditPostCounselor item={updatedItem} onPress={toggleModal} submit={() => setModalVisible(false)} />
                            </View>
                        </Modal>

                        <Modal
                            visible={modalImgVisible}
                            transparent={true}
                            animationType="fade">
                            <ImageViewer
                                imageUrls={[{ url: firebaseImageUrlp }]}
                                enableSwipeDown={true}
                                onSwipeDown={toggleImgModal}
                                renderIndicator={() => null}
                                style={styles.modalImage} />

                            <TouchableOpacity style={styles.closeButton} onPress={toggleImgModal}>
                                <Ionicons name="close-circle" size={34} color="white" />
                            </TouchableOpacity>
                        </Modal>

                        <View style={{ margin: 5 }}>
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
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 12, ellipsizeMode: 'tail', numberOfLines: 1 }}>
                                            {updatedItem.username}
                                        </Text>
                                        <View style={styles.datePosted}>
                                            <Text style={{ color: 'grey', fontSize: 12 }}>
                                                {updatedItem.createdAt}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.settingsIcon}>
                                    {currentUser && currentUser.username === updatedItem.username && (
                                        <Menu name={`modal-menu-${updatedItem.id}`} skipInstanceCheck={true}>
                                            <MenuTrigger>
                                                <View style={{ width: 40, height: 40, transform: [{ rotate: '90deg' }], alignItems: 'center', justifyContent: 'center' }}>
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
                                    )}
                                </View>
                            </View>

                            <View style={styles.postTitle}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                                    {sanitizeContent(updatedItem.content)}
                                </Text>
                            </View>

                            {firebaseImageUrlp && (
                                <View style={styles.postPic}>
                                    <TouchableHighlight style={styles.imageContainer} onPress={toggleImgModal}>
                                        <Image
                                            source={{ uri: firebaseImageUrlp }}
                                            style={styles.image} />
                                    </TouchableHighlight>
                                </View>
                            )}

                            {/* DELETE AFTER */}
                            {/* <Text>{updatedItem.id}</Text> */}
                            <View style={styles.lowerButtonCont}>
                                <TouchableOpacity style={styles.icontainer} onPress={handleLike}>
                                    <FontAwesome6 name="heart" size={24} color={isLiked ? 'red' : 'grey'} solid={isLiked} />
                                    <Text style={{ fontSize: 12, color: 'grey', marginLeft: 5 }}>{likeCount}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.icontainer} >
                                    <FontAwesome6 name="comment-alt" size={24} color="grey" />
                                    <Text style={{ fontSize: 12, color: 'grey', marginLeft: 5 }}>{updatedItem.comment}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                    <View style={styles.combineLeftBord}>

                        <View style={styles.commentsCont}>
                        </View>

                        <View style={styles.mapComCont}>
                            {threads.comments && threads.comments.map((comment, index) => (
                                <UserPostDesign2 key={index} item={comment} index={index} id={updatedItem.id} />
                            ))}


                        </View>


                    </View>

                </View>

            </ScrollView>

            <View style={styles.addCommentCont}>

                <View style={styles.twoItems}>
                    <View style={styles.textInputDes}>
                        <TextInput
                            placeholder='Add comment'
                            onChangeText={(text) => {
                                setEditedContent(text);
                                setaddingComorBlank(!text.trim()); // If text is empty, set addingComorBlank to false
                            }}
                            value={editedContent}
                            multiline
                        />
                    </View>


                    <TouchableOpacity
                        style={styles.iconDes}
                        onPress={handleAddComment}
                        disabled={addingComorBlank} // Disable TouchableOpacity when addingComment is true
                    >
                        <Ionicons name="send" size={20} color={addingComorBlank ? '#ede1e5' : '#BA5255'} />
                    </TouchableOpacity>
                </View>
            </View>



        </MenuProvider>
    );
};

export default ThreadCommentPage2;

const styles = StyleSheet.create({

    textInputDes: {
        backgroundColor: '#f5eded',
        width: '90%',
        borderRadius: 3,
        padding: 5,
    },

    iconDes: {
        // Your regular style for the TouchableOpacity
    },
    disabled: {
        opacity: 0.5, // Define the opacity for disabled state
    },

    addCommentCont: {
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },

    twoItems: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },

    mapComCont: {
        flex: 1,
    },

    combineLeftBord: {
        flexDirection: 'row',
        paddingBottom: 30,
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    commentsCont: {
        borderLeftWidth: 2,
        borderLeftColor: '#c4787a',
        marginLeft: 20,
        height: '80%',
        opacity: 0.3
    },

    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalCommentContainer: {
        flex: 1,
        backgroundColor: 'red',
    },

    modalRemoveButton: {
        width: '15%',
        aspectRatio: 1, // To make it a square
        backgroundColor: '#F3E8EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100, // To make it a circle
        marginTop: 10
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
    },

    foHeader: {
        flex: 1,
        backgroundColor: '#f5eded',
    },

    allCont: {
        alignSelf: 'center',
        width: '95%',
        borderBottomColor: '#c4787a',
        borderBottomWidth: 1,
        padding: 5,
    },

    profileName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '93%',
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
        marginRight: 5
    },

    postTitle: {
        marginTop: 5
    },

    lowerButtonCont: {
        flexDirection: 'row',
        marginTop: 10,
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

    postPic: {
        marginTop: 10,
    },

    imageContainer: {
        //maxHeight: 100,
        elevation: 3,
        shadowColor: 'black',
        borderRadius: 15,
        overflow: 'hidden'
    },

    image: {
        aspectRatio: 1,
        width: '100%',
        resizeMode: 'cover'
    },


    modalImage: {
        flex: 1,
        backgroundColor: 'black',
    },

    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

const menuStyles = {
    optionsContainer: {
        marginTop: -50,
        backgroundColor: '#F5F5F5',
        padding: 1,
        borderRadius: 10,
        zIndex: 1000,
    },
};
