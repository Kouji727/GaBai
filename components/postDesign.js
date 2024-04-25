import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

const PostDesign = ({username, title, date}) => {
return (


        <View style={styles.allCont}>

            <View style={{        margin: 5}}>
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
                                    {username}
                                </Text>
                                
                            </View>

                            <View style={styles.datePosted}>
                                <Text style={{color: 'grey', fontSize: 12}}>
                                    {date}
                                </Text>
                                
                            </View>

                        </View>

                        <View style={styles.settingsIcon}>
                            <TouchableOpacity>
                                <View style={{ width: 17, height: 17, transform: [{ rotate: '90deg' }] }}>
                                    <Octicons name="kebab-horizontal" size={17} color="black" />
                                </View>

                            </TouchableOpacity>
                            
                        </View>
                </View>

                <View style={styles.postTitle}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>
                        {title}
                    </Text>

                </View>

                <View style={styles.postPic}>
                        <TouchableOpacity style={styles.imageContainer}>
                            <Image
                            source={require('../assets/kou.jpg')}
                            style={styles.image}
                            />
                        </TouchableOpacity>
                </View>
                
                <View style={styles.lowerButtonCont}> 
                    <TouchableOpacity style={styles.icontainer}>
                        <FontAwesome6 name="heart" size={24} color="red" solid/>
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>10</Text>
                        
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.icontainer}>
                        <FontAwesome6 name="comment-alt" size={24} color="grey"/>
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>5</Text>

                    </TouchableOpacity>
                </View>
            </View>


        </View>

  )
}

export default PostDesign


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

    lowerButtonCont: {
        flexDirection: 'row',
        marginVertical: 15,
        justifyContent: 'space-around',
    },

    icontainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

})