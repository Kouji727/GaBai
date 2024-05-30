import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image, TextInput, Button, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'; // Add this line

const Schedule = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalNotifVisible, setModalNotifVisible] = useState(false);
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState('');
    const [reason, setReason] = useState('');
    const [isTimePickerVisible, setTimePickerVisibility] = useState(null);
    const [selectedTime, setSelectedTime] = useState(new Date(null));
    const [isTimeSelected, setIsTimeSelected] = useState(false);
    const [oneHour, setOnehour] = useState(new Date(null));
    const eventId = uuidv4(); // Change this line
    const [legendModal, setLegendModal] = useState(false);

    const [tVisible, setTVisible] = useState(false);

    const getDisabledWeekends = () => {
        const disabledDates = {};
    
        for (let year = 1970; year <= 2100; year++) { // Adjust the range of years as needed
            for (let month = 0; month < 12; month++) {
                const getLastDayOfMonth = (year, month) => {
                    return new Date(year, month + 1, 0).getDate();
                };
    
                const daysInMonth = getLastDayOfMonth(year, month);
    
                for (let day = 1; day <= daysInMonth; day++) {
                    const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const date = new Date(dateString);
                    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
                    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
                        disabledDates[dateString] = { disableTouchEvent: true, disableAllTouchEventsForDisabledDays: true, marked: false, dotColor: 'gray', selected: true, selectedColor: "#E5E5E5"};
                    }
                }
            }
        }
    
        return disabledDates;
    };
    
    

    const addSchedule = async () => {
        const startTime = selectedDate + 'T' + selectedTime.toLocaleTimeString() + '+08:00'
        const endTime =  selectedDate + 'T' + oneHour.toLocaleTimeString() + '+08:00'

        console.log(startTime);
      
        try {
          setModalVisible(false);
          await setDoc(doc(db, "schedule", eventId), {
            title: "Schedule",
            counselor: selectedCounselor,
            studentNum: currentUser.studentNumber,
            course: currentUser.course,
            start: startTime,
            end: endTime,
            allDay: false,
            reasonMessage: reason,
            username: currentUser.username, 
            state: "pending",
            timeStamp: serverTimestamp(),
            department: currentUser.department,
            read: false,
            year: currentUser.year
          });
          setReason('');
          setSelectedCounselor('');
          setIsTimeSelected(false);
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
        setIsTimeSelected(false);
    };

    const toggleModalNotif = () => {
        setModalNotifVisible(!modalNotifVisible);
    };

    const toggleTimePicker = () => {
        setTimePickerVisibility(!isTimePickerVisible);
        
    };

    const openingHour = 7; // 7:59 AM
    const openingMinute = 59;
    const closingHour = 16; // 4:00 PM
    const closingMinute = 0;
    
    const handleConfirmTime = (time) => {
        // Extract hours and minutes from the selected time
        const selectedHour = time.getHours();
        const selectedMinute = time.getMinutes();
    
        // Get current date and time
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
    
        // Check if the selected time is past the current time
        if (
            selectedHour < currentHour ||
            (selectedHour === currentHour && selectedMinute < currentMinute)
        ) {
            // Display error message if the selected time is past the current time
            alert("Cannot Schedule Past Time");
            return;
        }
    
        // Check if the selected time falls within the allowed range
        if (
            (selectedHour === openingHour && selectedMinute >= openingMinute) ||
            (selectedHour > openingHour && selectedHour < closingHour) ||
            (selectedHour === closingHour && selectedMinute <= closingMinute)
        ) {
            // Round time to the nearest 15 minutes
            const roundedTime = new Date(Math.round(time.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
        
            // Add one hour to the rounded time
            const roundedTimePlusOneHour = new Date(roundedTime.getTime() + (60 * 60 * 1000));
        
            setSelectedTime(roundedTime);
            setOnehour(roundedTimePlusOneHour);
            setIsTimeSelected(true);
            toggleTimePicker();
            setTVisible(true);
        } else {
            // Display error message if the selected time is outside the allowed range
            alert("Cannot schedule outside 8:00 AM to 4:00 PM");
        }
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
                    message: message || "",
                    counselor: counselor
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
                    message: message,
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
        const { start, end, username, name, state, message, counselor } = item;
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
                acc[date] = { marked: true, items: [{ startTime: startDate, endTime: endDate, username, name, state, message, counselor }] };
            } else {
                acc[date].items.push({ startTime: startDate, endTime: endDate, username, name, state, message, counselor });
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

                                        {item.counselor &&(
                                            <Text>Counselor Assigned: {item.counselor}</Text>

                                        )}


                                        {item.state && currentUser.username === item.username &&(
                                            <Text>State: {item.state === 'reject' ? 'Rescheduled' : item.state}</Text>
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
{/* nvskfvndfkjd */}
                                    {selectedCounselor !== '' && isTimeSelected &&(

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

            <Modal
                transparent={true}
                visible={legendModal}
                animationType="slide"
                onRequestClose={() => { }}>
                <View style={styles.modalContainer}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{backgroundColor: '#f5eded', width: "90%", borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 25}}>

                            <View style={{justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1, width: "100%", marginVertical: 10, borderBottomColor: '#BA5255', width: "80%"}}>
                                <View style={{width: '20%', aspectRatio: 1, backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: '50%', aspectRatio: 1, backgroundColor: '#BA5255', borderRadius: 100}}/>
                                </View>
                                <Text style={{marginBottom: 20, marginTop: 5}}>
                                    Has Approved Schedule
                                </Text>
                            </View>

                            <View style={{justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1, width: "100%", marginVertical: 10, borderBottomColor: '#BA5255', width: "80%"}}>
                                <View style={{width: '20%', aspectRatio: 1, backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: '50%', aspectRatio: 1, backgroundColor: '#eacccd', borderRadius: 100}}/>
                                </View>
                                <Text style={{marginBottom: 20, marginTop: 5}}>
                                    Has Scheduled, Not Approved
                                </Text>
                            </View>

                            <View style={{justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1, width: "100%", marginVertical: 10, borderBottomColor: '#BA5255', width: "80%"}}>
                                <View style={{width: '20%', aspectRatio: 1, backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: '20%', aspectRatio: 1, backgroundColor: '#00bfec', borderRadius: 100}}/>
                                </View>
                                <Text style={{marginBottom: 20, marginTop: 5}}>
                                    Has an Event / Other Student's Schedule
                                </Text>
                            </View>

                            <View style={{justifyContent: 'space-around', alignItems: 'center', width: "100%", marginVertical: 10, width: "80%"}}>
                                <View style={{width: '20%', aspectRatio: 1, backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: '50%', aspectRatio: 1, backgroundColor: '#E5E5E5', borderRadius: 100}}/>
                                </View>
                                <Text style={{ marginTop: 5}}>
                                    Disabled Date
                                </Text>
                            </View>

                        </View>

                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}>

                        <View style={{justifyContent: 'center', alignItems: 'center', width: "90%", marginTop: 20}}>
                            <TouchableOpacity style={{backgroundColor: '#f5eded', padding: 15, borderRadius: 100}} onPress={() => {setLegendModal(!legendModal)}}>
                                <Ionicons name="arrow-down" size={24} color="#BA5255" />
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

            </Modal>

            <Calendar
    style={styles.calendarDes}
    current={new Date(new Date().getTime() + (8 * 60 * 60 * 1000)).toISOString().split('T')[0]}
    onDayPress={day => {
        setSelectedDate(day.dateString);
    }}
    markedDates={{
        ...userDates,
        [selectedDate]: { selected: true, selectedColor: '#BA5255' },
        ...userDatesArray.reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: 'white', selected: true, selectedColor: '#eacccd' };
            return acc;
        }, {}),
        ...Object.keys(userDates).reduce((acc, date) => {
            if (userDates[date].items.some(item => item.state === 'approved' && currentUser?.username === item.username)) {
                acc[date] = { selected: true, selectedColor: '#BA5255', dotColor: 'white', marked: true };
            }
            return acc;
        }, {}),
        ...getDisabledWeekends(), // Add disabled Saturdays and Sundays dynamically
    }}
/>
            {renderSchedules()}

                {currentUser?.username === 'll' &&(
                    <TouchableOpacity style={styles.notif}  onPress={toggleModalNotif}>
                        <View style={styles.notifCount}>
                            <Text style={{fontSize: 10, fontWeight: 'bold', color: 'white'}}>1</Text>
                        </View>

                        <TouchableOpacity style={styles.notifcont}>
                            <FontAwesome name="bell-o" size={24} color="#BA5255" />
                        </TouchableOpacity>

                </TouchableOpacity>)}

                <View style={styles.addSchedule}>
                    {selectedDate >= new Date().toISOString().split('T')[0] && ( // Check if selectedDate is equal to or ahead of the current date
                        <TouchableOpacity style={styles.icontainer} onPress={toggleModal}>
                            <FontAwesome name="calendar-plus-o" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={{position: 'absolute', padding: 10, bottom: "40%", right: 0}} onPress={() => {setLegendModal(!legendModal)}}>
                    <View style={{backgroundColor: '#BA5255', padding: 10, borderRadius: 100}}>
                        <Ionicons name="information-circle-outline" size={24} color="white" />
                    </View>
                </TouchableOpacity>


        </View>
    );
}

export default Schedule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        backgroundColor: '#BA5255',
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


