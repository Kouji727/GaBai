import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal, Platform, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EditInfo from '../components/editInfo';
import { auth, db, firebase, firestore } from '../firebase';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

export default function Settings() {
    const [userData, setUserData] = useState({});
    const [editableFields, setEditableFields] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user) {
            fetchPfp(user.uid);
        }
    }, [user]);

    const fetchPfp = async (uid) => {
        try {
            const userRef = firebase.firestore().collection('users').doc(uid);
            const unsubscribe = userRef.onSnapshot((doc) => {
                const pfpURL = doc.data().pfp;
                if (pfpURL) {
                    setFirebaseImageUrl(pfpURL);
                } else {
                    setFirebaseImageUrl(null);
                }
            });
            return () => unsubscribe();
        } catch (error) {
            console.error(error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePic = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
            setModalVisible(true);
        }
    };

    const uploadMedia = async () => {
        setUploading(true);

        try {
            const { uri } = await FileSystem.getInfoAsync(image);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = image.substring(image.lastIndexOf('/') + 1);
            const ref = firebase.storage().ref().child(filename);

            await ref.put(blob);
            const downloadURL = await ref.getDownloadURL();

            // Delete the previous profile picture
            if (userData.pfp) {
                await deletePfp(userData.pfp);
            }

            // Update Firestore with the new image link
            const uid = auth.currentUser.uid;
            await db.collection('users').doc(uid).set({
                pfp: downloadURL
            }, { merge: true });

            setFirebaseImageUrl(downloadURL);
            setUploading(false);
            toggleModal();
            setImage(null);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const userDoc = await db.collection('users').doc(auth.currentUser?.uid).get();
            if (userDoc.exists) {
                setUserData(userDoc.data());
            }
        };
        fetchUserData();

        const unsubscribe = db.collection('users').doc(auth.currentUser?.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setUserData(doc.data());
                }
            });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchEditableData = async () => {
            const userDoc = await db.collection('users').doc(auth.currentUser?.uid).get();
            if (userDoc.exists) {
                const fields = ['username','first name', 'surname', 'course', 'address', 'phone'];
                setEditableFields(fields);
            }
        };
        fetchEditableData();
    }, []);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const deletePfp = async (pfpURL) => {
        try {
            setDeleting(true);
            // Delete the picture in storage
            await firebase.storage().refFromURL(pfpURL).delete();

            // Clear the pfp field in the user's document
            const uid = auth.currentUser.uid;
            await db.collection('users').doc(uid).update({ pfp: firebase.firestore.FieldValue.delete() });

            setFirebaseImageUrl(null);
            setDeleting(false);
            toggleModal();
        } catch (error) {
            console.error('Error removing profile picture:', error);
            setDeleting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>

                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.cancelBut} onPress={toggleModal}>
                            <Feather name="x" size={24} color="#8a344c" />
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', fontSize: 20, color: '#8a344c', marginBottom: 10}} >Profile Picture</Text>
                        {image && <Image source={{ uri: image }} style={{width: '30%', aspectRatio: 1, borderRadius: 100}} />}
                        {uploading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#8a344c" />
                                <Text style={styles.uploadingText}>Uploading...</Text>
                            </View>
                        )}
                        {deleting && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#8a344c" />
                                <Text style={styles.uploadingText}>Deleting...</Text>
                            </View>
                        )}
                        <View style={styles.threeButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={takePic}>
                                <Ionicons name="camera-outline" size={24} color="#8a344c" />
                                <Text style={styles.modalButtonText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                                <Ionicons name="image-outline" size={24} color="#8a344c" />
                                <Text style={styles.modalButtonText}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => deletePfp(userData.pfp)}>

                                <Ionicons name="trash-outline" size={24} color="#8a344c" />
                                <Text style={styles.modalButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>

                        {image && (
                            <TouchableOpacity style={styles.uploadBut} onPress={uploadMedia}>
                                <MaterialCommunityIcons name="upload-outline" size={24} color="#8a344c" />
                                <Text style={styles.modalButtonText}>Upload</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profilePic}>
                    <View style={styles.counselorIcons}>
                        <Image
                            style={styles.pfp}
                            source={firebaseImageUrl ? { uri: firebaseImageUrl } : require('../assets/defaultPfp.jpg')}
                            onError={(error) => console.error('Image loading error:', error)}
                        />
                        <TouchableOpacity style={styles.editPfp} onPress={toggleModal}>
                            <MaterialCommunityIcons name="image-edit" size={20} color="#8a344c" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textsCont}>
                        <Text style={styles.textStyle}>{userData.username}</Text>
                        <View style={styles.borderBot}>
                            <Text style={styles.defaultText}>{userData['first name']} {userData.surname}</Text>
                            <Text style={[styles.defaultText, { marginBottom: 10 }]}>{userData.email}</Text>
                        </View>
                        <Text style={styles.textRoleStyle}>{userData.role}</Text>
                    </View>
                    {editableFields.map(field => (
                        <EditInfo key={field} item={{ Field: field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), Value: userData[field] || '' }} />
                    ))}
                </View>
                <View style={styles.fill} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    fill: {
        height: 100
    },
    defaultText: {
        color: '#8a344c',
    },
    container: {
        flex: 1,
        backgroundColor: '#F3E8EB',
    },
    profilePic: {
        flex: 1,
        alignItems: 'center',
    },
    counselorIcons: {
        marginTop: 35,
        width: '55%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    pfp: {
        marginTop: '20%',
        width: '80%',
        height: '80%',
        borderRadius: 100,
        margin: 10,
    },
    editPfp: {
        width: '18%',
        height: '18%',
        backgroundColor: '#F3E8EB',
        borderRadius: 100,
        position: 'relative',
        right: -60,
        top: -50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#8a344c'
    },
    textsCont: {
        width: '75%',
        alignItems: 'center',
        marginBottom: 50,
    },
    borderBot: {
        width: '100%',
        borderBottomColor: '#E2AFBF',
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#8a344c'
    },
    textRoleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8a344c'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '85%',
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        elevation: 10,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    threeButtons: {
        flexDirection: 'row',
    },
    modalButton: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#F3E8EB',
        margin: 5,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginTop: 25,
        elevation: 2,
        shadowColor: '#8a344c',
    },
    cancelBut: {
        backgroundColor: '#F3E8EB',
        margin: 10,
        padding: 5,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#8a344c',
        position: 'absolute',
        right: 0
    },

    uploadBut: {
        width: '50%',
        backgroundColor: '#F3E8EB',
        margin: 5,
        padding: 10,
        borderRadius: 90,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginTop: 25,
        elevation: 2,
        shadowColor: '#8a344c',
        flexDirection: 'row'
    },

    modalButtonText: {
        color: '#8a344c',
        fontSize: 12,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    uploadingText: {
        marginTop: 10,
        color: '#8a344c',
    }
});
