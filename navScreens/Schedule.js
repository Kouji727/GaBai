import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image, TextInput, Button, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Schedule() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalNotifVisible, setModalNotifVisible] = useState(false);
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState('');
    const [reason, setReason] = useState();
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date(null));
    const [oneHour, setOnehour] = useState(new Date(null));

    const [tVisible, setTVisible] = useState(false);

    const addSchedule = async () => {

        const startTime = selectedDate + 'T' + selectedTime.toLocaleTimeString() + '+08:00'
        const endTime =  selectedDate + 'T' + oneHour.toLocaleTimeString() + '+08:00'

        try {
            setModalVisible(false);
            await db.collection('schedule').add({
                allDay: false,
                counselor: selectedCounselor,
                course: currentUser.course,
                department: currentUser.department,
                end: endTime,
                read: false,
                reasonMessage: reason,
                start: startTime,
                state: 'pending',
                studentNum: currentUser.studentNumber,
                timestamp: new Date(),
                title: 'Schedule',
                username: currentUser.username,
            });
            setReason('');
            setSelectedCounselor('');

        } catch (error) {
            console.error('Error adding schedule:', error);
        }

    };
    

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const snapshot = await db.collection('users').where('role', '==', 'admin').get();
                const counselorsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCounselors(counselorsList);
            } catch (error) {
                console.error('Error fetching counselors:', error);
            }
        };

        fetchCounselors();
    }, []);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setTVisible(false);
    };

    const toggleModalNotif = () => {
        setModalNotifVisible(!modalNotifVisible);
    };

    const toggleTimePicker = () => {
        setTimePickerVisibility(!isTimePickerVisible);
    };

    const handleConfirmTime = (time) => {
        // Round time to the nearest 15 minutes
        const roundedTime = new Date(Math.round(time.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
    
        // Add one hour to the rounded time
        const roundedTimePlusOneHour = new Date(roundedTime.getTime() + (60 * 60 * 1000));
    
        setSelectedTime(roundedTime);
        setOnehour(roundedTimePlusOneHour);
        toggleTimePicker();
        setTVisible(true);
    };
    

    const [selectedDate, setSelectedDate] = useState(
        new Date(new Date().getTime() + (8 * 60 * 60 * 1000)).toISOString().split('T')[0]
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Reset selectedDate to the current date when the page is focused
            setSelectedDate(
                new Date(new Date().getTime() + (8 * 60 * 60 * 1000)).toISOString().split('T')[0]
            );
        });

        return unsubscribe;
    }, [navigation]);

    const [currentUser, setCurrentUser] = useState(null);
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);

    // Set current user by targeting UID in the users collection
    useEffect(() => {
        const fetchUserData = async () => {
            const userDoc = await db.collection('users').doc(auth.currentUser?.uid).get();
            if (userDoc.exists) {
                setCurrentUser(userDoc.data());
            }
        };

        fetchUserData();

        const unsubscribe = db.collection('users').doc(auth.currentUser?.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setCurrentUser(doc.data());
                }
            });

        return () => unsubscribe();
    }, []);

    // Fetch username profile pic
    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                if (currentUser && currentUser.username) {
                    const username = currentUser.username;
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
    }, [currentUser?.username]);

    // Fetch schedules and events from Firebase in real-time
    useEffect(() => {
        const unsubscribeSchedules = db.collection('schedule').onSnapshot(snapshot => {
            const scheduleData = snapshot.docs.map(doc => {
                const { start, end, username, counselor, state, message } = doc.data();
                const startDate = new Date(start);
                const endDate = new Date(end);
                return {
                    id: doc.id,
                    start: startDate,
                    end: endDate,
                    username: username || "No username",
                    counselor: counselor || "No counselor",
                    state: state || "No state",
                    message: message || ""
                };
            });
            setSchedules(scheduleData);
        });

        const unsubscribeEvents = db.collection('events').onSnapshot(snapshot => {
            const eventData = snapshot.docs.map(doc => {
                const { start, end, name, description, state, message } = doc.data();
                const startDate = new Date(start);
                const endDate = new Date(end);
                return {
                    id: doc.id,
                    start: startDate,
                    end: endDate,
                    name: name || "No event name",
                    description: description || "No description",
                    state: state,
                    message: message
                };
            });
            setEvents(eventData);
        });

        return () => {
            unsubscribeSchedules();
            unsubscribeEvents();
        };
    }, []);

    const combinedData = [...schedules, ...events];

    const userDates = combinedData.reduce((acc, item) => {
        const { start, end, username, name, state, message } = item;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const localStartDate = new Date(startDate.getTime() + (8 * 60 * 60 * 1000)).toISOString().split('T')[0];
        const localEndDate = new Date(endDate.getTime() + (8 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
        const dates = [];
        let current = new Date(localStartDate);
        while (current <= new Date(localEndDate)) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }

        dates.forEach(date => {
            if (!acc[date]) {
                acc[date] = { marked: true, items: [{ startTime: startDate, endTime: endDate, username, name, state, message }] };
            } else {
                acc[date].items.push({ startTime: startDate, endTime: endDate, username, name, state, message });
            }
        });

        return acc;
    }, {});

    const userDatesArray = Object.keys(userDates).filter(date => {
        return userDates[date].items.some(item => item.username === currentUser?.username);
    });

    const formatTime = (time) => {
        if (time instanceof Date) {
            const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Manila' };
            const adjustedTime = new Date(time.getTime());
            return adjustedTime.toLocaleTimeString('en-US', options);
        }
        return '';
    };

    const formatDate = (date) => {
        if (date instanceof Date) {
            const options = { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' };
            const adjustedDate = new Date(date.getTime());
            return adjustedDate.toLocaleDateString('en-US', options);
        }
        return '';
    };

    const renderSchedules = () => {
        if (!combinedData.length) {
            return <Text style={styles.noScheduleText}>Loading...</Text>;
        }

        if (userDates[selectedDate] && userDates[selectedDate].items) {
            const day = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
            const sortedItems = userDates[selectedDate].items.sort((a, b) => a.startTime - b.startTime);

            const mergedItems = sortedItems.map(item => {
                const firestoreItem = combinedData.find(i => {
                    return (
                        i.start.getTime() === item.startTime.getTime() &&
                        i.end.getTime() === item.endTime.getTime()
                    );
                });

                const endDay = new Date(item.endTime).toLocaleDateString('en-US', { weekday: 'long' });

                return {
                    ...item,
                    username: firestoreItem ? firestoreItem.username : item.username,
                    name: firestoreItem ? firestoreItem.name : item.name,
                    start: firestoreItem ? firestoreItem.start.toISOString() : "No date",
                    end: firestoreItem ? firestoreItem.end.toISOString() : "No date",
                    endDay: endDay,
                };
            });

            return (
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }}>
                        {mergedItems.map((item, index) => (
                            <View
                                style={[
                                    styles.schedIcon,
                                    item.username === currentUser.username ? styles.currentUserItem : null,
                                ]}
                                key={`${selectedDate}_${index}`}
                            >
                                <View style={styles.scheduleContainer}>
                                    <View style={styles.icon}>
                                        {currentUser.username === item.username ? (
                                            <Image
                                                style={styles.pfp}
                                                resizeMode='cover'
                                                source={firebaseImageUrl ? { uri: firebaseImageUrl } : require('../assets/defaultPfp.jpg')}
                                                onError={(error) => console.error('Image loading error:', error)}
                                            />
                                        ) : (
                                            <Image
                                                style={styles.pfp}
                                                resizeMode='cover'
                                                source={require('../assets/defaultPfp.jpg')}
                                                onError={(error) => console.error('Image loading error:', error)}
                                            />
                                        )}
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text>{item.name ? item.name : "Guidance Counseling"}</Text>
                                        <Text style={styles.scheduleText}>
                                            Time: {day} {formatTime(item.startTime)} -
                                            {new Date(item.startTime).toLocaleDateString() !== new Date(item.endTime).toLocaleDateString() ?
                                                ' ' + item.endDay : ''} {''}
                                            {formatTime(item.endTime)}
                                        </Text>
                                        {item.state &&(
                                            <Text>State: {item.state}</Text>
                                        )}
                                        {item && item.message && currentUser.username === item.username &&(
                                            <Text>Counselor Message: {item.message}</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            );
        } else {
            return <Text style={styles.noScheduleText}>No schedule for this date</Text>;
        }
    };

    return (
        <View style={styles.container}>
            {/* //MODALLL */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <ScrollView contentContainerStyle={{flexGrow: 1}}>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: '#e8dada', width: '90%', borderRadius: 20, paddingBottom: 35, paddingTop: 10 }}>
                            <View style={{ alignItems: 'center', padding: 20 }}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#BA5255' }}>Add Schedule</Text>
                            </View>
                            <View style={{ paddingHorizontal: 20 }}>
                                <Text style={styles.textModal}>Name: {currentUser?.username}</Text>
                                <Text style={styles.textModal}>Department: {currentUser?.department}</Text>
                                <Text style={styles.textModal}>Course: {currentUser?.course}</Text>
                                <Text style={styles.textModal}>Student Number: {currentUser?.studentNumber}</Text>
                                <Text style={styles.textModal}>Year: {currentUser?.year}</Text>
                                <Text style={styles.textModal}>Date: {selectedDate}</Text>
                                <TouchableOpacity onPress={toggleTimePicker}>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <FontAwesome name="clock-o" size={24} color="black" />
                                        <Text>
                                            Select Time
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {tVisible &&(
                                    <Text style={styles.textModal}>Time: {selectedTime.toLocaleTimeString()} - {oneHour.toLocaleTimeString()}</Text>

                                )}

                                <DateTimePickerModal
                                    isVisible={isTimePickerVisible}
                                    mode="time"
                                    onConfirm={handleConfirmTime}
                                    onCancel={toggleTimePicker}
                                />

                                <Text style={styles.textModal}>Reason for Guidance Counseling:</Text>
                                <TextInput placeholder='Reason for Guidance Counseling' style={{ backgroundColor: '#c4b3b3', height: 50, padding: 10, borderRadius: 5, marginBottom: 10 }} onChangeText={setReason}/>
                                <Text style={styles.textModal}>Counselor: {selectedCounselor}</Text>
                                <Picker
                                    selectedValue={selectedCounselor}
                                    onValueChange={(itemValue) => setSelectedCounselor(itemValue)}
                                    style={{ height: 50, width: '100%', backgroundColor: '#c4b3b3', borderRadius: 5, marginBottom: 35 }}
                                >
                                    <Picker.Item label="Select a Counselor" value="" />
                                    {counselors.map(counselor => (
                                        <Picker.Item key={counselor.id} label={counselor.username} value={counselor.username} />
                                    ))}
                                </Picker>
                                
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                                    {selectedCounselor !== '' &&(

                                        <TouchableOpacity style={styles.buttonModal} onPress={addSchedule}>
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                                Schedule
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity style={styles.buttonModal} onPress={toggleModal}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

            <Modal
                transparent={false}
                visible={false}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >


            </Modal>
            <Calendar
                style={styles.calendarDes}
                current={new Date(new Date().getTime() + (8 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                onDayPress={day => {
                    setSelectedDate(day.dateString);
                    console.log('selected day', day);
                }}
                markedDates={{
                    ...userDates,
                    [selectedDate]: { selected: true, selectedColor: '#BA5255' },
                    ...userDatesArray.reduce((acc, date) => {
                        acc[date] = { marked: true, dotColor: 'white', selected: true, selectedColor: '#d49698' };
                        return acc;
                    }, {}),
                    ...Object.keys(userDates).reduce((acc, date) => {
                        if (userDates[date].items.some(item => item.state === 'approved' && currentUser?.username === item.username)) {
                            acc[date] = { selected: true, selectedColor: '#BA5255', dotColor: 'white', marked: true };
                        }
                        return acc;
                    }, {})
                }}
            />
            {renderSchedules()}
                {currentUser?.username === 'Jecho Torrefranca' &&(
                    <TouchableOpacity style={styles.notif}  onPress={toggleModalNotif}>
                        <View style={styles.notifCount}>
                            <Text style={{fontSize: 10, fontWeight: 'bold', color: 'white'}}>1</Text>
                        </View>

                        <TouchableOpacity style={styles.notifcont}>
                            <FontAwesome name="bell-o" size={24} color="#BA5255" />
                        </TouchableOpacity>

                </TouchableOpacity>)}

            <View style={styles.addSchedule}>
                <TouchableOpacity style={styles.icontainer} onPress={toggleModal}>
                    <FontAwesome name="calendar-plus-o" size={24} color="#BA5255"  />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },

    defaultPfp: {
        width: 45,
        height: 45
    },

    calendarDes: {
        borderWidth: 1,
        borderColor: '#BA5255',
        height: 325,
    },

    dotContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
    },

    dotText: {
        fontSize: 10,
        color: 'blue',
    },

    scheduleContainer: {
        backgroundColor: '#e8dada',
        padding: 10,
        borderRadius: 10,
        width: '90%',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center'
    },

    scheduleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    noScheduleText: {
        marginTop: 20,
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    schedIcon: {
        marginTop: 10,
        alignItems: 'center',
    },

    icon: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        width: 45,
        aspectRatio: 1,
        marginRight: 15,
        overflow: 'hidden',
        backgroundColor: 'yellow'
    },

    pfp: {
        width: 45,
        height: 45,
        borderRadius: 100,
    },

    addSchedule: {
        alignItems: 'center',
        marginBottom: 10,
    },

    icontainer: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        aspectRatio: 1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
    },

    notif: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '10%',
        borderRadius: 100,
        aspectRatio: 1,
        bottom: 335,
        right: 0,
        backgroundColor: 'white',
        marginRight: 10

    },

    notifcont: {
        // justifyContent: 'center',
        // alignItems: 'center',
        
    },

    notifCount: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        borderRadius: 100,
        aspectRatio: 1,
        bottom: -5,
        right: 15,
        backgroundColor: 'red',
        marginRight: 10,
        zIndex: 100
    },


    textModal: {
        padding: 5
    },

    buttonModal: {
        flex: 1,
        margin: 5,
        backgroundColor: '#BA5255',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    }
});


