import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../firebase';

export default function Schedule() {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(
        new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Reset selectedDate to the current date when the page is focused
            setSelectedDate(
                new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().split('T')[0]
            );
        });

        return unsubscribe;
    }, [navigation]);

    const [currentUser, setCurrentUser] = useState(null);
    const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
    const [schedules, setSchedules] = useState([]);

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

    // Fetch schedules from Firebase in real-time
    useEffect(() => {
        const unsubscribe = db.collection('schedule').onSnapshot(snapshot => {
            const scheduleData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                start: new Date(doc.data().start),
                end: new Date(doc.data().end),
                username: doc.data().username,
                counselor: doc.data().counselor
            }));
            setSchedules(scheduleData);
        });

        return () => unsubscribe();
    }, []);

    const markedDates = schedules.reduce((acc, schedule) => {
        const { start, end } = schedule;
        const date = start.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = { marked: true, schedules: [{ startTime: start, endTime: end }] };
        } else {
            acc[date].schedules.push({ startTime: start, endTime: end });
        }
        return acc;
    }, {});

    
    const renderSchedules = () => {
        if (markedDates[selectedDate] && markedDates[selectedDate].schedules) {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                        {markedDates[selectedDate].schedules.map((schedule, index) => (
                            <View style={styles.schedIcon} key={`${selectedDate}_${index}`}>
                                <View style={styles.icon}>
                                    <Text>Y</Text>
                                </View>
                                <View style={styles.scheduleContainer}>
                                    <Text>Guidance Counseling</Text>
                                    <Text style={styles.scheduleText}>
                                        Start Time: {formatTime(schedule.startTime)}
                                    </Text>
                                    <Text style={styles.scheduleText}>
                                        End Time: {formatTime(schedule.endTime)}
                                    </Text>
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
    
    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Manila' };
        return time.toLocaleTimeString('en-US', options);
    };
    

    return (
        <View style={styles.container}>
            <Calendar
                style={styles.calendarDes}
                current={new Date().toISOString().split('T')[0]} // Fixed current date format
                onDayPress={day => {
                    setSelectedDate(day.dateString);
                    console.log('selected day', day);
                }}
                markedDates={{ ...markedDates, [selectedDate]: { selected: true, selectedColor: '#BA5255' } }}
                renderMarking={renderMarking}
            />

            {renderSchedules()}

            <View style={styles.addSchedule}>
                <TouchableOpacity style={styles.icontainer}>
                    <FontAwesome name="calendar-plus-o" size={24} color="#BA5255" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const renderMarking = (markedDates) => {
    const dots = [];
    Object.keys(markedDates).forEach((date) => {
        const { schedules } = markedDates[date];
        if (schedules) {
            schedules.forEach((schedule, index) => {
                dots.push(
                    <View key={`${date}_${index}`} style={styles.dotContainer}>
                        <Text style={styles.dotText}>{schedule.startTime.toLocaleTimeString()} - {schedule.endTime.toLocaleTimeString()}</Text>
                    </View>
                );
            });
        }
    });

    return dots;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },

    calendarDes: {
        borderWidth: 1,
        borderColor: 'pink',
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
        width: '75%'
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    icon: {
        backgroundColor: 'red',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        width: '10%',
        aspectRatio: 1,
        marginRight: 15
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
});
