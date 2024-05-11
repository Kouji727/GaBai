import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput, TouchableHighlight, ScrollView } from 'react-native'
import { useState, useEffect } from 'react';
import { db } from '../firebase';

const EditPostCounselor = ({ item, onPress, submit}) => {
    const [editedTitle, setEditedTitle] = useState(item.content);
    const [firebaseImageUrlp, setFirebaseImageUrlp] = useState(null);
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);


// Fetch the content image
useEffect(() => {
    const unsubscribe = db.collection('threads').doc(item.id)
        .onSnapshot((threadSnapshot) => {
            if (threadSnapshot.exists) {
                const threadData = threadSnapshot.data();
                if (threadData.image && threadData.image.img) {
                    setFirebaseImageUrlp(threadData.image.img);
                } else {
                    setFirebaseImageUrlp(null);
                }
            } else {
                setFirebaseImageUrlp(null);
            }
        }, (error) => {
            console.error('Error fetching thread image:', error);
        });

    return () => unsubscribe();
}, [item.id]);



    
        // Fetch username profile pic
        useEffect(() => {
            const fetchUserImage = async () => {
                try {
                    if (item.username) {
                        const username = item.username;
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
        }, [item.username]);

    const handleUpdate = () => {
        db.collection('threads')
            .doc(item.id)
            .update({ content: editedTitle })
            .then(() => {
                console.log('Document successfully updated!');
                submit();
            })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });
    };


return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.allCont}>

                <View style={styles.borderBottom}>

                    <View style={{margin: 5}}>
                        <View style={styles.profileName}>
                            
                                <View style={styles.topItems}>
                                    <View style={styles.pfpCont}>

                                        <TouchableOpacity>
                                        {/* profiilepic */}
                                            <Image
                                            style={styles.pfp}
                                            resizeMode='cover'
                                            source={firebaseImageUrl ? { uri: firebaseImageUrl } : require('../assets/defaultPfp.jpg')}
                                            onError={(error) => console.error('Image loading error:', error)}
                                        />

                                        </TouchableOpacity>

                                    </View>

                                    <View style={styles.name}>
                                        <Text style={{fontWeight: 'bold', fontSize: 12}}>
                                            {item.username}
                                        </Text>
                                        
                                    </View>

                                    <View style={styles.datePosted}>
                                        <Text style={{color: 'grey', fontSize: 12}}>
                                            {item.date}
                                        </Text>
                                        
                                    </View>

                                </View>

                        </View>

                        <View style={styles.postTitle}>
                            <TextInput
                            style={{fontWeight: 'bold', fontSize: 18}}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            multiline={true}/>
                        </View>

                        {firebaseImageUrlp && (
                        <View style={styles.postPic}>
                            <TouchableHighlight style={styles.imageContainer}>
                                <Image
                                    source={{ uri: firebaseImageUrlp }}
                                    style={styles.image} />
                            </TouchableHighlight>
                        </View>
                    )}
                        
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
    </ScrollView>
    )
}

export default EditPostCounselor


const styles = StyleSheet.create({

    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },

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
    },

    postPic: {
        marginTop: 10,
        
    },

    imageContainer: {
        elevation: 3,
        shadowColor: 'black',
        borderRadius: 15,
        
    },

    image: {
        width: '100%',
        height: 'auto',
        resizeMode: 'cover',
        aspectRatio: 1,
        borderRadius: 15,
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