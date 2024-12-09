import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, Image } from 'react-native';

import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function ConnexionScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('./BG_App.png')}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Image style={styles.image} source={require('../assets/logo_oufwouf_couleur.png')} />
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
  }
});