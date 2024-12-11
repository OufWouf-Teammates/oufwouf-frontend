import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import AppLoading from "expo-app-loading";

export default function InterestPoint({ navigation, route }) {
  const { localisation, nom } = route.params;
  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Icônes de patte
  const paw = [];
  for (let i = 0; i < 5; i++) {
    paw.push(<FontAwesome key={i} name="paw" size={20} color="#0639DB" />);
  }

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}lieu/${localisation}/${nom}`);
        const data = await response.json();
        
        if (data.result && data.data) {
          setPlaceData(data.data);
        } else {
          console.error('No data found or invalid response');
        }
      } catch (error) {
        console.error('Error fetching place data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceData();
  }, [localisation, nom]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0639DB" />
      </SafeAreaView>
    );
  }

  if (!placeData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Unable to load the place data.</Text>
      </SafeAreaView>
    );
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
          source={{
            uri: placeData.photos ? placeData.photos[0].photo_reference : require('../assets/dog_example.webp')
          }}
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
            <Text style={styles.title}>{placeData.name}</Text>

            {/* Ouverture */}
            <View style={styles.openContainer}>
              <Text style={styles.open}>{placeData.opening_hours ? 'OUVERT' : 'FERMÉ'}</Text>
              <FontAwesome name="bookmark" size={35} color="#EAD32A" />
            </View>
          </View>

          {/* Note */}
          <View style={styles.noteAverage}>
            {paw}
            <Text style={styles.note}>{placeData.user_ratings_total} avis</Text>
          </View>

          {/* Profil infos */}
          <View style={styles.profilInfos}>
            <Text style={styles.adresse}>{placeData.formatted_address}</Text>

            {/* Téléphone */}
            {placeData.formatted_phone_number && (
              <View style={styles.row}>
                <FontAwesome name="phone" size={15} color="#EAD32A" />
                <Text style={styles.phone}>{placeData.formatted_phone_number}</Text>
              </View>
            )}

            {/* Horaires */}
            {placeData.opening_hours && (
              <View style={styles.row}>
                <FontAwesome name="clock-o" size={15} color="#EAD32A" />
                <Text style={styles.text}>Horaires d'ouverture</Text>
              </View>
            )}
            <Text style={styles.hours}>
              {placeData.opening_hours
                ? `Aujourd'hui : ${placeData.opening_hours.weekday_text[0]}`
                : 'Heures non disponibles'}
            </Text>

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
    top: 40,
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
    justifyContent: 'space-between',
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
    fontSize: 22,
  },
});
