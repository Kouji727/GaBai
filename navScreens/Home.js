import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import CounselorCont from '../components/counselorCont';
import CounselorIcons from '../components/counselorIcons';
import { Ionicons } from '@expo/vector-icons';
import { db, streamCounselor } from '../firebase';

const Home = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCounselor, setSelectedCounselor] = useState(null); // Add selectedCounselor state


    const toggleModal = (item) => {
        setModalVisible(!modalVisible);
        setSelectedCounselor(item);
    };

    const [loading, setLoading] = useState(true);
    const [counselors, setCounselor] = useState([]);


    const mapDocToPost = (document) => {
        return {
            id: document.id,
            username: document.data().username,
            Position: document.data().Position,
            Degree: document.data().Degree,
            Masteral: document.data().Masteral,
        }
    }

    useEffect( () => {
        const unsubscribe = streamCounselor({
            next: querySnapshot => {
                const counselors = querySnapshot.docs
                    .filter(docSnapshot => docSnapshot.data().role === "counselor") // Filter only counselors
                    .map(docSnapshot => mapDocToPost(docSnapshot));
                setCounselor(counselors);
                setLoading(false);
            },
            error: (error) => {
                console.log(error);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, [])

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        {selectedCounselor && <CounselorCont item={selectedCounselor} />}

                    <TouchableOpacity style={styles.modalRemoveButton} onPress={() => setModalVisible(false)}>
                        <View>
                            <Ionicons name="arrow-down" size={24} color="#8a344c" />
                        </View>
                    </TouchableOpacity>

                    </View>
            </Modal>

            <View style={styles.conCont}>

                <View style={styles.tempCon}>
                    <Text>Ga-Bai</Text>
                    <Text>Learn More</Text>
                </View>

                <View style={styles.tempCon}>
                    <Text>About our Guidance</Text>
                </View>

                <View style={styles.counselorHeader}>
                    <Text style={styles.textext}>Our Counselors</Text>

                    <ScrollView horizontal={true}
                    showsHorizontalScrollIndicator={true}>
                        <View style={styles.counselorRowList}>
                            {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#8a344c" />
                            </View>
                            ) : (
                                <>
                                    {counselors.map(counselor => <CounselorIcons key={counselor.id} item={counselor} onPress={() => toggleModal(counselor)} />)}
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},

modalRemoveButton: {
    width: '15%',
    aspectRatio: 1, // To make it a square
    backgroundColor: '#F3E8EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100, // To make it a circle
    marginTop: 20
},

container: {
    flex: 1,
    backgroundColor: '#F3E8EB',
},

conCont: {
    alignItems: 'center'
},

tempCon: {
    width: '85%',
    paddingVertical: 50,
    backgroundColor: 'white',
    margin: 10,
    alignItems: 'center'
},

counselorHeader: {
    width: '85%',
    height: 'auto',
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    paddingVertical: 10
},

counselorRowList: {
    width: '100%',
    flexDirection: 'row',
},

smallViewCounselor: {
    flexDirection: 'row',
    justifyContent: 'space-around',
},

textext: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 10,
},

})

export default Home
