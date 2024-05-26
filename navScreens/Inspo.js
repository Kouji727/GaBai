import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import quotes from './quotes';
import { db, streamCounselor } from '../firebase';

export default function Inspo() {
  const [quote, setQuote] = useState('');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetching quote
    const currentDate = new Date();
    const dayOfYear = currentDate.getFullYear() * 1000 + currentDate.getDate();
    const randomIndex = dayOfYear % quotes.length;
    setQuote(quotes[randomIndex]);

    // Fetching images from Firebase Firestore
    const fetchImages = async () => {
      const imageUrls = [];
      const imagesRef = db.collection('images');
      const snapshot = await imagesRef.get();
      snapshot.forEach(doc => {
        imageUrls.push(doc.data().url);
      });
      setImages(imageUrls);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(index => (index + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images]);

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
            },
            error: (error) => {
                console.log(error);
            }
        });

        const fetchContent = async () => {
            try {
                const doc = await db.collection('content').doc('inspotab').get();
                if (doc.exists) {
                    setContent(doc.data());
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchContent();
        return unsubscribe;
    }, []);

  return (
<ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#e8dada' }}>
    <View style={styles.container}>
            <View style={styles.quoteContainer}>
                <Text style={styles.qotdText}>Quote of the Day</Text>
                    <View style={styles.quoteAndBut}>
                            <View style={styles.placeholder}>
                                <Text style={{ textAlign: 'center' }}>{quote}</Text>
                            </View>
                    </View>
            </View>

                <View style={styles.weCont}>



                <View style={styles.reCont}>
                    <Text style={styles.insideText}>Recent Events</Text>
                    <View style={{width: '90%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 13, textAlign: 'center'}}>
                            {content?.inspo3}
                        </Text>

                    </View>
                        <View style={styles.imageContainer}></View>
                                    <Image
                                    source={{ uri: images[currentImageIndex] }}
                                    style={styles.image}
                                    resizeMode="cover"
                                    />
                        </View>

                    </View>


            </View>
        

</ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    
  },
  qotdText: {
    fontSize: 25,
    color: '#BA5255',
    fontWeight: 'bold',
    padding: 10,
  },
  quoteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  weCont: {
    flex: 2,
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 100,
    borderStyle: 'dashed',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  quoteAndBut: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50
  },
  butGen: {
    alignItems: 'center',
    marginTop: 10,
    width: 100,
    padding: 10,
    backgroundColor: '#edd9df',
    borderRadius: 30,
  },
  wfaCont: {
    width: '85%',
    backgroundColor: 'white',
    marginTop: 15,
    alignItems: 'center',
    borderRadius: 15,
  },
  reCont: {
    width: '85%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 15,
    height: 450
  },
  insideText: {
    fontSize: 25,
    color: '#BA5255',
    fontWeight: 'bold',
    padding: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 0
  },
  image: {
    width: '90%',
    height: 225
  },
});
