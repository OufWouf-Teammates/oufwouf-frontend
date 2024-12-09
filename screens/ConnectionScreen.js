import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import AppLoading from 'expo-app-loading';

import { useDispatch } from 'react-redux';
import { connectUser } from '../reducers/user';

import GoogleSignInButton from '../components/GoogleSignInButton';
import AppleSignInButton from '../components/appleConnect';
import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function ConnexionScreen({ navigation }) {

  const dispatch = useDispatch();
  //Nécessaire pour la configuration des fonts 
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const connectToAccount = (objConn) => {


  console.log(`${NEXT_PUBLIC_BACKEND_URL}users/signin`);
    
    fetch(`${NEXT_PUBLIC_BACKEND_URL}users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: objConn.email, password: objConn.password }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.result) {
      dispatch(connectUser({ email: data.email, token: data.token }));
      navigation.navigate('Map');
    }else{
      alert(data.error);
    }
    })
  .catch(error => console.error(error));



    console.log(objConn);
  }

  return (
    <ImageBackground
      source={require('../assets/BG_App.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Image style={styles.image} source={require('../assets/logo_oufwouf_couleur.png')} />
        <Text style={styles.title}>Pour woufer la vie à pleins crocs !</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign In', {connectToAccount})} style={styles.buttonSignIn} activeOpacity={0.8}>
          <Text style={styles.textButtonSignIn}>Se connecter</Text>
          <FontAwesome name='arrow-right' size={25} color='#F5F5F5'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Sign Up', {connectToAccount})} style={styles.buttonSignUp} activeOpacity={0.8}>
          <Text style={styles.textButtonSignUp}>S'inscrire</Text>
          <FontAwesome name='arrow-right' size={25} color='#0639DB'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Dog Profile')} style={styles.buttonSignUp} activeOpacity={0.8}>
          <Text style={styles.textButtonSignUp}>Dog Profile</Text>
          <FontAwesome name='arrow-right' size={25} color='#0639DB'/>
        </TouchableOpacity>
      <GoogleSignInButton connectToAccount={connectToAccount}/>
        <AppleSignInButton connectToAccount={connectToAccount} />
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
    marginTop:20,
    marginBottom:20,
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
  },
});