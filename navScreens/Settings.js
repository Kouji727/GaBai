import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EditInfo from '../components/editInfo';
import { auth, db } from '../firebase';

export default function Settings() {
    const [userData, setUserData] = useState({});
    const [editableFields, setEditableFields] = useState([]);

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
    
    

    return (

        <View style={styles.container}>
            <ScrollView>
                <View style={styles.profilePic}>
                    <View style={styles.counselorIcons}>
                            <Image
                                style={styles.pfp}
                                source={require('../assets/romz.jpg')} // Use require for local images
                                onError={(error) => console.error('Image loading error:', error)} // Handle errors
                            />
                        <TouchableOpacity style={styles.editPfp} onPress={() => console.log('pressed')}>
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
            
            </ScrollView>
        </View>
    );
    
    
}

const styles = StyleSheet.create({
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
    }
});
