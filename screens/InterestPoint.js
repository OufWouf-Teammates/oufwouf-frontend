import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function InterestPoint({ navigation }) {
  // Icônes de patte
  const paw = [];
  for (let i = 0; i < 5; i++) {
    paw.push(<FontAwesome key={i} name="paw" size={25} color="#ec6e5b" />);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Image du profil */}
      <View>
        <FontAwesome
          name="arrow"
          size={25}
          color="#ec6e5b"
        />
        <Image
          source={{
            uri: 'https://images.app.goo.gl/kTi6B8MgeRTUv3oRA',
          }}
          style={styles.profilPic}
        />
      </View>

      {/* Informations */}
      <View style={styles.infoContainer}>
        {/* Titre */}
        <Text style={styles.title}>Docteur La Peluche</Text>

        {/* Ouverture */}
        <View style={styles.openContainer}>
          <Text style={styles.open}>OUVERT</Text>
          <FontAwesome name="bookmark" size={25} color="#ec6e5b" />
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
            <FontAwesome name="phone" size={15} color="#ec6e5b" />
            <Text style={styles.phone}>06 12 15 23 69</Text>
          </View>

          {/* Horaires */}
          <View style={styles.row}>
            <FontAwesome name="clock-o" size={15} color="#ec6e5b" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  profilPic: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0639DB',
  },
  openContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  open: {
    fontSize: 18,
    color: '#0639DB',
    fontWeight: 'bold',
    borderRadius: 5,
    borderColor: '#0639DB',
    borderWidth: 1,
    paddingHorizontal: 5,
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
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  phone: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4D4D4D',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
  hours: {
    fontSize: 14,
    color: '#4D4D4D',
    marginBottom: 10,
  },
  reserve: {
    backgroundColor: '#ec6e5b',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  reserveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
