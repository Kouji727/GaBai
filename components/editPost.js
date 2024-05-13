import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'
import { useState, useEffect } from 'react';
import { db, firebase, auth } from '../firebase';

const EditPost = ({ id, item, index, onPress, submit }) => {
    const [editedTitle, setEditedTitle] = useState(item ? item.content : '');
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
    const [postData, setPostData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

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

    const deletePost = async () => {
        try {
            const updatedComments = postData.comments.filter((comment, i) => i !== index);
            const newCommentCount = postData.comment - 1;
            await db.collection('threads').doc(id).update({
                comments: updatedComments,
                comment: newCommentCount,
            });
            console.log('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    };

    // Fetch username profile pic
    useEffect(() => {

        const fetchUserImage = async () => {
            try {
                if (item.commentedBy) {
                    const username = item.commentedBy;
                    const userRef = db.collection('users').where('username', '==', username);

                    const unsubscribe = userRef.onSnapshot(snapshot => {
                        if (!snapshot.empty) {
                            const user = snapshot.docs[0].data();
                            setFirebaseImageUrl(user.img || null);
                        } else {
                            setFirebaseImageUrl(null);
                        }
                    });

                    return () => unsubscribe();
                }
            } catch (error) {
                console.error('Error fetching user image:', error);
            }
        };

        fetchUserImage();
    }, [item.commentedBy]);

    useEffect(() => {
        const postRef = db.collection('threads').doc(id);
    
        const unsubscribe = postRef.onSnapshot((doc) => {
            if (doc.exists) {
                setPostData(doc.data());
            } else {
                console.log('No such document!');
            }
        });
    
        return () => unsubscribe();
    }, [id]);

    const inappropriateWords = ['tanga', 'gago', 'gaga','putangina', 'tarantado','puke','pepe', 'pokpok', 'shit', 'bullshit',
    'fuck', 'fck' , 'whore', 'puta', 'tangina' ,'syet', 'tite', 'kupal', 'kantot', 'hindot', 'nigga', 'motherfucker', 'kinginamo', 'taenamo'
   , 'asshole', 'kike', 'cum', 'pussy']

   const handleUpdate = async () => {
    try {
        
        const newComment = { content: editedTitle, commentedBy: currentUser.username };
        
        const containsInappropriateWords = inappropriateWords.some(word =>
            editedTitle.toLowerCase().includes(word)
        );

        onPress(); // Close the modal after updating

        if (containsInappropriateWords) {

            deletePost();

            const updatedComments = [...postData.flaggedComments, newComment];
            Alert.alert('Inappropriate Content', 'Your post contains inappropriate text.');
            await db.collection('threads').doc(id).update({
                flaggedComments: updatedComments,
            });
            console.log('Comment added to flagged comments successfully!');
        } else {
            if (item) {
                if (containsInappropriateWords) {
                    onPress();
                    const updatedComments = [...postData.flaggedComments, editedTitle];
                    Alert.alert('Inappropriate Content', 'Your post contains inappropriate text.');
                    await db.collection('threads').doc(item.id).update({
                        flaggedComments: updatedComments,

                    });
                    console.log('Comment added to flagged comments successfully!');
                } else {

                    const updatedComments = postData?.comments.map((comment, i) => {
                        if (i === index) {
                            return { ...comment, content: editedTitle };
                        } else {
                            return comment;
                        }
                    });
        
                    await db.collection('threads').doc(id).update({
                        comments: updatedComments
                    });
        
                    console.log('Comment updated successfully!');

                }
            } else {
                console.error('Item is null or undefined');
            }
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
};

    
    return (
        <View style={styles.allCont}>
            <View style={styles.borderBottom}>
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
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                                    {item ? item.commentedBy : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.postTitle}>
                        <TextInput
                            style={{ fontWeight: 'bold', fontSize: 18 }}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            multiline={true}
                        />
                    </View>
                    <View style={styles.lowerButtonCont}>
                    </View>
                </View>
            </View>
            <View style={styles.canAndSub}>
                <TouchableOpacity style={styles.cancelButton} onPress={onPress}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditPost

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
        backgroundColor: '#e8dada',
        borderRadius: 15,
        paddingTop: 15,
    },
    borderBottom: {
        borderBottomColor: '#c4787a',
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
        marginRight: 5
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
