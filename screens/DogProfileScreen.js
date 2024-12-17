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
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function DogProfileScreen({ navigation }) {
  const token = useSelector((state) => state.user.value.token)
  const [dogsData, setDogsData] = useState([])
  const [info, setInfo] = useState("")
  const [personality, setPersonality] = useState("")
  const [focusedField, setFocusedField] = useState(null)
  const [visibleModalDog, setVisibleModalDog] = useState(null);
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
      hideSplashScreen();


    (async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}dogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      setDogsData(data.dog)
    })();

    }, [fontsLoaded, visibleModalDog])
  
    if (!fontsLoaded) {
      return null // Rien n'est affiché tant que les polices ne sont pas chargées
    }

    // Fonction pour changer la couleur de l'input quand il est focus //
    const handleFocus = (field) => {
      setFocusedField(field)
  }
  
    // Fonction pour gérer la perte de focus //
    const handleBlur = () => {
        setFocusedField(null)
    }


    const openModal = (dogId) => {
      setVisibleModalDog(dogId); // Définir l'ID du chien pour lequel le modal est ouvert
    };
    
    const closeModal = () => {
      setVisibleModalDog(null); // Réinitialiser l'état pour fermer le modal
      setInfo("");
      setPersonality("");
    };

    const updateDog = (dogId) => {

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
              dog: dogId, 
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


    const dogs = dogsData.map((data, i) => {
      return (
        <View key={i} style={[styles.innerContainer, { marginTop: 0 }]}>
          <Image
          source={{
            uri: data?.uri,
          }}
          style={styles.dogPic}
        />
        <Text style={styles.name}>{data?.name}</Text>
        {/* Infos du carnet */}
        <View style={styles.infos}>
          {/* ID */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="id-badge"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{data?.ID} </Text>
          </View>
          {/* Race */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="paw"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{data?.race} </Text>
          </View>
          {/* Moitié de boite */}
          <View style={styles.demiBox}>
            {/* Sex */}
            <View style={styles.infoDemiBox}>
              <FontAwesome
                name="venus-mars"
                size={25}
                color="#0639DB"
                style={styles.iconsDemi}
              />
              <Text style={styles.dogInfo}>{data?.sex} </Text>
            </View>
            {/* Anniversaire */}
            <View style={styles.infoDemiBox}>
              <FontAwesome
                name="calendar"
                size={25}
                color="#0639DB"
                style={styles.iconsDemi}
              />
              <Text style={styles.dogInfo}>{data?.birthday} </Text>
            </View>
          </View>

          {data?.vaccins &&
            data?.vaccins.map((e, index) => (
              <View key={index} style={styles.vaccins}>
                {/* Vaccin si besoin */}
                <View style={styles.infoBox}>
                  <FontAwesome
                    name="heartbeat"
                    size={25}
                    color="#0639DB"
                    style={styles.icons}
                  />
                  <Text style={styles.dogInfo}>{e.name}</Text>
                </View>

                <View style={styles.demiBox}>
                  {/* Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text style={styles.dogInfo}>
                      <FontAwesome
                        name="bell"
                        size={25}
                        color="#0639DB"
                        style={styles.iconsDemi}
                      />
                      <View style={styles.dogInfo}>
                      <Text>{e.rappel ? "oui" : "non"}</Text>
                      </View>
                    </Text>
                  </View>
                  {/* Date de Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text>
                      <FontAwesome
                        name="calendar-check-o"
                        size={25}
                        color="#0639DB"
                        style={styles.iconsDemi}
                      />
                      <View style={styles.dogInfo}>
                      <Text>{e.date}</Text>
                      </View>
                    </Text>
                  </View>
                </View>
              </View>
            ))}

          {/* Infos général */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="info-circle"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{data?.infos}</Text>
          </View>
          {/* Personnalité */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="smile-o"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{data?.personality}</Text>
          </View>
          <TouchableOpacity
                style={styles.buttonModalSettings}
                activeOpacity={0.8}
                onPress={() => {
                  openModal(data?.ID)
                  console.log(data)
                }}
            >
                <FontAwesome name="paw" size={25} color="#0639DB" />
                <Text style={styles.textStyleSettings}>Modifier les  informations de {data?.name}</Text>
            </TouchableOpacity>
        </View>
        {/*Modal modification du chien*/}
        {visibleModalDog === data?.ID && ( // Afficher le modal uniquement si l'ID correspond
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={closeModal}
        >
            <View style={styles.infoModal}>
            <View style={styles.modalViewInfo}>
                <TouchableOpacity
                onPress={closeModal}
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
                        <Text style={styles.textStyleInfo}>Information du chien</Text>
                        <Text style={styles.text}>Information général </Text>
                        <TextInput
                        style={[
                            styles.input,
                            focusedField === "info" && styles.inputFocused,
                        ]}
                        onFocus={() => handleFocus("info")}
                        onBlur={handleBlur}
                        onChangeText={(value) => setInfo(value)}
                        value={info}
                        placeholder={data?.infos}
                        />

                        <Text style={styles.text}>Traits de personalité</Text>
                        <TextInput
                        style={[
                            styles.input,
                            focusedField === "personality" && styles.inputFocused,
                        ]}
                        onFocus={() => handleFocus("personality")}
                        onBlur={handleBlur}
                        onChangeText={(value) => setPersonality(value)}
                        placeholder={data?.personality}
                        value={personality}
                        />
                        <TouchableOpacity
                            style={[styles.buttonModalSettings]}
                            onPress={() => {
                              updateDog(data?._id)
                              closeModal()
                            }}
                        >
                            <Text style={styles.textStyleSettings}>Modifier les informations du chien</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonModalSettings]}
                            onPress={() => null}
                        >
                            <Text style={styles.textStyleSettings}>Ajouter une vaccin</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            </View>
          </Modal>
          )}
        </View>
      )
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, width: "100%", paddingBottom: 20 }}>
      <SafeAreaView style={styles.innerContainer}>
        {dogs}
      </SafeAreaView>
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
    width: "80%",
    gap: 20,
  },
  demiBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: 'center',
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
    alignItems: 'center',
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
    alignSelf: 'center',
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