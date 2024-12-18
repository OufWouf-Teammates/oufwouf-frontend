import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import { useEffect, useState } from "react"

const UserProfileScreen = ({ navigation, route }) => {
  const { dogName } = route.params
  const [userData, setUserData] = useState(null)
  const [galerie, setGalerie] = useState(null)
  const apiGetUser = `${process.env.EXPO_PUBLIC_BACKEND_URL}users/dogname`

  //Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  })

  useEffect(() => {
    ;(async () => {
      const getDog = await fetch(`${apiGetUser}?name=${dogName}`)

      const response = await getDog.json()
      setUserData(response?.user)
      setGalerie(response?.photos)
    })()
  }, [])

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconBack}
      >
        <FontAwesome name="arrow-left" size={30} color="#0639DB" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Image
          source={{
            uri: userData?.dogs[0].uri || "https://via.placeholder.com/150",
          }}
          style={styles.profilePicture}
        />

        <Text style={styles.name}>{userData?.dogs[0].name}</Text>
        <Text style={styles.email}>{userData?.email}</Text>

        <Text style={styles.galleryTitle}>Galerie de photos</Text>
        <View style={styles.photoGallery}>
          {galerie &&
            galerie.map((e, i) => (
              <Image
                key={i}
                source={{ uri: e.uri }}
                style={styles.galleryPhoto}
              />
            ))}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
    marginTop: 100,
    paddingBottom: 50,
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#0639DB",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Lexend_700Bold",
    color: "#0639DB",
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#4D4D4D",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#4D4D4D",
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Lexend_700Bold",
    color: "#0639DB",
    marginTop: 20,
    marginBottom: 10,
  },
  photoGallery: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryPhoto: {
    width: "48%",
    height: 100,
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
})

export default UserProfileScreen
