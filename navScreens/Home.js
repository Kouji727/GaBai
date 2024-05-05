import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import CounselorCont from '../components/counselorCont';

const Home = () => {

const [content, setContent] = useState([
    { text: 'Jilian Cheila', key: '1' },
    { text: 'Neil Tamondong', key: '2' }
]);

return (
    <ScrollView style={styles.container}
    showsVerticalScrollIndicator={false}>

        <View style={styles.conCont}>
            <View>
                <Text>Welcome! {auth.currentUser?.email}</Text>
            </View>

            <View style={styles.tempCon}>
                <Text>This is Gabai</Text>
            </View>

            <View style={styles.tempCon}>
                <Text>About our Guidance</Text>
            </View>

            <View style={styles.counselorHeader}>
                <Text style={styles.textext}>Our Counselors</Text>

                <ScrollView horizontal={true}
                showsHorizontalScrollIndicator={false}>
                    <View style={styles.counselorRowList}>
                        <TouchableOpacity style={styles.counselorIcons}>
                            <Image
                            style={styles.pfp}
                            source={require('../assets/Neil Tamondong.jpg')} // Use require for local images
                            onError={(error) => console.error('Image loading error:', error)} // Handle errors
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.counselorIcons}>
                            <Image
                            style={styles.pfp}
                            source={require('../assets/Neil Tamondong.jpg')} // Use require for local images
                            onError={(error) => console.error('Image loading error:', error)} // Handle errors
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.counselorIcons}>
                            <Image
                            style={styles.pfp}
                            source={require('../assets/Neil Tamondong.jpg')} // Use require for local images
                            onError={(error) => console.error('Image loading error:', error)} // Handle errors
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.counselorIcons}>
                            <Image
                            style={styles.pfp}
                            source={require('../assets/Neil Tamondong.jpg')} // Use require for local images
                            onError={(error) => console.error('Image loading error:', error)} // Handle errors
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <CounselorCont item="name" />

            <View style={styles.tempCon}>
                <Text>About our Guidance</Text>
            </View>

            <View style={styles.tempCon}>
                <Text>Our Counselors</Text>
            </View>
        </View>
    </ScrollView>
)
}

const styles = StyleSheet.create({

container: {
    flexGrow: 1,
    backgroundColor: '#edd9df'
},

conCont: {
    backgroundColor: 'pink',
    alignItems: 'center'
},

tempCon: {
    width: '85%',
    paddingVertical: 100,
    backgroundColor: 'white',
    margin: 10,
    alignItems: 'center'
},

counselorHeader: {
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
    margin: 10,
},

counselorRowList: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white'
},

smallViewCounselor: {
    flexDirection: 'row',
    justifyContent: 'space-around',
},

textext: {
    alignSelf: 'center',
    padding: 10,
},

counselorIcons: {
    width: 100,
    height: 100,
    marginVertical: 10,
    //backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 5
},

pfp: {
    width: 95,
    height: 95,
    backgroundColor: 'black',
    borderRadius: 100,
    margin: 10,
},
})

export default Home
