import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground } from 'react-native';

import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function SignUpScreen () {
    return (
        <ImageBackground
            source={require('../assets/logo_oufwouf_couleur.png')}
            style={styles.container}
        >
          <SafeAreaView style={styles.innerContainer}>
            {/* Contenu de votre écran */}
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
    });