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
  const [dog, setDog] = useState({})
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

      setDog(data.dog)
    })();

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
      <ScrollView contentContainerStyle={{ flexGrow: 1, width: "100%", paddingBottom: 20 }}>
      <SafeAreaView style={styles.innerContainer}>
        <Image
          source={{
            uri: dog.uri,
          }}
          style={styles.dogPic}
        />
        <Text style={styles.name}>{dog.name}</Text>
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
            <Text style={styles.dogInfo}>{dog.ID} </Text>
          </View>
          {/* Race */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="paw"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{dog.race} </Text>
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
              <Text style={styles.dogInfo}>{dog.sex} </Text>
            </View>
            {/* Anniversaire */}
            <View style={styles.infoDemiBox}>
              <FontAwesome
                name="calendar"
                size={25}
                color="#0639DB"
                style={styles.iconsDemi}
              />
              <Text style={styles.dogInfo}>{dog.birthday} </Text>
            </View>
          </View>

          {dog.vaccins &&
            dog.vaccins.map((e, index) => (
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
            <Text style={styles.dogInfo}>{dog.infos}</Text>
          </View>
          {/* Personnalité */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="smile-o"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{dog.personality}</Text>
          </View>
        </View>
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
})