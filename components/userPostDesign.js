import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { db } from '../firebase';

const UserPostDesign = ({item}) => {

    const editOption = () => {
        Alert.alert(
            'Edit Post?',
            'Are you sure you want to proceed?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => console.log('Pressed Yes') },
            ],
            { cancelable: true }
        );
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
            await db.collection('posts').doc(item.id).delete();
            console.log('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post: ', error);
        }
    };

    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

return (
        <View style={styles.allCont}>

            <View style={{margin: 5}}>
                <View style={styles.profileName}>
                    
                        <View style={styles.topItems}>
                            <View style={styles.pfpCont}>

                                <TouchableOpacity>

                                <Image
                                    source={require('../assets/stan.jpg')}
                                    style={styles.pfp}
                                    resizeMode="contain"
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
                </View>

                <View style={styles.postTitle}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>
                        {item.title}
                    </Text>

                </View>
                
                <View style={styles.lowerButtonCont}> 
                    <TouchableOpacity style={styles.icontainer} onPress={toggleLike}>
                        <FontAwesome6 name="heart" size={24} color={isLiked ? 'red' : 'grey'} solid={isLiked} />
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}></Text>
                        
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.icontainer}>
                        <FontAwesome6 name="comment-alt" size={24} color="grey"/>
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}></Text>

                    </TouchableOpacity>
                </View>
            </View>


        </View>
    )
}

export default UserPostDesign


const styles = StyleSheet.create({

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