import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export default function Apps() {
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [plantPositions, setPlantPositions] = useState([]);
    const [user, setUser] = useState(null);
    const selectedPlantRef = useRef(null); // useRef to store the selected plant type

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                fetchPlantData(user.uid);

                // Listen for real-time updates to plant data
                const unsubscribe = db.collection('gameDB').doc(user.uid)
                    .onSnapshot((doc) => {
                        if (doc.exists) {
                            const data = doc.data();
                            setPlantPositions(data.plantPositions || []);
                        }
                    });
                
                // Clean up the listener when the component unmounts
                return () => unsubscribe();
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

    const startTimer = (time) => {
        setRemainingTime(time);
        setIsTimerVisible(false);
        setIsCountingDown(true);
        if (time > 0) {
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

    const handleTimerButtonPress = (time, plantType) => {
        selectedPlantRef.current = plantType;
        startTimer(time);
    };

    const updatePlantData = () => {
        const selectedPlant = selectedPlantRef.current; // Get the selected plant type from useRef
        if (selectedPlant) {
            const newPosition = generateRandomPosition();
            setPlantPositions(prevPositions => {
                const updatedPositions = [...prevPositions, { ...newPosition, type: selectedPlant }];
                savePlantData(user.uid, updatedPositions);
                return updatedPositions;
            });
        }
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

    const generateRandomPosition = () => {
        const maxWidth = 330; // Maximum x value
        const maxHeight = 250; // Maximum y value
        const minDistance = 50; // Minimum distance between plants
        const maxAttempts = 100; // Maximum attempts to find a non-overlapping position
    
        let newPosition = null;
        let isOverlapping = false;
        let attempts = 0;
    
        do {
            newPosition = {
                x: Math.floor(Math.random() * maxWidth),
                y: Math.floor(Math.random() * maxHeight),
            };
    
            // Check if the new position overlaps with existing plant positions
            isOverlapping = plantPositions.some(position => {
                const distanceX = Math.abs(position.x - newPosition.x);
                const distanceY = Math.abs(position.y - newPosition.y);
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
                return distance < minDistance;
            });
    
            // Ensure the new position is within the specified boundaries
            if (newPosition.x < 0 || newPosition.x > maxWidth || newPosition.y < 0 || newPosition.y > maxHeight) {
                isOverlapping = true;
            }
    
            attempts++;
    
            // Break the loop if maximum attempts reached
            if (attempts >= maxAttempts) {
                break;
            }
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
                        source={position.type === 'sprout' ? require('../assets/plantIcon.png') : require('../assets/flower.png')}
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



            <TouchableOpacity 
                style={{flexDirection: 'row', marginBottom: 15}} 
                onPress={() => {
                    startTimer(1); 
                    selectedPlantRef.current = 'sprout'; // Set the selected plant type
                }}
            >
                <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccffcc', borderRadius: 10, padding: 5}}>

                    <View style={{justifyContent: 'center', alignItems: 'center', width: "50%", aspectRatio: 1, overflow: 'hidden', backgroundColor: '#99ff99', padding: 10, borderRadius: 100}}>
                        <Image source={require('../assets/plantIcon.png')} style={{resizeMode: 'contain', width: "100%", height: '100%'}}/>

                    </View>

                    <Text style={{fontSize: 15, fontWeight: "bold", color: "#BA5255"}}>Sprout | 1 second</Text>

                    
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{flexDirection: 'row', marginBottom: 15}} 
                onPress={() => {
                    startTimer(1); 
                    selectedPlantRef.current = 'flower'; // Set the selected plant type
                }}
            >

                <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe6e6', borderRadius: 10, padding: 5}}>

                    <View style={{justifyContent: 'center', alignItems: 'center', width: "50%", aspectRatio: 1, overflow: 'hidden', backgroundColor: 'pink', padding: 10, borderRadius: 100}}>
                        <Image source={require('../assets/flower.png')} style={{resizeMode: 'contain', width: "100%", height: '100%'}}/>

                    </View>
                    <Text style={{fontSize: 15, fontWeight: "bold", color: "#BA5255"}}>Flower | 1 second</Text>

                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{flexDirection: 'row', marginBottom: 15}} 
                onPress={() => {
                    startTimer(15 * 60); 
                    selectedPlantRef.current = 'sprout'; // Set the selected plant type
                }}
            >
                <View style={{alignItems: 'center', justifyContent: 'center',backgroundColor: '#ccffcc', borderRadius: 10, padding: 5}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', width: "50%", aspectRatio: 1, overflow: 'hidden', backgroundColor: '#99ff99', padding: 10, borderRadius: 100}}>
                        <Image source={require('../assets/plantIcon.png')} style={{resizeMode: 'contain', width: "100%", height: '100%'}}/>

                    </View>
                    <Text style={{fontSize: 15, fontWeight: "bold", color: "#BA5255"}}>Sprout | 15 minutes</Text>

                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{flexDirection: 'row', marginBottom: 15}} 
                onPress={() => {
                    startTimer(30 * 60); 
                    selectedPlantRef.current = 'flower'; // Set the selected plant type
                }}
            >

                <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe6e6', borderRadius: 10, padding: 5}}>

                    <View style={{justifyContent: 'center', alignItems: 'center', width: "50%", aspectRatio: 1, overflow: 'hidden', backgroundColor: 'pink', padding: 10, borderRadius: 100}}>
                        <Image source={require('../assets/flower.png')} style={{resizeMode: 'contain', width: "100%", height: '100%'}}/>

                    </View>

                    <Text style={{fontSize: 15, fontWeight: "bold", color: "#BA5255"}}>Flower | 30 minutes</Text>
                                    
                </View>
            </TouchableOpacity>

                </View>
            )}

            {remainingTime > 0 && (
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>{remainingTime}</Text>
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
        top: '10%',
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
