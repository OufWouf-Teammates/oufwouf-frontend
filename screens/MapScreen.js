import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text,TextInput,StatusBar,Image,Alert,Linking,Modal,Platform } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

  provider={PROVIDER_GOOGLE}

import MapView, { Marker, Circle,  PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import SearchBar from '../components/SearchBar';
import TabBar from '../components/TabBar';


import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window'); // Obtenir les dimensions de l'écran


import { useSelector } from 'react-redux';

export default function MapScreen({ navigation }) {

  const [location, setLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null); // Référence pour MapView
  const [redMarker, setRedMarker] = useState(null); // État pour le marker rouge
  const [modalVisible, setModalVisible] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);


  useEffect(() => {
    requestLocationPermission();
  },[]);


    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "La géolocalisation est nécessaire pour utiliser cette fonctionnalité. Veuillez l'activer dans les paramètres.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Ouvrir les paramètres",
            onPress: () => Linking.openSettings(), // Ouvre les paramètres avec Linking
          },
        ]
      );
      return false;
    }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }


  const centerOn = (objLatLng) => {
    if (mapRef) {
      mapRef.animateToRegion(
        {
          latitude: objLatLng.lat,
          longitude: objLatLng.lng,
          latitudeDelta: 0.005, // Réduire ces valeurs pour un zoom plus élevé
          longitudeDelta: 0.005,
        },
        1000 // Durée de l'animation en millisecondes
      );
    }
  }

  const createRedPoint = (arrLatLng) => {
    setRedMarker(arrLatLng); // Affiche le marker rouge

    // Masque le marker après 5 secondes
    setTimeout(() => {
      setRedMarker(null); // Supprime le marker rouge
    }, 5000);
}


  const gotToLatLng = (arrLatLng) => {
    centerOn(arrLatLng);
}

  const centerOnUser = () => {
    if (location && mapRef) {
      centerOn({lat: location.coords.latitude, lng: location.coords.longitude});
    }
  };


  if (!location) {
    return <View style={styles.container}><Text>Chargement...</Text></View>;
  }

  return (
    <SafeAreaProvider>
    <StatusBar
  hidden={false} 
  barStyle="light-content" 
  backgroundColor="transparent" 
/>
    <View style={styles.container}>
    <MapView
  style={styles.map}
  initialRegion={{
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.005, // Réduire ces valeurs pour un zoom plus élevé
    longitudeDelta: 0.005,
  }}
  rotateEnabled={false}
  showsPointsOfInterest={false}
  showsBuildings={false}
  showsTraffic={false}
  pitchEnabled={false}
  loadingEnabled={false}
  ref={(ref) => setMapRef(ref)} // Assurez-vous que setMapRef est appelé ici
>
  {/* Cercle indiquant la précision */}
{/*  <Circle
        center={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        radius={location.coords.accuracy} // Précision fournie par Expo Location
        strokeColor="rgba(0, 122, 255, 0.5)" // Couleur du contour
        fillColor="rgba(0, 122, 255, 0.2)" // Couleur de remplissage
      />*/}

      {/* Point bleu pour indiquer la position */}
      {/*<Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        anchor={{ x: 0.5, y: 0.5 }} // Centre le marker
      >
        <View style={styles.marker}>
          <View style={styles.markerCore} />
        </View>
      </Marker>*/}
      {/*{redMarker && (
          <Marker
            coordinate={{
              latitude: redMarker.lat,
              longitude: redMarker.lng,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.redMarker}>
              <View style={styles.redMarkerCore} />
            </View>
          </Marker>
        )}*/}
        <View  style={styles.searchBar}><SearchBar gotToLatLng={gotToLatLng} createRedPoint={createRedPoint}/></View>

<TouchableOpacity style={styles.button} onPress={centerOnUser}>
        <View style={styles.buttonIcon}>
          <View style={styles.buttonIconCore} />
        </View>
      </TouchableOpacity>

      <TabBar/>
      </MapView>

    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  marker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.3)", // Cercle externe semi-transparent
    alignItems: "center",
    justifyContent: "center",
  },
  markerCore: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "rgba(0, 122, 255, 1)", // Point bleu central
  },
  searchBar: {
    flex:1,
    paddingTop:70,
    justifyContent:"center",
    alignItems:"center",
  },
  button: {
    backgroundColor: "white",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25, // Bouton circulaire
    position: "absolute",
    bottom: 120,
    left: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Ombre sur Android
    shadowColor: "#000", // Ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  receiveAlerts: {
    backgroundColor: "rgba(0, 122, 255, 1)",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 1)",
    height: 50,
    borderRadius: 25, // Bouton circulaire
    position: "absolute",
    bottom: 30,
    left: 75,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Ombre sur Android
    shadowColor: "#000", // Ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingLeft:15,
    paddingRight:15,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonIcon: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.3)", // Cercle externe semi-transparent
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIconCore: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "rgba(0, 122, 255, 1)", // Point bleu central
  },
  redMarker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 0, 0, 0.3)", // Cercle externe semi-transparent rouge
    alignItems: "center",
    justifyContent: "center",
  },
  redMarkerCore: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 0, 0, 1)", // Point rouge central
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
