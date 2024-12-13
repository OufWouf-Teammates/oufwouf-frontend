import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"

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

      setDog(data.dog[0])
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
        style={styles.arrow}
      >
        <FontAwesome name="arrow-left" size={30} color="#0639DB" />
      </TouchableOpacity>
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
            <Text>{dog.ID} </Text>
          </View>
          {/* Race */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="paw"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text>{dog.race} </Text>
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
              <Text>{dog.sex} </Text>
            </View>
            {/* Anniversaire */}
            <View style={styles.infoDemiBox}>
              <FontAwesome
                name="calendar"
                size={25}
                color="#0639DB"
                style={styles.iconsDemi}
              />
              <Text>{dog.birthday} </Text>
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
                  <Text>{e.name}</Text>
                </View>

                <View style={styles.demiBox}>
                  {/* Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text>
                      <FontAwesome
                        name="bell"
                        size={25}
                        color="#0639DB"
                        style={styles.iconsDemi}
                      />
                      {e.rappel ? "oui" : "non"}{" "}
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
                      {e.date}{" "}
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
            <Text>{dog.infos}</Text>
          </View>
          {/* Personnalité */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="smile-o"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text>{dog.personality}</Text>
          </View>
        </View>
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
  innerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 40,
    alignItems: "center",
    marginTop: 100,
  },
  dogPic: {
    width: "40%",
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
    width: "100%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },
  infoDemiBox: {
    flexDirection: "row",
    width: "40%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },
  arrow: {
    position: "absolute",
    top: 45,
    left: 45,
    zIndex: 2,
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