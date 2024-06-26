import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Button, TextInput, View, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { db, auth, firebase } from '../firebase';
import PostContent from '../components/postContent';
import { useProfilePicture } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { Fontisto } from '@expo/vector-icons';

const CreatePost = ({ cancel, closeAfter }) => {
  
  const navigation = useNavigation();
  
  const validationSchema = yup.object().shape({
    content: yup.string().required(),
  });
  const firebaseImageUrl = useProfilePicture();
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [department, setDepartment] = useState(null);
  const [course, setCourse] = useState(null);
  const [year, setYear] = useState(null);
  const [studentNum, setStudentNum] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false)

  const [role, setRole] = useState(null);
  
  useEffect(() => {
    if (currentUser) {
      const collection = currentUser?.role === 'admin' ? 'question' : 'threads';
      setRole(collection);
    }
  }, [currentUser]);
  


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
  
      const inappropriateWords = ['tanga', 'gago', 'gaga','putangina', 'tarantado','puke','pepe', 'pokpok', 'shit', 'bullshit',
      'fuck', 'fck' , 'whore', 'puta', 'tangina' ,'syet', 'tite', 'kupal', 'kantot', 'hindot', 'nigga', 'motherfucker', 'kinginamo', 'taenamo'
    , 'asshole', 'kike', 'cum', 'pussy']
  
    useEffect(() => {
      const fetchUserData = async () => {
        const userDoc = await db.collection('users').doc(auth.currentUser?.uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());

        }
      };

      fetchUserData();
  
      const unsubscribe = db.collection('users').doc(auth.currentUser?.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
            setDepartment(doc.data().department);
            setCourse(doc.data().course);
            setYear(doc.data().year);
            setStudentNum(doc.data().studentNumber);
          }
        });
  
      return () => unsubscribe();
    }, []);

    const uploadImagesToFirebase = async (selectedImage) => {
      try {
          const { uri } = await FileSystem.getInfoAsync(selectedImage);
          const blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = () => {
                  resolve(xhr.response);
              };
              xhr.onerror = (e) => {
                  reject(new TypeError('Network request failed'));
              };
              xhr.responseType = 'blob';
              xhr.open('GET', uri, true);
              xhr.send(null);
          });
  
          const filenameWithExtension = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
          const filename = filenameWithExtension.split('.').slice(0, -1).join('.'); // Remove extension
          const ref = firebase.storage().ref().child(filename);
  
          await ref.put(blob);
          const downloadUrl = await ref.getDownloadURL(); // Get the download URL of the uploaded image
  
          return downloadUrl; // Return the download URL
      } catch (error) {
          console.error(error);
          throw error;
      }
  };
  
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const takePic = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async (values) => {
      const postCollection = currentUser.role == 'admin' ? 'questions' : 'threads';

      try {
        let imageUrl = null;
        let isInappropriate = false; // Initialize isInappropriate to false
    
        if (selectedImage) {
          setLoading(true); // Start loading
          imageUrl = await uploadImagesToFirebase(selectedImage);
        }
    
        // Check if content contains inappropriate words
        const contentLower = values.content.toLowerCase();
        for (const word of inappropriateWords) {
          if (contentLower.includes(word)) {
            isInappropriate = true;
            Alert.alert('Inappropriate Content', 'Your post contains inappropriate text.');
            break;
          }
        }


    
        setLoading(true); // Start loading
    
// GET BACK HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
    
        db.collection(postCollection).add({
          username: isAnonymous ? "Anonymous" : userData?.username || 'Anonymous',
          trueusername: userData?.username || 'Anonymous', 
          content: values.content,
          createdAt: new Date(),
          like: 0,
          comment: 0,
          image: imageUrl ? { img: imageUrl } : null,
          department: department,
          course: course,
          year: year,
          studentNum: studentNum,
          isInappropriate: isInappropriate // Set isInappropriate based on the check
        }).then(result => {
          setLoading(false);
          closeAfter();
          console.log("Post created successfully");
        }).catch(err => console.log(err));
      } catch (error) {
        console.error("Error creating post: ", error);
      }
    };
    
    
  

    return (

        <ScrollView contentContainerStyle={styles.contentContainer}>

    <View style={styles.container}>
        <Formik
    initialValues={{ content: '' }}
    onSubmit={handleSubmit}
    validationSchema={validationSchema}
>
    {({
        values,
        handleChange,
        errors,
        handleSubmit
    }) => (
        <View style={styles.allCont}>
            <View style={styles.borderBottom}>
                <View style={{ margin: 5 }}>
                    <View style={styles.profileName}>
                        <View style={styles.topItems}>
                            <View style={styles.pfpCont}>
                                <View disabled={loading}>
                                    <Image
                                        style={styles.pfp}
                                        resizeMode='cover'
                                        source={firebaseImageUrl ? { uri: firebaseImageUrl } : require('../assets/defaultPfp.jpg')}
                                        onError={(error) => console.error('Image loading error:', error)}
                                    />
                                </View>
                            </View>
                            <Text style={styles.name}>{userData?.username}</Text>
                        </View>
                    </View>

                    <View style={styles.postTitle}>

                        <TextInput
                            style={{ fontWeight: 'bold', fontSize: 18, opacity: loading ? 0.5 : 1 }}
                            onChangeText={handleChange('content')}
                            placeholder={'Content'}
                            value={values.content}
                            autoFocus={true}
                            editable={!loading}
                            multiline={true}
                        />
                        {errors['content'] ? <Text style={styles.error}>{errors['content']}</Text> : null}

                    </View>

                    <View style={{ marginTop: 10 }}>
                        {selectedImage && !loading ? (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: selectedImage }} style={styles.image} />
                            </View>
                        ) : loading ? (
                            <ActivityIndicator size="large" color="#8a344c" />
                        ) : null}
                    </View>

                    <View style={styles.lowerButtonCont}>
                        <TouchableOpacity style={[styles.modalButton, loading && { opacity: 0 }]} onPress={takePic} disabled={loading}>
                            <Ionicons name="camera-outline" size={24} color="#8a344c" />
                            <Text style={{ color: '#8a344c', marginLeft: 7 }}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, loading && { opacity: 0 }]} onPress={pickImage} disabled={loading}>
                            <Ionicons name="image-outline" size={24} color="#8a344c" />
                            <Text style={{ color: '#8a344c', marginLeft: 7 }}>Add Image</Text>
                        </TouchableOpacity>

                    </View>

                    {!loading &&(
                      <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                        <View style={{flexDirection: 'row', padding: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#F3E8EB', elevation: 2, shadowColor: '#8a344c',}}>
                          <Text style={{marginRight: 10, color: '#8a344c'}}>
                            Post as Anonymous
                          </Text>

                          <TouchableOpacity onPress={() => {setIsAnonymous(!isAnonymous)}}>
                            <Fontisto name={isAnonymous ? "checkbox-active" : "checkbox-passive"} size={24} color="#8a344c" />
                          </TouchableOpacity>


                        </View>

                      </View>

                    )}



                </View>
            </View>
            <View style={styles.canAndSub}>

                
                <TouchableOpacity style={[styles.cancelButton, loading && { opacity: 0.5 }]} onPress={cancel} disabled={loading}>
                    <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <Text>Uploading...</Text>
                    ) : (
                        <Text>Create</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )}
</Formik>

    </View>
        </ScrollView>
    );
};

export default CreatePost;


const styles = StyleSheet.create({

    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    modalButton: {
        width: '30%',
        backgroundColor: '#F3E8EB',
        margin: 5,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginTop: 25,
        elevation: 2,
        shadowColor: '#8a344c',
        flexDirection: 'row'
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },  

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
    borderRadius: 15,
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
    marginRight: 5,
    fontWeight: 'bold',
    fontSize: 12
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
  },

  imageContainer: {
    elevation: 3,
    shadowColor: 'black',
    borderRadius: 15,
  },

  image: {
    width: '100%',
    height: 'auto',
    resizeMode: 'cover',
    aspectRatio: 1,
    borderRadius: 15,
  },

  error: {
    color: 'red',
    fontSize: 12,
  }

});

const menuStyles = {
  optionsContainer: {
    marginTop: -50,
    backgroundColor: '#F5F5F5',
    padding: 1,
    borderRadius: 10,
  },

  postPic: {
    marginTop: 10,
    
},

};
