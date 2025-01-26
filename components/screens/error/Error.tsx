import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native'

const Error = ({ navigation }: any) => {

    useEffect(() => {
        navigation.setOptions({ 
            title:  "ادعية الصباح" , 
            headerTitleStyle:{
                color: '#740074',
                fontFamily: 'Amiri',
                fontSize: 24,
                fontWeight: '200',
            },
            headerTintColor: '#740074',
            headerLeft: () => (
              <TouchableOpacity onPress={ () => navigation.goBack() } >
                <Image style={styles.icon} source={require('../../../assets/back.png')} />
              </TouchableOpacity>
            )
         });
      },[])

  return (
    <View style={ styles.container }>
        <Image style={ styles.img } source={require('../../../assets/error.png')} />
        <Text style={ styles.text }>Please check your network and try again</Text>
        <Pressable onPress={ () => navigation.navigate('Home') } style={ styles.button }>
          <Text style={styles.btnText}>back Home</Text>
        </Pressable> 
    </View>
  )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff'
    },
    img: {
        height: 350,
        width: 350
    }, 
    icon: {
      width: 30,
      height: 30,
      resizeMode: 'stretch'
    },
    text: {
        fontFamily: 'Amiri',
        fontSize: 18,
        color: "#740074"
    }, 
    button: {
        marginVertical: 20,
        width: 150,
        backgroundColor: '#740074',
        borderRadius: 50,
        marginHorizontal: 5,
    },
    btnText: {
        color: "white",
        fontFamily: 'Amiri',
        fontSize: 18,
        textAlign: 'center'
    }
  })

export default Error