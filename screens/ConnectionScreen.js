import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function ConnexionScreen () {
  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundImage: URL('/BG_App.png'),
    backgroundPosition: 'center', 
    backgroundSize: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
});