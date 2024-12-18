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
  const navigation = useNavigation()
  const token = useSelector((state) => state.user.value.token)
  const [dogData, setDogData] = useState([])
  const apiGetUser = `${process.env.EXPO_PUBLIC_BACKEND_URL}`

  useEffect(() => {
    ;(async () => {
      const getDog = await fetch(apiGetUser)

      const response = await getDog.json()

      setDogData(response)
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          width: "100%",
          paddingBottom: 20,
        }}
      >
        <View style={styles.innerContainer}>
          <Image source={{ uri: dogData?.uri }} style={styles.dogPic} />
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
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 40,
    marginTop: 100,
  },
  dogPic: {
    width: "50%",
    marginBottom: 35,
    aspectRatio: 1,
    borderRadius: 500,
  },
  infos: {
    width: "90%",
    gap: 20,
  },
  demiBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updatePhoto: {
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 170,
    right: 0,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },
  dogInfo: {
    width: "90%",
    fontFamily: "Lexend_400Regular",
  },
  infoDemiBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "white",
    borderRadius: 5,
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  vaccins: {
    gap: 15,
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: -40,
    fontFamily: "Lexend_700Bold",
  },
  icons: {
    marginRight: 15,
    marginLeft: 15,
  },
  iconsDemi: {
    marginRight: 5,
    marginLeft: 5,
  },
  infoModal: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalViewInfo: {
    width: "90%",
    height: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyleInfo: {
    color: "#0639DB",
    width: "100%",
    textAlign: "center",
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    marginVertical: 10,
  },
  text: {
    color: "#0639DB",
    width: "90%",
    paddingLeft: 15,
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 60,
    borderColor: "#4D4D4D",
    backgroundColor: "#BFBFBF",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: "black",
    fontSize: 16,
    width: "90%",
    borderBottomWidth: 1,
    fontFamily: "Lexend_400Regular",
    alignSelf: "center",
  },
  inputFocused: {
    backgroundColor: "#F3E882",
    borderColor: "#FBBC05",
  },
  buttonModalSettings: {
    backgroundColor: "#0639DB",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
    alignSelf: "center",
  },
  textStyleSettings: {
    color: "#FFF",
    width: "100%",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    marginRight: 5,
  },
  close: {
    marginBottom: 10,
  },
})

export default UserProfileScreen
