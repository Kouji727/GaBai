import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Modal } from 'react-native';
import { db, streamPosts, firebase } from '../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CreateMessage from '../components/createMessage';
import ContentItem from '../components/contentItem';
import CounselorPostDesign from '../components/counselorPostDesign';
import CounselorPostDesign2 from '../components/counselorPostDesign2';
import UserPostDesign from '../components/userPostDesign';
import EditPost from '../components/editPost';

import { useNavigation } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import CreatePost from '../documents/CreatePost';

export default function Community() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState();
  const [questions, setQuestions] = useState();
  const [dropddown, setdropddown] = useState(false);
  const [featuredClose, setFeaturedClose] = useState(true);

  const toggleFeatured = () => {
    setFeaturedClose(!featuredClose);
  }

  const toggleDropdown = () => {
    setdropddown(!dropddown);
  }

const streamPosts = (observer) => {
    db.collection('threads').onSnapshot(observer)
}

const streamPostsQuestions = (observer) => {
  db.collection('questions').onSnapshot(observer)
}

  const mapDocToPost = (document) => {
    const createdAt = document.data().createdAt.toDate();
    const formattedDate = createdAt.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });

    const content = document.data().content;
    const sanitizedContent = sanitizeContent(content);

    return {
      id: document.id,
      username: document.data().username,
      content: sanitizedContent,
      createdAt: document.data().createdAt.toDate().toISOString(),
      formattedDate: formattedDate, // Add formattedDate here
      like: document.data().like,
      comment: document.data().comment,
      trueusername: document.data().trueusername,
    };
  };

  const inappropriateWords = [
    'tanga', 'gago', 'gaga', 'putangina', 'tarantado', 'puke', 'pepe', 'pokpok', 'shit', 'bullshit',
    'fuck', 'fck', 'whore', 'puta', 'tangina', 'syet', 'tite', 'kupal', 'kantot', 'hindot', 'nigga', 'motherfucker', 'kinginamo', 'taenamo',
    'asshole', 'kike', 'cum', 'pussy'];

  const sanitizeContent = (content) => {
    let sanitizedContent = content;
    inappropriateWords.forEach(word => {
      const regex = new RegExp('\\b' + word + '\\b', 'gi');
      sanitizedContent = sanitizedContent.replace(regex, '*'.repeat(word.length));
    });
    return sanitizedContent;
  };

  useEffect(() => {
    const unsubscribe = streamPosts({
      next: querySnapshot => {
        const threads = querySnapshot.docs.map(docSnapshot => mapDocToPost(docSnapshot));
        // Sort threads by createdAt date
        threads.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (isNaN(dateA) || isNaN(dateB)) {
            return 0;
          }
          return dateB - dateA;
        });
        setThreads(threads);
        setLoading(false);
      },
      error: (error) => {
        console.log(error);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = streamPostsQuestions({
      next: querySnapshot => {
        const questions = querySnapshot.docs.map(docSnapshot => mapDocToPost(docSnapshot));
        // Sort threads by createdAt date
        questions.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (isNaN(dateA) || isNaN(dateB)) {
            return 0;
          }
          return dateB - dateA;
        });
        setQuestions(questions);
        setLoading(false);
      },
      error: (error) => {
        console.log(error);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <MenuProvider skipInstanceCheck>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>

        <View>

          <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#BA5255', flexDirection: 'row'}}>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white'}}>Featured Question</Text>

            <TouchableOpacity style={{backgroundColor: 'white', padding: 5, borderRadius: 100, alignItems:'center', justifyContent: 'center', width: '10%', aspectRatio: 1, marginLeft: 10}} onPress={toggleFeatured}>
              <FontAwesome name={!featuredClose ? "chevron-down" : "chevron-up"} size={15} color="#BA5255"/>

            </TouchableOpacity>
          </View>

          {/* sdjkdf */}

          {featuredClose &&(
            <View>
              <View style={styles.content}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8a344c" />
                  </View>
                ) : (
                  <>
                    {!dropddown ? (
                      questions?.slice(0, 1).map(question => (
                        <CounselorPostDesign2 key={question.id} item={{ ...question, createdAt: question.formattedDate }} />
                      ))
                    ) : (
                      questions?.map(question => (
                        <CounselorPostDesign2 key={question.id} item={{ ...question, createdAt: question.formattedDate }} />
                      ))
                    )}
                  </>
                )}

              </View >

              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#BA5255', padding: 10, borderRadius: 10, paddingHorizontal: 15}} onPress={toggleDropdown}>

                  <Text style={{marginRight: 10, fontWeight: 'bold', color: 'white', fontSize: 10}}>
                    {dropddown ? "Hide" : "See More"}
                  </Text>
                  <FontAwesome name={dropddown ? "eye-slash" : "eye"} size={14} color="white" />
                  
                </TouchableOpacity>

              </View>


            </View>

          )}



        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#BA5255', marginTop: 10}}>
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white'}}>Messages</Text>
        </View>


        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8a344c" />
            </View>
          ) : (
            <>
              {threads?.map(thread => <CounselorPostDesign key={thread.id} item={{ ...thread, createdAt: thread.formattedDate }} />)}
            </>

          )}
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <CreatePost cancel={toggleModal} closeAfter={() => setModalVisible(false)} />
          </View>
        </Modal>

        <View style={{paddingBottom: 50}}>

        </View>

      </ScrollView>

        <TouchableOpacity style={styles.floatingButtonContainer} onPress={toggleModal}>
        <View onPress={toggleModal}>
          <View style={styles.floatingButton}>
            <MaterialCommunityIcons name="comment-plus-outline" size={24} color="white" />
          </View>
        </View>
      </TouchableOpacity>


    </MenuProvider>


  )

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5eded'
  },

  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#BA5255',
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    paddingTop: -20,
  },

  list: {
    flex: 1,
    marginTop: 20,
  },

  fSpace: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink'
  },

  fSpaceText: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    borderRadius: 90,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})