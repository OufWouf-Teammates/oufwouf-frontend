import { StatusBar } from "expo-status-bar"
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import AppLoading from "expo-app-loading"

import { connectUser, disconnectUser } from "../reducers/user"

import GoogleSignInButton from "../components/GoogleSignInButton"
import AppleSignInButton from "../components/appleConnect"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export default function ConnectionScreen({ navigation }) {
  const dispatch = useDispatch()
  const userToken = useSelector((state) => state.user.value.token)

  const isConnectedOrNot = () => {
    // Fetch pour vérifier le token côté backend
    if (userToken) {
      fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/isConnectedOrNot`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.result) {
            navigation.navigate("Map")
          } else {
            dispatch(disconnectUser())
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la vérification de connexion :", error)
          dispatch(disconnectUser())
        })
    }
  }

  useEffect(() => {
    isConnectedOrNot()
  }, [])

  //Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  const connectToAccount = (objConn) => {
    console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/signin`)

    if (objConn.email && objConn.password) {
      console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/signin`)

      fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: objConn.email,
          password: objConn.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.result) {
            dispatch(
              connectUser({
                email: data.data.email,
                token: data.data.token,
              })
            )
            navigation.navigate("Map")
          } else {
            alert(data.error)
          }
        })
        .catch((error) => console.error(error))

      console.log(objConn)
    }
  }

  const createAccount = (objConn) => {
    console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/signup`)

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: objConn.email,
        password: objConn.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.result) {
          dispatch(
            connectUser({ email: data.result.email, token: data.result.token })
          )
          navigation.navigate("Map")
        } else {
          alert(data.error)
        }
      })
      .catch((error) => console.error(error))

    console.log(objConn)
  }

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.innerContainer}>
          <Image
            style={styles.image}
            source={require("../assets/logo_oufwouf_couleur.png")}
          />
          <Text style={styles.title}>Pour woufer la vie à pleins crocs !</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Sign In", {
                connectToAccount,
                createAccount,
              })
            }
            style={styles.buttonSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonSignIn}>Se connecter</Text>
            <FontAwesome name="arrow-right" size={25} color="#F5F5F5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Sign Up", {
                connectToAccount,
                createAccount,
              })
            }
            style={styles.buttonSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonSignUp}>S'inscrire</Text>
            <FontAwesome name="arrow-right" size={25} color="#0639DB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Interest")}
            style={styles.buttonSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.textButtonSignUp}>interest</Text>
            <FontAwesome name="arrow-right" size={25} color="#0639DB" />
          </TouchableOpacity>
          <GoogleSignInButton
            title="Connect with Google"
            connectToAccount={connectToAccount}
          />
          <AppleSignInButton
            title="Connect with Apple"
            connectToAccount={connectToAccount}
          />
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "30%",
  },
  title: {
    width: "80%",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Lexend_700Bold",
  },
  buttonSignIn: {
    backgroundColor: "#EAD32A",
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
  },
  buttonSignUp: {
    backgroundColor: "#FFFFFF",
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
  },
  textButtonSignIn: {
    color: "#F5F5F5",
    fontSize: 16,
    width: "70%",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    fontFamily: "Lexend_400Regular",
  },
  textButtonSignUp: {
    color: "#0639DB",
    fontSize: 16,
    width: "70%",
    borderBottomWidth: 1,
    borderBottomColor: "#0639DB",
    fontFamily: "Lexend_400Regular",
  },
})
