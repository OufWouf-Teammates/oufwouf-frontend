import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, Image} from 'react-native';

import {
    useFonts,
    Lexend_400Regular,
    Lexend_700Bold,
  } from '@expo-google-fonts/lexend';
  import AppLoading from 'expo-app-loading';

import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function SignInScreen () {
    //Nécessaire pour la configuration des fonts 
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
            <Text style={styles.title}>Se connecter</Text>
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
        fontFamily: 'Lexend_700Bold',
      },
    });