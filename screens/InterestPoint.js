import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import AppLoading from "expo-app-loading"
export default function InterestPoint({ navigation }) {

    //Nécessaire pour la configuration des fonts
    const [fontsLoaded] = useFonts({
      Lexend_400Regular,
      Lexend_700Bold,
    })
    if (!fontsLoaded) {
      return <AppLoading />
    }

  // Icônes de patte
  const paw = [];
  for (let i = 0; i < 5; i++) {
    paw.push(<FontAwesome key={i} name="paw" size={20} color="#0639DB" />);
  }

  return (
    <ImageBackground
    source={require("../assets/BG_App.png")}
    style={styles.container}
    >
    <View style={styles.container}>
      {/* Image du profil */}
      <View>
        <Image
          source={require('../assets/dog_example.webp')}
          style={styles.profilPic}
        />
        <FontAwesome
          name="arrow-left"
          size={25}
          color="#0639DB"
          style={styles.iconBack}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Informations */}
      <View style={styles.infoContainer}>
        {/* Titre */}
        <View style={styles.infoTitre}>
          <Text style={styles.title}>Docteur La Peluche</Text>

          {/* Ouverture */}
          <View style={styles.openContainer}>
            <Text style={styles.open}>OUVERT</Text>
            <FontAwesome name="bookmark" size={35} color="#EAD32A" />
          </View>
        </View>
        {/* Note */}
        <View style={styles.noteAverage}>
          {paw}
          <Text style={styles.note}>133 avis</Text>
        </View>

        {/* Profil infos */}
        <View style={styles.profilInfos}>
          <Text style={styles.adresse}>1 Rue Sophie Germain, 75014 Paris</Text>

          {/* Téléphone */}
          <View style={styles.row}>
            <FontAwesome name="phone" size={15} color="#EAD32A" />
            <Text style={styles.phone}>06 12 15 23 69</Text>
          </View>

          {/* Horaires */}
          <View style={styles.row}>
            <FontAwesome name="clock-o" size={15} color="#EAD32A" />
            <Text style={styles.text}>Horaires d'ouverture</Text>
          </View>
          <Text style={styles.hours}>Aujourd'hui : 8h30 - 20h30</Text>

          {/* Bouton */}
          <TouchableOpacity
            style={styles.reserve}
            onPress={() => console.log('Rendez-vous pris!')}
          >
            <Text style={styles.reserveText}>Prendre rendez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profilPic: {
    width: '100%',
    height: 300,
    marginBottom: 10,

  },
  iconBack: {
    padding: 20,
    position: 'absolute',
    top: 40
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0639DB',
  },
  openContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoTitre: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  open: {
    fontSize: 18,
    color: '#0639DB',
    fontWeight: 'bold',
    borderRadius: 5,
    borderColor: '#0639DB',
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  noteAverage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  note: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0639DB',
  },
  profilInfos: {
    marginTop: 10,
  },
  adresse: {
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  phone: {
    marginLeft: 10,
    fontSize: 20,
    color: '#4D4D4D',
  },
  text: {
    marginLeft: 10,
    fontSize: 20,
  },
  hours: {
    fontSize: 14,
    color: '#4D4D4D',
    marginBottom: 10,
  },
  reserve: {
    backgroundColor: '#0639DB',
    width: '70%',
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
    alignItems: 'center',
    alignSelf: 'center',
  },
  reserveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22
  },
});
