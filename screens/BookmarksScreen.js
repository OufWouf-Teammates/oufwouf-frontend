import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native"
import { useIsFocused } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from "react-native-vector-icons/FontAwesome";

function BookmarksScreen() {
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

    
  const navigation = useNavigation();
  const userToken = useSelector((state) => state.user.value.token);
  const [bookmarks, setBookmarks] = useState([]);

  const isFocused = useIsFocused()

  const fetchFavorite = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}map`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setBookmarks(data.favorite)
    } catch (error) {
      console.error("ERROR pour afficher les favories", error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}map/deletePoint/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      console.log(response)
      const data = await response.json()
      if (data.result) {
        fetchFavorite() // Actualiser la liste
      } else {
        console.error("Impossible de supprimer le favori.")
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchFavorite()
  }, [isFocused])

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
        <ScrollView style={styles.scroll}>
          {bookmarks &&
            bookmarks.map((e, i) => (
              <View key={i} style={styles.card}>
                <Image
                  source={{ uri: e.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View>
                  <View style={styles.cardInfos}>
                    <View>
                      <Text style={styles.nameInfos}>{e.name}</Text>
                      <Text style={styles.cityInfos}>{e.city}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        handleDelete(e.name)
                      }}
                    >
                      <FontAwesome name="bookmark" size={20} color="#EAD32A" />
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
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  scroll: {
    marginTop: 80,
  },
  textFont: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  content: {
    width: "100%",
  },
  cardInfos: {
    flexDirection: "row",
    padding: 30,
    justifyContent: "space-between",
  },
  card: {
    width: "90%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    alignItems: "left",
    marginHorizontal: 20,
    flexWrap: "wrap",
  },
  nameInfos: {
    fontSize: 26,
    color: '#0639DB',
    fontFamily: 'Lexend_700Bold',
    fontWeight: 600
  },

  cityInfos: {
    fontSize: 16,
    color: '4D4D4D',
    fontFamily: 'Lexend_400Regular',
    fontWeight: 600
  },
  image: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginBottom: 10,
  },
})

export default BookmarksScreen
