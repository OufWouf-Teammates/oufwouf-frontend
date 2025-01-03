import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Image,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { useEffect, useState } from "react"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import * as SplashScreen from "expo-splash-screen"
import { useDispatch, useSelector } from "react-redux"
import { connectUser, disconnectUser } from "../reducers/user"

export default function SettingsScreen({ navigation }) {
    const dispatch = useDispatch()
    const token = useSelector((state) => state.user.value.token)
    const [email, setEmail] = useState("")
    const [emailCon, setEmailCon] = useState("")
    const [dog, setDog] = useState({})
    const [info, setInfo] = useState("")
    const [personality, setPersonality] = useState("")
    const [user, setUser] = useState({})
    const [focusedField, setFocusedField] = useState(null)
    const [modalSettingsVisible, setModalSettingsVisible] = useState(false)
    const [modalInfoVisible, setModalInfoVisible] = useState(false)
    useEffect(() => {
        ;(async () => {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}dogs`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            )
            const data = await response.json()
            setUser(data.user)
            setDog(data.dog[0])
        })()
    }, [])
    //Nécessaire pour la configuration des fonts
    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_700Bold,
    })
    useEffect(() => {
        async function hideSplashScreen() {
            if (fontsLoaded) {
                await SplashScreen.hideAsync()
            }
        }
        hideSplashScreen()
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null // Rien n'est affiché tant que les polices ne sont pas chargées
    }
    const deconnection = () => {
        dispatch(disconnectUser())
        setModalSettingsVisible(!modalSettingsVisible)
        navigation.navigate("Connection")
    }
    // Fonction pour changer la couleur de l'input quand il est focus //
    const handleFocus = (field) => {
        setFocusedField(field)
    }
    
    // Fonction pour gérer la perte de focus //
    const handleBlur = () => {
        setFocusedField(null)
    }

    const updateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!emailRegex.test(email)) {
        Alert.alert("Veuillez entrer une adresse e-mail valide.");
        return;
      }
      if (email !== emailCon) {
          Alert.alert("Les deux e-mails ne sont pas identiques")
          return 
      }
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}users`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: email}),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              Alert.alert(`E-mail mise à jour: ${data.email}`)
            }else{
              Alert.alert(data.error)
            }
          })
          .catch((error) => {
            Alert.alert("Erreur de réseau ou serveur indisponible.");
            console.error(error); // Logge l'erreur pour débogage
          });
    }

    const updateDog = () => {

    // Vérification si au moins l'un des champs est rempli
    if (!personality && !info) {
      Alert.alert("Veuillez remplir au moins un champ (personnalité ou informations).");
      return;
    }
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}dogs`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personality: personality || undefined, 
            infos: info || undefined 
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              Alert.alert(`Inforations mis à jour`)
            }else{
              Alert.alert(data.error)
            }
          })
          .catch((error) => {
            Alert.alert("Erreur de réseau ou serveur indisponible.");
            console.error(error); // Logge l'erreur pour débogage
          });
    }
    
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
        <SafeAreaView style={styles.innerContainer}>
            <View style={styles.in}>
            <Image
                source={{uri: dog?.uri}}
                style={[styles.dogPic, { width: 150, height: 150 }]}
            />
            <Text style={styles.name}>{dog?.name}</Text>
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => setModalInfoVisible(true)}
            >
                <FontAwesome name="paw" size={25} color="#0639DB" />
                <Text style={styles.textButton}>Informations personnelles</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigation.navigate("Request")}>
                <FontAwesome name="bell" size={25} color="#0639DB" />
                <Text style={styles.textButton}>Demandes</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonParam}
                activeOpacity={0.8}
                onPress={() => setModalSettingsVisible(true)}
            >
                <FontAwesome name="gear" size={25} color="#FFF" />
                <Text style={styles.textButtonParam}>Paramètres</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
        {/*Modal Settings*/}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalSettingsVisible}
            onRequestClose={() => {
            setModalSettingsVisible(!modalSettingsVisible)
            }}
        >
            <View style={styles.settingsModal}>
            <View style={styles.modalViewSettings}>
                <TouchableOpacity
                onPress={() => setModalSettingsVisible(!modalSettingsVisible)}
                >
                <FontAwesome name="close" size={25} color="#0639DB" />
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.buttonModalSettings]}
                onPress={() => deconnection()}
                >
                <Text style={styles.textStyleSettings}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
        {/*Modal Information personal*/}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalInfoVisible}
            onRequestClose={() => {
            setModalInfoVisible(!modalInfoVisible)
            }}
        >
            <View style={styles.infoModal}>
            <View style={styles.modalViewInfo}>
                <TouchableOpacity
                onPress={() => setModalInfoVisible(!modalInfoVisible)}
                >
                <FontAwesome
                    name="close"
                    size={25}
                    color="#0639DB"
                    style={styles.close}
                />
                </TouchableOpacity>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                        <Text style={styles.textStyleInfo}>Informations personnelles</Text>
                        <Text style={styles.text}>Nouveau email </Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === "email" && styles.inputFocused,
                            ]}
                            onFocus={() => handleFocus("email")}
                            onBlur={handleBlur}
                            onChangeText={(value) => setEmail(value)}
                            value={email}
                            placeholder={user?.email}
                            autoCapitalize="none" // Évite la capitalisation automatique
                            keyboardType="email-address"
                            autoComplete="email"
                            textContentType="emailAddress"
                        />
                        <Text style={styles.text}>Confirmer le nouveau email</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === "emailCon" && styles.inputFocused,
                            ]}
                            onFocus={() => handleFocus("emailCon")}
                            onBlur={handleBlur}
                            onChangeText={(value) => setEmailCon(value)}
                            value={emailCon}
                            placeholder={user?.email}
                            autoCapitalize="none" // Évite la capitalisation automatique
                            keyboardType="email-address"
                            autoComplete="email"
                            textContentType="emailAddress"
                        />
                        <TouchableOpacity
                            style={[styles.buttonModalSettings]}
                            onPress={() => {
                              updateEmail()
                              setModalInfoVisible(!modalInfoVisible)
                            }}
                        >
                            <Text style={styles.textStyleSettings}>Modifier les informations du maitre</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonModalSettings]}
                            onPress={() => {
                              navigation.navigate("Dog Info Form")
                              setModalInfoVisible(!modalInfoVisible)
                            }}
                        >
                            <Text style={styles.textStyleSettings}>Ajouter un chien</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            </View>
        </Modal>
    </ImageBackground>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  arrow: {
    position: "absolute",
    top: 45,
    left: 45,
    zIndex: 2,
  },
  innerContainer: {
    flex: 1,
    width: "90%",
    height: "100%",
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  in: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  dogPic: {
    aspectRatio: 1,
    borderRadius: 500,
    marginVertical: 20,
  },
  name: {
    fontFamily: "Lexend_700Bold",
    fontSize: 24,
  },
  button: {
    backgroundColor: "#FFF",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
  },
  textButton: {
    color: "#0639DB",
    fontSize: 16,
    width: "70%",
    fontFamily: "Lexend_400Regular",
  },
  buttonParam: {
    backgroundColor: "#0639DB",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 100,
    padding: 15,
    borderRadius: 5,
  },
  textButtonParam: {
    color: "#FFF",
    fontSize: 16,
    width: "70%",
    fontFamily: "Lexend_400Regular",
  },
  close: {
    marginBottom: 10,
  },
  settingsModal: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalViewSettings: {
    width: "90%",
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
  buttonModalSettings: {
    backgroundColor: "#0639DB",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginVertical: 20,
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
    alignSelf: 'center',
  },
  inputFocused: {
    backgroundColor: "#F3E882",
    borderColor: "#FBBC05",
  },
})
