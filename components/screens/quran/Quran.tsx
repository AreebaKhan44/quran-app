import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from 'react-query';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Quran = ({ navigation }: any) => {
  const [playingSurah, setPlayingSurah] = useState(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const { data, isFetching, error } = useQuery('getAllSurah', async () => {
    const response = await axios.get(
      'https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah.json'
    );
    return response?.data;
  });

  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem('bookmarks');
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    } catch (e) {
      console.error('Error loading bookmarks:', e);
    }
  };

  const toggleBookmark = async (surahIndex: number) => {
    const updatedBookmarks = bookmarks.includes(surahIndex)
      ? bookmarks.filter((index) => index !== surahIndex)
      : [...bookmarks, surahIndex];

    setBookmarks(updatedBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const handlePlayPause = async (surahIndex: number) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }

    if (playingSurah === surahIndex) {
      setPlayingSurah(null);
    } else {
      setLoadingAudio(true);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahIndex}.mp3`,
        });
        setSound(newSound);
        setPlayingSurah(surahIndex);
        await newSound.playAsync();
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setLoadingAudio(false);
      }
    }
  };

  const fetchSurahDetails = async (index: number) => {
    navigation.push('Surah', { index });
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: 'القرآن الكريم',
      headerTitleStyle: {
        color: '#ea8ff2',
        fontFamily: 'Amiri',
        fontSize: 24,
      },
      headerTintColor: '#740074',
    });
    loadBookmarks();
  }, []);

  if (isFetching) return <ActivityIndicator size="large" color="#f1f1f1" />;
  if (error) return <Text>Error loading data</Text>;

  const list = data?.map((surah: any) => ({
    id: Number(surah.index),
    title: surah.titleAr,
    englishTitle: surah.title,
    index: Number(surah.index),
  }));

  const renderItem = ({ item }: any) => (
    <View style={styles.surahContainer}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => handlePlayPause(item.index)}
      >
        {loadingAudio && playingSurah === item.index ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {playingSurah === item.index ? 'Pause' : 'Play'}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => fetchSurahDetails(item.index)}
      >
        <Text style={styles.buttonText}>View Surah</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bookmarkButton}
        onPress={() => toggleBookmark(item.index)}
      >
        <Text style={styles.buttonText}>
          {bookmarks.includes(item.index) ? 'Unbookmark' : 'Bookmark'}
        </Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.englishTitle}</Text>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  surahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  playButton: {
    backgroundColor: '#ea8ff2',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  detailsButton: {
    backgroundColor: '#ea8ff2',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  bookmarkButton: {
    backgroundColor: '#ea8ff2',
    padding: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: '#141414',
    fontFamily: 'Amiri',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Quran;







