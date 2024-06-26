import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'

const PostContent = ({cancel, submit}) => {


return (
    <View style={styles.allCont}>

        <View style={styles.borderBottom}>

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
                                    username
                                </Text>
                                
                            </View>

                            <View style={styles.datePosted}>
                                <Text style={{color: 'grey', fontSize: 12}}>
                                    date
                                </Text>
                                
                            </View>

                        </View>

                </View>

                <View style={styles.postTitle}>
                    <TextInput style={{fontWeight: 'bold', fontSize: 18}}>title</TextInput>
                </View>
                
                <View style={styles.lowerButtonCont}> 
                </View>
            </View>


        </View>

        <View style={styles.canAndSub}>

            <TouchableOpacity style={styles.cancelButton} cancel={cancel}>
                <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={submit}>
                <Text>Create</Text>
            </TouchableOpacity>
            
            
        </View>
    </View>
    )
}

export default PostContent


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