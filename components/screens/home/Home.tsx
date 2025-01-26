import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useRootStore } from '../../../model/root';
import { observer } from 'mobx-react-lite';
import { AZKARSALAT } from '../../../assets/AzkarSalat';
import RandomZekr from './randomZekr/RandomZekr';
import {  StatusBar } from 'expo-status-bar';
import Header from "./header/Header";


const Home = observer(({ navigation }: any) => {
  
  const root = useRootStore();

  const onChange = (value: number) => {
    root.setFontSize(Math.floor(value))
  }

  return (
    <View style={ styles.container }>
      <StatusBar style="dark" />
      <Header />
      <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center", minHeight: "90%" }}>     
        <Text style={ styles.heading }>بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ</Text>
        <Text style={{ color: "#740074" }}>what would you like to see?</Text>
        <View style={ styles.butons }>
          <Pressable onPress={ () => navigation.navigate('Quran') } style={ styles.button }>
            <Text style={styles.text}>القرآن الکریم</Text>
          </Pressable>
          <Pressable onPress={ () => navigation.navigate('Dua') } style={ styles.button }>
            <Text style={styles.text}>دعاء</Text>
          </Pressable>   
        </View>
        <Pressable onPress={ () => navigation.navigate('Azkar') } style={ styles.button }>
          <Text style={styles.text}>أذكار و أدعية بدون أنترنت</Text>
        </Pressable>

        <Pressable onPress={ () => navigation.navigate('Reciters') } style={ styles.button }>
          <Text style={styles.text}>Reciters</Text>
        </Pressable>


       

        <View style={{ alignItems: "center"  }}>
          <Text style={{ fontWeight: "bold", color: "#740074" }}>Change font size</Text>
          <View style={{ flexDirection: 'row', alignItems: "center", width: "70%" }}>
              <Slider 
                style={{width: "90%", height: 40}}
                minimumValue={12}
                maximumValue={30}
                value={ root.fontSize }
                thumbTintColor="#740074"
                minimumTrackTintColor="#740074"
                maximumTrackTintColor="#000000"
                onValueChange={ onChange }
            />
            <Text>{ root.fontSize }</Text>
          </View>
          <RandomZekr zekr={ AZKARSALAT[Math.floor(Math.random() * (72 - 0 + 1) + 0)] } />
        </View>
      </ScrollView>
    </View>
    
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: "center",
    backgroundColor: '#ffffff'
  },
  heading: {
    fontSize: 30,
    fontFamily: 'Amiri',
    fontWeight: '600',
    color: '#740074'
  },
  button: {
    marginVertical: 20,
    minWidth: 150,
    backgroundColor: '#740074',
    borderRadius: 5,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Amiri',
    textAlign: 'center'
  },
  butons: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  header: {
    backgroundColor: "#740074",
  }
})

export default Home