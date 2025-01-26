import { View, Text, StyleSheet, Image } from 'react-native'

const Header = () => {
  return (
    <View style={ styles.wrapper }>
      <Text style={ styles.text }>Quran Pro </Text>
      <Image style={ styles.icon } source={require('../../../../assets/icon.png')} />
    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 30,
        backgroundColor: '#740074',
        height: 40,
        borderRadius: 5,
        width: "100%",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 50
    },
    text: {
        color: '#fff',
        fontWeight: 'bold'
    }
})

export default Header