import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet"
import * as ImagePicker from "expo-image-picker"
import * as MediaLibrary from "expo-media-library"
import { useNavigation } from "@react-navigation/native"
import { Provider as PaperProvider } from "react-native-paper"
import NestedModalCalendar from "../components/NestedModalCalendar"

const UserProfileScreen = ({ navigation, route }) => {
  const token = useSelector((state) => state.user.value.token)
  const { dogName } = route.params
  const [userData, setUserData] = useState(null)
  const apiGetUser = `${process.env.EXPO_PUBLIC_BACKEND_URL}users/dogname`

  useEffect(() => {
    ;(async () => {
      const getDog = await fetch(`${apiGetUser}?name=${dogName}`)

      const response = await getDog.json()

      console.log(response)

      setUserData(response.user)
    })()
  }, [])

  //Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  })

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
          {userData.photos && userData?.photos.map((e, i) => (
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
    flexWrap: "wrap", // Permet aux images de se placer sur plusieurs lignes
    justifyContent: "space-between", // Espace entre les images
  },
  galleryPhoto: {
    width: "48%", // La largeur des images pour remplir deux colonnes
    aspectRatio: 1, // Les images sont carrées
    borderRadius: 10,
    marginBottom: 10,
  },
})

export default UserProfileScreen
