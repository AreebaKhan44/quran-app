import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useQuery } from 'react-query';
import { Audio } from 'expo-av';
import Loading from '../../loading/Loading';
import Error from '../error/Error';

const Surah = ({ route, navigation }: any) => {
  const { index, nameAr } = route.params;

  // Fetch surah details using react-query
  const { data, isFetching, error } = useQuery(['surahDetails', index], async () => {
    const response = await axios.get(
      `https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah/surah_${index}.json`
    );
    return response?.data;
  });

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Fetch translations in English
  const fetchTranslations = async () => {
    try {
      const response = await axios.get(
        `https://raw.githubusercontent.com/semarketir/quranjson/master/source/translations/en/en_translation_${index}.json`
      );
      setTranslations(response.data);
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch translations.');
    }
  };

  // Audio playback controls
  const playAudio = async () => {
    try {
      if (!data?.audio) {
        Alert.alert('Error', 'Audio source not found.');
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: data.audio },
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);
    } catch (err) {
      Alert.alert('Error', 'Unable to play audio.');
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    fetchTranslations(); 
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    navigation.setOptions({
      title: `سورة ${nameAr}`,
      headerTitleStyle: {
        color: '#740074',
        fontFamily: 'Amiri',
        fontSize: 24,
        fontWeight: '200',
      },
      headerTintColor: '#ea8ff2',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Quran')}
        >
          <Image style={styles.icon} source={require('../../../assets/back.png')} />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (isFetching) return <Loading size={70} />;
  if (error) return <Error />;

  const ayahs = Object.entries(data?.verse || {});

  return (
    <View style={styles.container}>
      <ScrollView style={styles.surah}>
        <View style={styles.spacer}></View>
        {ayahs.map(([key, ayah]: [string, string]) => (
          <View key={key} style={styles.ayahContainer}>
            {/* Arabic Ayah */}
            <Text style={styles.arabicText}>{ayah} {'\u06DD'}</Text>
            {/* Translation */}
            <Text style={styles.translationText}>
              {translations[key] || 'Translation not available'}
            </Text>
          </View>
        ))}
        <View style={styles.spacer}></View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={isPlaying ? pauseAudio : playAudio}
        >
          <Text style={styles.audioButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{data?.name}</Text>
        <View style={styles.count}>
          <Text>{data?.count}</Text>
        </View>
        <Text style={styles.text}>{nameAr}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  surah: {
    backgroundColor: '#740074',
    width: '100%',
    height: '85%',
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  arabicText: {
    fontWeight: '600',
    textAlign: 'right',
    color: '#ffffff',
    fontFamily: 'Amiri',
    lineHeight: 50,
    fontSize: 20,
  },
  translationText: {
    textAlign: 'left',
    color: '#ffffff',
    fontFamily: 'Amiri',
    lineHeight: 25,
    fontSize: 16,
    fontStyle: 'italic',
  },
  count: {
    color: '#ea8ff2',
    backgroundColor: '#ffffff',
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 15,
  },
  bottomBar: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ea8ff2',
    flexDirection: 'row',
    marginTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
  },
  audioButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  audioButtonText: {
    color: '#740074',
    fontWeight: '600',
  },
  spacer: {
    height: 30,
  },
  ayahContainer: {
    marginBottom: 20,
  },
  headerBtn: {
    marginRight: 20,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'stretch',
  },
});

export default Surah;







