import React, { useEffect, useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import AppLoading from "expo-app-loading"
import { useSelector } from "react-redux"

const InterestPoint = ({ navigation, route }) => {
  const { markerData } = route.params
  const [pointData, setPointData] = useState([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const userToken = useSelector((state) => state.user.value?.token)
  console.log(userToken)
  useEffect(() => {
    const fetchInterestPoint = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}map/lieu/${markerData.place_id}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de la récupération des données."
          )
        }
        const data = await response.json()
        setPointData(data)
        setIsBookmarked(true)
      } catch (err) {
        setError(err.message)
        Alert.alert("Erreur", err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInterestPoint()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    )
  }

  if (error || !pointData) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>
          Impossible de charger les données du point d'intérêt.
        </Text>
        <Text style={styles.errorText}>
          Impossible de charger les données du point d'intérêt.
        </Text>
      </View>
    )
  }

  const paw = []
  for (let i = 0; i < 5; i++) {
    let color = "#ccc" // Couleur par défaut pour les pattes vides

    if (i < Math.floor(pointData.data.rating)) {
      // Patte pleine
      color = "#0639DB"
    } else if (i < pointData.data.rating) {
      color = "rgba(6, 57, 219, 0.5)"
    }

    paw.push(
      <FontAwesome
        key={i}
        name="paw"
        size={25}
        color={color}
        style={styles.paw}
      />
    )
  }

  const photos = pointData.data.photos.slice(1, 6).map((photo, index) => {
    return (
      <Image
        key={index} // Ajoutez une clé unique pour chaque élément dans une liste
        source={{
          uri: photo, // Utilisez directement `photo` ici
        }}
        style={styles.infoPic}
      />
    )
  })

  const dayOfWeek = new Date().getDay() // Récupérer le jour actuel (0-6)

  const openingHoursToday = pointData.data.opening_hours
    ? pointData.data.opening_hours.weekday_text[dayOfWeek - 1]
    : "Heures non disponibles"

  const handleBookmarkClick = ({ name, uri }) => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}map/canBookmark`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: pointData.data.name,
        uri: pointData.data.photos[0],
        city: pointData.data.address_components[2].long_name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Favoris ajoutés avec succès", data.newFavorite)
        } else {
          console.error("Erreur lors de l'ajout des favoris", data.error)
        }
      })
      .catch((error) => {
        console.log(error.message)

        console.error("Erreur lors de la requête", error)
      })
  }

  console.log("ville:", pointData.data.address_components[2].long_name)

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <FontAwesome
        name="arrow-left"
        size={30}
        color="#0639DB"
        style={styles.iconBack}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        {/* Image du profil */}
        <View>
          <Image
            source={{
              uri: pointData.data.photos
                ? pointData.data.photos[0]
                : require("../assets/dog_example.webp"),
            }}
            style={styles.profilPic}
          />
        </View>

        {/* Informations */}
        <View style={styles.infoContainer}>
          {/* Titre */}
          <View style={styles.infoTitre}>
            <Text style={styles.title}>{pointData.data.name}</Text>

            {/* Ouverture */}
            <View style={styles.openContainer}>
              <Text
                style={
                  pointData.data.current_opening_hours
                    ? styles.open
                    : styles.close
                }
              >
                {pointData.data.current_opening_hours ? "OUVERT" : "FERMÉ"}
              </Text>
              <FontAwesome
                name={isBookmarked ? "bookmark-o" : "bookmark"}
                size={35}
                color="#EAD32A"
                onPress={() =>
                  handleBookmarkClick(
                    pointData.data.name,
                    pointData.data.photos[0],
                    pointData.data.address_components[2].long_name
                  )
                }
              />
            </View>
          </View>

          {/* Note */}
          <View style={styles.noteAverage}>
            {/* {paw} */}
            <Text style={styles.note}>{paw}</Text>
            <Text style={styles.note}>
              ({pointData.data.rating}){pointData.data.user_ratings_total} avis
            </Text>
          </View>

          {/* Profil infos */}
          <View style={styles.profilInfos}>
            <Text style={styles.adresse}>
              {pointData.data.formatted_address}
            </Text>

            {/* Téléphone */}
            <View style={styles.row}>
              <FontAwesome name="phone" size={15} color="#EAD32A" />
              <Text style={styles.phone}>
                {pointData.data.formatted_phone_number}
              </Text>
            </View>

            {/* Horaires */}
            <View style={styles.row}>
              <FontAwesome name="clock-o" size={15} color="#EAD32A" />
              <Text style={styles.text}>Horaires d'ouverture</Text>
            </View>
            <Text style={styles.hours}>
              {openingHoursToday
                ? `Aujourd'hui : ${openingHoursToday}`
                : "Heures non disponibles"}
            </Text>

            {/* Bouton */}
            <TouchableOpacity
              style={styles.reserve}
              onPress={() => {
                const phoneNumber = `tel:${pointData.data.formatted_phone_number}` // Remplacez ce numéro par celui que vous souhaitez appeler
                Linking.openURL(phoneNumber).catch((err) =>
                  console.error("Erreur de lien", err)
                )
              }}
            >
              <Text style={styles.reserveText}>Prendre rendez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.gallery}>{photos}</View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maringTop: -10
  },
  profilPic: {
    width: "100%",
    height: 300,
    marginBottom: 10,
  },
  iconBack: {
    position: "fixed",
    top: 30,
    left: 30,
    zIndex: 50,
  },
  infoContainer: {
    padding: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0639DB",
  },
  openContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  infoTitre: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  open: {
    fontSize: 18,
    color: "#0639DB",
    fontWeight: "bold",
    borderRadius: 5,
    borderColor: "#0639DB",
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  close: {
    fontSize: 18,
    color: "#FC4F52",
    fontWeight: "bold",
    borderRadius: 5,
    borderColor: "#FC4F52",
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  noteAverage: {
    marginBottom: 10,
  },
  note: {
    marginLeft: 10,
    fontSize: 16,
    color: "#0639DB",
  },
  profilInfos: {
    marginTop: 10,
  },
  adresse: {
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  phone: {
    marginLeft: 10,
    fontSize: 20,
    color: "#4D4D4D",
  },
  text: {
    marginLeft: 10,
    fontSize: 20,
  },
  hours: {
    fontSize: 14,
    color: "#4D4D4D",
    marginBottom: 10,
  },
  reserve: {
    backgroundColor: "#0639DB",
    width: "70%",
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
    alignItems: "center",
    alignSelf: "center",
  },
  reserveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
  },
  gallery: {
    width: "100%",
  },
  infoPic: {
    width: "100%",
    height: 300,
    marginTop: 50,
  },
})
export default InterestPoint
