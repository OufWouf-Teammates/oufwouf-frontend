import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
  Image,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
} from "react-native"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Callout,
  CalloutSubview,
} from "react-native-maps"
import * as Location from "expo-location"

import SearchBar from "../components/SearchBar"
import TabBar from "../components/TabBar"

import { Dimensions } from "react-native"
const { width, height } = Dimensions.get("window") // Obtenir les dimensions de l'écran

import { useSelector } from "react-redux"

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null)
  const [locationMap, setLocationMap] = useState(location)
  const [mapRef, setMapRef] = useState(null) // Référence pour MapView
  const [redMarker, setRedMarker] = useState(null) // État pour le marker rouge
  const [modalVisible, setModalVisible] = useState(false)
  const [places, setPlaces] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(null)
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  useEffect(() => {
    requestLocationPermission()
  }, [])
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
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
      )
      return false
    }

    let location = await Location.getCurrentPositionAsync({})
    setLocation(location)
  }
  //Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  })
  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplashScreen();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Rien n'est affiché tant que les polices ne sont pas chargées
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
      )
    }
  }
  const handleRegionChangeComplete = (region) => {
    setLocationMap({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const createRedPoint = (arrLatLng) => {
    setRedMarker(arrLatLng) // Affiche le marker rouge

    // Masque le marker après 5 secondes
    setTimeout(() => {
      setRedMarker(null) // Supprime le marker rouge
    }, 5000)
  }

  const gotToLatLng = (arrLatLng) => {
    centerOn(arrLatLng)
  }

  const centerOnUser = () => {
    if (location && mapRef) {
      centerOn({
        lat: location.coords?.latitude || 1,
        lng: location.coords?.longitude || 1,
      })
    }
  }

  const filterOptions = ["Vétérinaires", "Boutiques", "Parcs"]

  const filters = filterOptions.map((data, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={[
          styles.buttonFilter,
          selectedFilter === data
            ? { backgroundColor: "#0639DB" }
            : { backgroundColor: "#FFF" },
        ]}
        onPress={() => handleFilterPress(data)}
      >
        <Text
          style={[
            styles.textButtonFilter,
            selectedFilter === data ? { color: "#FFF" } : { color: "#0639DB" },
            {
              fontFamily: "Lexend_400Regular",
              fontSize: 16,
              alignSelf: "center",
            },
          ]}
        >
          {data}
        </Text>
      </TouchableOpacity>
    )
  })

  const handleFilterPress = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(null)
      setPlaces([])
    } else {
      setSelectedFilter(filter)

      let endpoint = ""
      if (filter === "Boutiques") endpoint = "boutiques"
      else if (filter === "Vétérinaires") endpoint = "veterinaires"
      else if (filter === "Parcs") endpoint = "parcs-chiens"

      const latitude = locationMap?.latitude || location?.coords?.latitude || 1;
      const longitude = locationMap?.longitude || location?.coords?.longitude || 1;
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}map/${endpoint}/${latitude},${longitude}`;

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)
          return response.json()
        })
        .then((data) => {
          if (data.result) {
            // Traite les données reçues
            const res = data.data.map((element) => {
              return {
                name: element?.name || "Inconnu", // Nom par défaut si non défini
                latitude: element?.geometry?.location?.lat ?? 0, // Latitude correcte
                longitude: element?.geometry?.location?.lng ?? 0, // Correction de la longitude
                place_id: element?.place_id,
                type: endpoint,
              }
            })

            // Mets à jour l'état avec les données des lieux
            setPlaces(res)
          }
        })
        .catch((error) => console.error("Erreur lors de la requête :", error))
    }
  }
  const icons = {
    boutiques: require("../assets/os.png"),
    veterinaires: require("../assets/veterinaire.png"),
    "parcs-chiens": require("../assets/parc.png"),
    photos: require("../assets/photos.png"),
    bookmarks: require("../assets/save.png"),
  }
  const onMarkerSelect = (markerData) => {
    navigation.navigate("Interest", { markerData })
  }
  const markers = places.map((data, i) => {
    return (
      <Marker
        key={i}
        coordinate={{
          latitude: data?.latitude || 1,
          longitude: data?.longitude || 1,
        }}
      >
        <Image source={icons[data.type]} style={{ width: 28, height: 28 }} />
        <Callout
          tooltip={false} // Désactive la bulle de tooltip par défaut
          alphaHitTest={false} // Active ou désactive les clics sur les zones transparentes
          onPress={() => onMarkerSelect(data)}
        >
          <View
            style={{
              maxWidth: "100%",
              minWidth: 200,
              maxHeight: 100,
              padding: 10,
              justifyContent: "center", // Centre verticalement
              alignItems: "center", // Centre horizontalement
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  width: "90%",
                  textAlign: "center",
                  fontFamily: "Lexend_400Regular",
                  fontSize: 16,
                }}
              >
                {data.name}
              </Text>
            </View>
            <Text
              style={{
                margin: 5,
                textAlign: "center",
                backgroundColor: "#0639DB",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 25,
                color: "#F5F5F5",
                fontFamily: "Lexend_400Regular",
                fontSize: 16,
              }}
            >
              Voir plus
            </Text>
          </View>
        </Callout>
      </Marker>
    )
  })

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <View style={styles.container1}>
          <View style={styles.searchBar}>
            <SearchBar
              gotToLatLng={gotToLatLng}
              createRedPoint={createRedPoint}
              navigation={navigation}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={centerOnUser}>
            <View style={styles.buttonIcon}>
              <View style={styles.buttonIconCore} />
            </View>
          </TouchableOpacity>
          <View style={styles.ScrollView}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.filters}
              showsHorizontalScrollIndicator={false}
            >
              {filters}
            </ScrollView>
          </View>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords?.latitude || 1,
              longitude: location.coords?.longitude || 1,
              latitudeDelta: 0.005, // Réduire ces valeurs pour un zoom plus élevé
              longitudeDelta: 0.005,
            }}
            rotateEnabled={false}
            showsPointsOfInterest={false}
            showsBuildings={false}
            showsTraffic={false}
            pitchEnabled={false}
            loadingEnabled={false}
            onRegionChangeComplete={handleRegionChangeComplete}
            ref={(ref) => setMapRef(ref)} // Assurez-vous que setMapRef est appelé ici
          >
            {/* Cercle indiquant la précision */}
            {
              <Circle
                center={{
                  latitude: location?.coords?.latitude || 1,
                  longitude: location?.coords?.longitude || 1,
                }}
                radius={location?.coords?.accuracy} // Précision fournie par Expo Location
                strokeColor="rgba(0, 122, 255, 0.5)" // Couleur du contour
                fillColor="rgba(0, 122, 255, 0.2)" // Couleur de remplissage
              />
            }

            {/* Point bleu pour indiquer la position */}
            {
              <Marker
                coordinate={{
                  latitude: location.coords?.latitude || 1,
                  longitude: location.coords?.longitude || 1,
                }}
                anchor={{ x: 0.5, y: 0.5 }} // Centre le marker
              >
                <View style={styles.marker}>
                  <View style={styles.markerCore} />
                </View>
              </Marker>
            }
            {
              <Marker
                coordinate={{
                  latitude: redMarker?.lat || 1,
                  longitude: redMarker?.lng || 1,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.redMarker}>
                  <View style={styles.redMarkerCore} />
                </View>
              </Marker>
            }
            {markers}
          </MapView>
        </View>
        <View style={styles.container2}>
          <TabBar />
        </View>
      </SafeAreaProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 0.87,
  },
  container2: {
    flex: 0.13,
  },
  map: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: height,
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
    position: "absolute",
    marginTop: 65,
    width: "100%",
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 25, // Bouton circulaire
    position: "absolute",
    zIndex: 1,
    bottom: 40,
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
    paddingLeft: 15,
    paddingRight: 15,
  },
  iconAndText: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    fontWeight: "bold",
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  ScrollView: {
    zIndex: 1,
    width: "90%",
    marginTop: 120,
    alignSelf: "center",
  },
  filters: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonFilter: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginRight: 10,
    borderRadius: 25,
    alignContent: "center",
    justifyContent: "center",
  },
  textButtonFilter: {
    color: "#0639DB",
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
})
