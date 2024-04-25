import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

const PostDesign = () => {
  return (
    <View style={styles.container}>

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
                                    Titeng Pinakamatigas
                                </Text>
                                
                            </View>

                            <View style={styles.datePosted}>
                                <Text style={{color: 'grey', fontSize: 12}}>
                                    5h
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
                            Bugbugan sa DYCI
                    </Text>

                </View>

                <View style={styles.postPic}>
                        <TouchableOpacity style={styles.imageContainer}>
                            <Image
                            source={require('../assets/testpic.jpg')}
                            style={styles.image}
                            />
                        </TouchableOpacity>
                </View>
                
                <View style={styles.lowerButtonCont}> 
                    <View style={styles.icontainer}>
                        <FontAwesome6 name="heart" size={24} color="red" solid/>
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>10</Text>
                        
                    </View>

                    <View style={styles.icontainer}>
                        <FontAwesome6 name="comment-alt" size={24} color="grey"/>
                        <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>5</Text>

                    </View>
                </View>
            </View>


        </View>

    </View>
  )
}

export default PostDesign


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 35

    },

    allCont: {
        alignSelf: 'center',
        width: '90%',
        borderBottomColor: 'grey',
        borderBottomWidth: 1

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
        borderRadius: 25,
      },

      image: {
        width: '100%',
        height: 'auto',
        resizeMode: 'cover',
        aspectRatio: 1,
        borderRadius: 25,
      },

      lowerButtonCont: {
        flexDirection: 'row',
        marginVertical: 15,
        justifyContent: 'space-around'
      },

      icontainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },

})