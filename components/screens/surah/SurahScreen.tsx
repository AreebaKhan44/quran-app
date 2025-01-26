

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useQuery } from 'react-query';
import Loading from '../../loading/Loading';
import Error from '../error/Error';

const SurahScreen = ({ route, navigation }: any) => {
  const { index, nameAr } = route.params;

  const { data, isFetching, error } = useQuery(['surahDetails', index], async () => {
    const response = await axios.get(
      `https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah/surah_${index}.json`
    );
    return response.data;
  });

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

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
    navigation.setOptions({
      title: `سورة ${nameAr}`,
    });
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  if (isFetching) return <Loading size={70} />;
  if (error) return <Error />;

  const ayahs = Object.entries(data?.verse || {});

  return (
    <View style={styles.container}>
      <ScrollView style={styles.surah}>
        {ayahs.map(([key, ayah]: [string, string]) => (
          <View key={key} style={styles.ayahContainer}>
            <Text style={styles.arabicText}>{ayah}</Text>
            <Text style={styles.translationText}>
              {translations[key] || 'Translation not available'}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={isPlaying ? pauseAudio : playAudio}
        >
          <Text style={styles.audioButtonText}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  surah: {
    marginBottom: 10,
  },
  ayahContainer: {
    marginVertical: 10,
  },
  arabicText: {
    textAlign: 'right',
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  translationText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#555',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  audioButton: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SurahScreen;
