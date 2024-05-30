import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import CounselorCont from '../components/counselorCont';
import CounselorIcons from '../components/counselorIcons';
import { Ionicons } from '@expo/vector-icons';
import { db, streamCounselor } from '../firebase';
import Logo from '../assets/yabag.png';
import LearnMore from '../components/LearnMore';
import GAbout from '../components/GAbout';

const Home = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [modalVisibleLearn, setModalVisibleLearn] = useState(false);
    const [modalVisibleAbout, setModalVisibleAbout] = useState(false);
    const [loading, setLoading] = useState(true);
    const [counselors, setCounselor] = useState([]);


    const toggleModal = (item) => {
        setModalVisible(!modalVisible);
        setSelectedCounselor(item);
    };

    const toggleModalLearn = () => {
        setModalVisibleLearn(!modalVisibleLearn);
    };

    const toggleModalAbout = () => {
        setModalVisibleAbout(!modalVisibleAbout);
    };

    const mapDocToPost = (document) => {
        return {
            id: document.id,
            username: document.data().username,
            info1: document.data().info1,
            info2: document.data().info2,
            info3: document.data().info3,
            img: document.data().img,
            link: document.data().link
        }
    }
    
    const [content, setContent] = useState(null); // Add state for content data

    useEffect(() => {
        const unsubscribe = streamCounselor({
            next: querySnapshot => {
                const counselors = querySnapshot.docs
                    .filter(docSnapshot => docSnapshot.data().role === "admin") // Filter only counselors
                    .map(docSnapshot => mapDocToPost(docSnapshot));
                setCounselor(counselors);
                setLoading(false);
            },
            error: (error) => {
                console.log(error);
                setLoading(false);
            }
        });

        //regular
        const fetchContent = async () => {
            try {
                const doc = await db.collection('content').doc('infotab').get();
                if (doc.exists) {
                    setContent(doc.data());
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchContent();

    }, []);

    //realtime
    useEffect(() => {
        const unsubscribe = db.collection('content').doc('infotab').onSnapshot(doc => {
            if (doc.exists) {
                setContent(doc.data());
            }
        }, error => {
            console.log(error);
        });

        return () => unsubscribe();
    }, []);

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
                            <Ionicons name="arrow-down" size={24} color="#BA5255" />
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* //learn more */}
            <Modal
                transparent={true}
                visible={modalVisibleLearn}
                animationType="slide"
                onRequestClose={() => setModalVisibleLearn(false)}>
                <View style={styles.modalContainer}>
                    <LearnMore item={content}/>
                    <TouchableOpacity style={styles.modalRemoveButton} onPress={() => setModalVisibleLearn(false)}>
                        <View>
                            <Ionicons name="arrow-down" size={24} color="#BA5255" />
                        </View>
                    </TouchableOpacity>
                </View>

            </Modal>
                {/* //about */}
                <Modal
                transparent={true}
                visible={modalVisibleAbout}
                animationType="slide"
                onRequestClose={() => setModalVisibleAbout(false)}>
                <View style={styles.modalContainer}>
                    <GAbout item={content}/>
                    <TouchableOpacity style={styles.modalRemoveButton} onPress={() => setModalVisibleAbout(false)}>
                        <View>
                            <Ionicons name="arrow-down" size={24} color="#BA5255" />
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>


            <View style={styles.conCont}>

                <TouchableOpacity style={styles.tempCon} onPress={toggleModalLearn}>
                    <Image source={Logo} style={styles.logo} resizeMode="contain" />
                    <Text style={{color: '#BA5255', fontSize: 20, fontWeight: 'bold'}}>Ga-Bai</Text>
                    <Text style={{color: '#BA5255', fontSize: 15, fontWeight: 'bold'}}>Learn More</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tempCon} onPress={toggleModalAbout}>
                    <View style={{width: 100, height: 100, borderRadius: 100, elevation: 3,  overflow: 'hidden', marginBottom: 15}}>
                        <Image source={require('../assets/guidance.jpg')} style={{width: 100, height: 100, elevation: 3}} resizeMode='contain' />

                    </View>
                    <Text style={{color: '#BA5255', fontSize: 20, fontWeight: 'bold'}}>About Our Guidance</Text>
                    <Text style={{color: '#BA5255', fontSize: 15, fontWeight: 'bold'}}>Learn More</Text>
                </TouchableOpacity>

                <View style={styles.counselorHeader}>
                    <Text style={styles.textext}>Our Counselors</Text>

                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={styles.scrolly}
                    >
                        <View style={styles.counselorRowList}>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#8a344c" />
                                </View>
                            ) : (
                                <>
                                    {counselors.map(counselor => (
                                        <CounselorIcons
                                            key={counselor.id}
                                            img={counselor.img}
                                            onPress={() => toggleModal(counselor)}
                                        />
                                    ))}
                                </>
                            )}
                        </View>
                    </ScrollView>

                    <Text style={{ fontWeight: 'bold', color: '#BA5255', paddingVertical: 10 }}>
                        Click for more info!
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    scrolly: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalRemoveButton: {
        width: '15%',
        aspectRatio: 1,
        backgroundColor: '#F3E8EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
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
        alignItems: 'center',
        borderRadius: 10,

    },

    counselorHeader: {
        width: '85%',
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        paddingVertical: 10,
        padding: 10,
        alignItems: 'center'
    },

    counselorRowList: {
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
        color: '#BA5255'
    },

    logo: {
        height: 100,
        marginBottom: 0,
    },

    modalLogo: {
        height: 100,
        marginBottom: 20,
    },
    

})

export default Home
