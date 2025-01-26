// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import axios from 'axios';
// import { Audio } from 'expo-av';

// type Reciter = {
//   id: number;
//   name: string;
//   style: string;
//   audio_url: string; // Audio URL for recitations
// };

// type Verse = {
//   id: number;
//   text: string;
//   translation: string; // English translation
// };

// const Reciters = () => {
//   const [reciters, setReciters] = useState<Reciter[]>([]);
//   const [verses, setVerses] = useState<Verse[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<boolean>(false);
//   const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
//   const [sound, setSound] = useState<Audio.Sound | null>(null);

//   // Fetch reciters from API
//   const fetchReciters = async () => {
//     try {
//       setLoading(true);
//       setError(false);

//       const response = await axios.get('https://api.quran.com/api/v4/resources/recitations', {
//         timeout: 10000,
//       });

//       setReciters(response.data.recitations || []);
//     } catch (err: any) {
//       console.error('Error fetching reciters:', err.toJSON());
//       Alert.alert(
//         'Error',
//         `Failed to fetch reciters. ${err.response?.data?.message || err.message}`
//       );
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch verses for a selected reciter
//   const fetchVerses = async (reciterId: number) => {
//     try {
//       setLoading(true);
//       setError(false);

//       const response = await axios.get(`https://api.quran.com/api/v4/quran/verses/recitation/${reciterId}?language=en`);
//       setVerses(response.data.verses || []);
//     } catch (err: any) {
//       console.error('Error fetching verses:', err.toJSON());
//       Alert.alert(
//         'Error',
//         `Failed to fetch verses. ${err.response?.data?.message || err.message}`
//       );
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Play audio recitation
//   const playAudio = async (audioUrl: string) => {
//     try {
//       if (sound) {
//         await sound.unloadAsync();
//       }
//       const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
//       setSound(newSound);
//       await newSound.playAsync();
//     } catch (err) {
//       console.error('Error playing audio:', err);
//       Alert.alert('Error', 'Failed to play the audio.');
//     }
//   };

//   useEffect(() => {
//     fetchReciters();

//     return () => {
//       if (sound) {
//         sound.unloadAsync();
//       }
//     };
//   }, []);

//   const renderReciter = ({ item }: { item: Reciter }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => {
//         setSelectedReciter(item);
//         fetchVerses(item.id);
//       }}
//     >
//       <Text style={styles.name}>{item.name}</Text>
//       <Text style={styles.style}>Recitation Style: {item.style}</Text>
//     </TouchableOpacity>
//   );

//   const renderVerse = ({ item }: { item: Verse }) => (
//     <View style={styles.verseCard}>
//       <Text style={styles.arabic}>{item.text}</Text>
//       <Text style={styles.translation}>{item.translation}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#00b894" />
//       ) : error ? (
//         <Text style={styles.error}>Failed to load data. Please try again.</Text>
//       ) : selectedReciter ? (
//         <View>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => {
//               setSelectedReciter(null);
//               setVerses([]);
//             }}
//           >
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.selectedReciterName}>{selectedReciter.name}</Text>
//           <FlatList
//             data={verses}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderVerse}
//             ListEmptyComponent={<Text style={styles.empty}>No verses available for this reciter.</Text>}
//           />
//           <TouchableOpacity
//             style={styles.playButton}
//             onPress={() => playAudio(selectedReciter.audio_url)}
//           >
//             <Text style={styles.playText}>Play Recitation</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={reciters}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderReciter}
//           ListEmptyComponent={<Text style={styles.empty}>No reciters available.</Text>}
//         />
//       )}
//     </View>
//   );
// };

// export default Reciters;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2d3436',
//   },
//   style: {
//     fontSize: 14,
//     color: '#636e72',
//     marginTop: 4,
//   },
//   backButton: {
//     marginBottom: 12,
//     padding: 8,
//     backgroundColor: '#dfe6e9',
//     borderRadius: 8,
//   },
//   backText: {
//     fontSize: 14,
//     color: '#2d3436',
//     textAlign: 'center',
//   },
//   selectedReciterName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2d3436',
//     marginBottom: 12,
//   },
//   playButton: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: '#00b894',
//     borderRadius: 8,
//   },
//   playText: {
//     color: '#ffffff',
//     fontSize: 16,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   verseCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   arabic: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2d3436',
//   },
//   translation: {
//     fontSize: 14,
//     color: '#636e72',
//     marginTop: 8,
//   },
//   error: {
//     color: '#d63031',
//     textAlign: 'center',
//     fontSize: 16,
//     marginTop: 20,
//   },
//   empty: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#b2bec3',
//     marginTop: 20,
//   },
// });












import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, ScrollView, Picker } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

// Data structures
type Reciter = {
  id: number;
  name: string;
  style: string;
  country: string; // Country of reciter
  audio_url: string; // Local audio URL for recitations
};

type Verse = {
  id: number;
  text: string;
  translation: string; // English translation
};

type Language = {
  code: string;
  name: string;
};

const Reciters = () => {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [languages, setLanguages] = useState<Language[]>([
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    // Add more languages as required
  ]);

  // Fetch reciters by country (Example countries: Egypt, Iran, Saudi Arabia, Africa)
  const fetchReciters = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await axios.get('https://api.quran.com/api/v4/resources/recitations', {
        timeout: 10000,
      });

      const recitersData = response.data.recitations || [];

      // Classifying reciters by country
      const classifiedReciters = recitersData.reduce((acc: any, reciter: Reciter) => {
        const country = reciter.country || 'Others';
        if (!acc[country]) acc[country] = [];
        acc[country].push(reciter);
        return acc;
      }, {});

      setReciters(classifiedReciters);
    } catch (err: any) {
      console.error('Error fetching reciters:', err.toJSON());
      Alert.alert('Error', 'Failed to fetch reciters.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch verses for a selected reciter
  const fetchVerses = async (reciterId: number) => {
    try {
      setLoading(true);
      setError(false);

      const response = await axios.get(`https://api.quran.com/api/v4/quran/verses/recitation/${reciterId}?language=${selectedLanguage}`);
      setVerses(response.data.verses || []);
    } catch (err: any) {
      console.error('Error fetching verses:', err.toJSON());
      Alert.alert('Error', 'Failed to fetch verses.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Play audio recitation (local playback)
  const playAudio = async (audioUrl: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      await newSound.playAsync();
    } catch (err) {
      console.error('Error playing audio:', err);
      Alert.alert('Error', 'Failed to play the audio.');
    }
  };

  // Fetch translated subtitle using Google Translate API
  const translateText = async (text: string, targetLanguage: string) => {
    try {
      const response = await axios.post('https://translation.googleapis.com/language/translate/v2', {
        q: text,
        target: targetLanguage,
        key: '<Your Google Translate API Key>',
      });
      return response.data.data.translations[0].translatedText;
    } catch (err) {
      console.error('Error translating text:', err);
      return text; // Fallback to original text if translation fails
    }
  };

  useEffect(() => {
    fetchReciters();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [selectedLanguage]);

  const renderReciter = ({ item }: { item: Reciter }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedReciter(item);
        fetchVerses(item.id);
      }}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.style}>Recitation Style: {item.style}</Text>
      <Text style={styles.country}>Country: {item.country}</Text>
    </TouchableOpacity>
  );

  const renderVerse = ({ item }: { item: Verse }) => (
    <View style={styles.verseCard}>
      <Text style={styles.arabic}>{item.text}</Text>
      <Text style={styles.translation}>{item.translation}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00b894" />
      ) : error ? (
        <Text style={styles.error}>Failed to load data. Please try again.</Text>
      ) : selectedReciter ? (
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setSelectedReciter(null);
              setVerses([]);
            }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.selectedReciterName}>{selectedReciter.name}</Text>
          <FlatList
            data={verses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVerse}
            ListEmptyComponent={<Text style={styles.empty}>No verses available for this reciter.</Text>}
          />
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => playAudio(selectedReciter.audio_url)}
          >
            <Text style={styles.playText}>Play Recitation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          {Object.keys(reciters).map((country) => (
            <View key={country}>
              <Text style={styles.countryHeader}>{country}</Text>
              <FlatList
                data={reciters[country]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderReciter}
              />
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.languagePicker}>
        <Text>Select Subtitle Language:</Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          {languages.map((lang) => (
            <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default Reciters;

const styles = StyleSheet.create({
  // Add styles for new UI components
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  style: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 4,
  },
  country: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 4,
  },
  backButton: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#dfe6e9',
    borderRadius: 8,
  },
  backText: {
    fontSize: 14,
    color: '#2d3436',
    textAlign: 'center',
  },
  selectedReciterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
  },
  playButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#00b894',
    borderRadius: 8,
  },
  playText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  verseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  arabic: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  translation: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 8,
  },
  error: {
    color: '#d63031',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#b2bec3',
    marginTop: 20,
  },
  languagePicker: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
  },
  countryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginTop: 20,
    marginBottom: 8,
  },
});









