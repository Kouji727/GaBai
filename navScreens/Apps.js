import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export default function Apps() {
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [minutes, setMinutes] = useState('');
    const [remainingTime, setRemainingTime] = useState(0);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [plantPositions, setPlantPositions] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                fetchPlantData(user.uid);
            } else {
                console.log("No user is signed in.");
            }
        });
        return unsubscribe;
    }, []);

    const fetchPlantData = async (uid) => {
        try {
            const doc = await db.collection('gameDB').doc(uid).get();
            if (doc.exists) {
                const data = doc.data();
                setPlantPositions(data.plantPositions || []);
            }
        } catch (error) {
            console.error("Error fetching plant data:", error);
        }
    };

    const startTimer = () => {
        const seconds = parseInt(minutes) * 60;
        setRemainingTime(seconds);
        setIsTimerVisible(false); 
        setIsCountingDown(true);
        if (seconds > 0) {
            const id = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(id);
                        setIsCountingDown(false);
                        updatePlantData();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            setIntervalId(id);
        }
    };

    const updatePlantData = () => {
        const newPosition = generateRandomPosition();
        setPlantPositions(prevPositions => {
            const updatedPositions = [...prevPositions, newPosition];
            savePlantData(user.uid, updatedPositions);
            return updatedPositions;
        });
    };

    const savePlantData = async (uid, plantPositions) => {
        try {
            await db.collection('gameDB').doc(uid).set(
                {
                    plantPositions,
                    plantCount: firebase.firestore.FieldValue.increment(1)
                },
                { merge: true }
            );
        } catch (error) {
            console.error("Error saving plant data:", error);
        }
    };

    const cancelTimer = () => {
        clearInterval(intervalId);
        setRemainingTime(0);
        setIsCountingDown(false);
        setIsTimerVisible(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const generateRandomPosition = () => {
        const maxWidth = 700; // Assuming the View width is 100% of the parent width
        const maxHeight = 330; // Assuming the View height is 330
        const minDistance = 10; // Minimum distance between plants
        
        let newPosition = null;
        let isOverlapping = false;
        do {
            newPosition = {
                x: Math.floor(Math.random() * (maxWidth - 75)), // 75 is the width of the plant icon
                y: Math.floor(Math.random() * (maxHeight - 75)), // 75 is the height of the plant icon
            };
            
            // Check if the new position overlaps with existing plant positions
            isOverlapping = plantPositions.some(position => {
                const distanceX = Math.abs(position.x - newPosition.x);
                const distanceY = Math.abs(position.y - newPosition.y);
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
                return distance < minDistance;
            });
        } while (isOverlapping);
        
        return newPosition;
    };

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <ImageBackground 
            source={require('../assets/appBg.jpg')} // Make sure to replace with your actual image path
            style={styles.backgroundImage}
        >
            <View style={{width: '100%', height: 330, marginTop: 290}} >
                {plantPositions.map((position, index) => (
                    <Image 
                        key={index}
                        source={require('../assets/plantIcon.png')}
                        style={{
                            width: 75,
                            height: 75,
                            resizeMode: 'contain',
                            position: 'absolute',
                            left: position.x,
                            top: position.y
                        }}
                    />
                ))}
            </View>

            <TouchableOpacity 
                style={styles.shovelButton}
                onPress={() => setIsTimerVisible(!isTimerVisible)}
                disabled={isCountingDown}
            >
                <Image source={require('../assets/shovel.png')} style={styles.shovelImage}/>
            </TouchableOpacity>

            {isTimerVisible && (
                <View style={styles.timerContainer}>
                    <TextInput 
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder='Enter minutes'
                        value={minutes}
                        onChangeText={setMinutes}
                    />
                    <TouchableOpacity style={styles.startButton} onPress={startTimer}>
                        <Text style={styles.startButtonText}>Start Timer</Text>
                    </TouchableOpacity>
                </View>
            )}

            {remainingTime > 0 && (
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>{formatTime(remainingTime)}</Text>
                    <TouchableOpacity style={styles.cancelButton} onPress={cancelTimer}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    },
    shovelButton: {
        width: 100,
        height: 100,
        backgroundColor: 'green',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 140,
        marginBottom: 10,
    },
    shovelImage: {
        width: 75,
        height: 75,
        resizeMode: 'contain',
        padding: 10,
    },
    timerContainer: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        marginBottom: 20,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: 'brown',
        padding: 10,
        borderRadius: 5,
    },
    startButtonText: {
        color: 'white',
        fontSize: 16,
    },
    countdownContainer: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countdownText: {
        color: 'white',
        fontSize: 24,
        marginBottom: 20,
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
