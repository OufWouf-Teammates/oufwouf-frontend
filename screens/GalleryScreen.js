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
  ScrollView,
} from "react-native"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import * as SplashScreen from "expo-splash-screen"

import { useIsFocused } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigation } from "@react-navigation/native"

import FontAwesome from "react-native-vector-icons/FontAwesome"
function Gallery() {
  const navigation = useNavigation()
  const apiPicture = `${process.env.EXPO_PUBLIC_BACKEND_URL}pictures`
  const userToken = useSelector((state) => state.user.value.token)

  const [galerie, setGalerie] = useState([])
  const [editedDescription, setEditedDescription] = useState("")
  const [selectedUri, setSelectedUri] = useState(null)
  const isFocused = useIsFocused()

  const fetchGalerie = async () => {
    try {
      const response = await fetch(apiPicture, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setGalerie(data.personalPicture)
    } catch (error) {
      console.error("ERROR pour afficher les photos", error.message)
    }
  }

  useEffect(() => {
    fetchGalerie()
  }, [isFocused])

  const handleDescription = async (uri) => {
    try {
      const response = await fetch(`${apiPicture}/description`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          uri,
          description: editedDescription,
        }),
      })

      const data = await response.json()
      console.log(data)

      if (data.result) {
        setGalerie((prevGalerie) =>
          prevGalerie.map((e) =>
            e.uri === uri ? { ...e, description: editedDescription } : e
          )
        )
        setEditedDescription("")
        setSelectedUri(null)
        console.log("yaay new des")
      } else {
        console.log("nauur no new des")
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiPicture}/delete/${id}`, {
        method: "DELETE",
      })
      if (response.result) {
        console.log("bouhhh tu sais pas supp")
      } else {
        fetchGalerie()
        console.log("ca y est cest supp")
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // Nécessaire pour la configuration des fonts
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
      <SafeAreaView style={styles.content}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Gallerie</Text>
        </View>
        <ScrollView style={styles.scroll}>
          {galerie &&
            galerie.map((e) => (
              <View key={e._id} style={styles.card}>
                <Image
                  source={{ uri: e.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  <View style={styles.descriptionContainer}>
                    {selectedUri === e.uri ? (
                      // Si l'URI de l'image sélectionnée est égale à celle en cours, afficher le TextInput
                      <TextInput
                        style={styles.textInput}
                        value={editedDescription}
                        onChangeText={setEditedDescription}
                        placeholder="Modifiez la description"
                      />
                    ) : (
                      <Text style={styles.textFont}>{e.description}</Text>
                    )}
                  </View>

                  <View style={styles.icons}>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedUri === e.uri) {
                          // Si la photo est déjà sélectionnée, envoyer la mise à jour
                          handleDescription(e.uri)
                        } else {
                          // Si la photo n'est pas sélectionnée, permettre l'édition de la description
                          setSelectedUri(e.uri)
                          setEditedDescription("")
                        }
                      }}
                    >
                      {selectedUri === e.uri ? (
                        <FontAwesome name="check" size={20} color="#0639DB" />
                      ) : (
                        <FontAwesome name="pencil" size={20} color="#0639DB" />
                      )}
                    </TouchableOpacity>

                    {/* Icône de suppression */}
                    <TouchableOpacity
                      onPress={() => {
                        handleDelete(e._id)
                      }}
                    >
                      <FontAwesome name="trash" size={20} color="#EAD32A" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  image: {
    width: 350,
    height: 350,
  },
  titleBox: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  title: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 35,
  },
  cardInfo: {
    flexDirection: "row",
    width: 350,
    backgroundColor: "white",
    justifyContent: "space-between", // Sépare les icônes et la description
    alignItems: "center",
    padding: 30,
    marginBottom: 50,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  textFont: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },
  descriptionContainer: {
    flex: 1, // Permet de prendre tout l'espace restant pour la description
    marginRight: 10, // Ajoute un espace entre la description et les icônes
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textInput: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    borderBottomWidth: 1,
    borderColor: "#0639DB",
    padding: 5,
  },
  scroll: {
    marginTop: 10,
  },
})

export default Gallery
