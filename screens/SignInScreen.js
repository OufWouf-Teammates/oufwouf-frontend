import { StatusBar } from "expo-status-bar"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { connectUser } from "../reducers/user"

export default function SignInScreen({ navigation, route }) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
  const { connectToAccount } = route.params

  const handleConnection = () => {
    connectToAccount({ email, password })
  }

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
          activeOpacity={0.8}
        >
          <FontAwesome name="arrow-left" size={25} color="#0639DB" />
        </TouchableOpacity>
        <Image
          style={styles.image}
          source={require("../assets/logo_oufwouf_couleur.png")}
        />
        <Text style={styles.title}>Se connecter</Text>
        <View style={styles.boxInputEmail}>
          <TextInput
            placeholder="Adresse Email"
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={styles.inputEmail}
            autoCapitalize="none" // Évite la capitalisation automatique
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />
        </View>
        <View style={styles.boxInputPassword}>
          <TextInput
            placeholder="Mot de passe"
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.inputPassword}
            secureTextEntry={true} // Masque les caractères
            autoCapitalize="none" // Évite la capitalisation automatique
          />
        </View>
        <TouchableOpacity
          onPress={() => handleConnection()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Me connecter</Text>
          <FontAwesome name="arrow-right" size={25} color="#F5F5F5" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    marginTop: 50,
  },
  image: {
    width: "70%",
    height: "20%",
  },
  title: {
    width: "80%",
    fontSize: 24,
    fontFamily: "Lexend_700Bold",
    marginVertical: 10,
  },
  inputEmail: {
    color: "#F5F5F5",
    fontSize: 16,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    fontFamily: "Lexend_400Regular",
  },
  boxInputEmail: {
    backgroundColor: "#EAD32A",
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 5,
    padding: 20,
    borderRadius: 5,
  },
  error: {
    marginTop: 10,
    color: "red",
    fontFamily: "Lexend_400Regular",
  },
  inputPassword: {
    color: "#0639DB",
    fontSize: 16,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#0639DB",
    fontFamily: "Lexend_400Regular",
  },
  boxInputPassword: {
    backgroundColor: "#FFFFFF",
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 5,
    padding: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#0639DB",
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 100,
    padding: 15,
    borderRadius: 5,
  },
  textButton: {
    color: "#F5F5F5",
    fontSize: 16,
    width: "70%",
    fontFamily: "Lexend_400Regular",
  },
  back: {
    width: "90%",
  },
})
