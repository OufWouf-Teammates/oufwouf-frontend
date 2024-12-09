import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import AppLoading from 'expo-app-loading';


import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function ConnexionScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require('../assets/BG_App.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Image style={styles.image} source={require('../assets/logo_oufwouf_couleur.png')} />
        <Text style={styles.title}>Pour woufer la vie à pleins crocs !</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign In')} style={styles.buttonSignIn} activeOpacity={0.8}>
          <Text style={styles.textButtonSignIn}>Se connecter</Text>
          <FontAwesome name='arrow-right' size={25} color='#F5F5F5'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')} style={styles.buttonSignUp} activeOpacity={0.8}>
          <Text style={styles.textButtonSignUp}>S'inscrire</Text>
          <FontAwesome name='arrow-right' size={25} color='#0639DB'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Dog Info Form')} style={styles.buttonSignUp} activeOpacity={0.8}>
          <Text style={styles.textButtonSignUp}>Dog Info Form</Text>
          <FontAwesome name='arrow-right' size={25} color='#0639DB'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Dog Profile')} style={styles.buttonSignUp} activeOpacity={0.8}>
          <Text style={styles.textButtonSignUp}>Dog Profile</Text>
          <FontAwesome name='arrow-right' size={25} color='#0639DB'/>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '30%', 
  },
  title: {
    width: '80%',
    fontSize: 24, 
    textAlign: 'center',
    fontFamily: 'Lexend_700Bold',
  },
  buttonSignIn: {
    backgroundColor: '#EAD32A',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
  },
  buttonSignUp: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
  },
  textButtonSignIn: {
    color: '#F5F5F5',
    fontSize: 16,
    width: '70%',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    fontFamily: 'Lexend_400Regular',
  }, 
  textButtonSignUp: {
    color: '#0639DB',
    fontSize: 16,
    width: '70%',
    borderBottomWidth: 1,
    borderBottomColor: '#0639DB',
    fontFamily: 'Lexend_400Regular',
  }
});