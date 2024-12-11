import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function DogProfileScreen({ navigation }) {
  const token = useSelector((state) => state.user.value.token)
  const [dog, setDog] = useState({})

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

      setDog(data.dog[0])
    })()
  }, [])

  useEffect(() => {
    console.log(dog)
  }, [dog])

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <FontAwesome
          name="arrow-left"
          size={30}
          color="blue"
          style={styles.arrow}
          onPress={() => navigation.goBack()}
        />
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
            <Text>ID: {dog.ID} </Text>
          </View>
          {/* Race */}
          <View style={styles.infoBox}>
            <Text>Race: {dog.race} </Text>
          </View>
          {/* Moitié de boite */}
          <View style={styles.demiBox}>
            {/* Sex */}
            <View style={styles.infoDemiBox}>
              <Text>Sex: {dog.sex} </Text>
            </View>
            {/* Anniversaire */}
            <View style={styles.infoDemiBox}>
              <Text> {dog.birthday} </Text>
            </View>
          </View>

          {dog.vaccins &&
            dog.vaccins.map((e, index) => (
              <View key={index} style={styles.vaccins}>
                {/* Vaccin si besoin */}
                <View style={styles.infoBox}>
                  <Text>Vaccin:{e.name}</Text>
                </View>

                <View style={styles.demiBox}>
                  {/* Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text>Rappel: {e.rappel ? "oui" : "non"} </Text>
                  </View>
                  {/* Date de Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text> {e.date} </Text>
                  </View>
                </View>
              </View>
            ))}

          {/* Infos général */}
          <View style={styles.infoBox}>
            <Text>Informations général: {dog.infos}</Text>
          </View>
          {/* Personnalité */}
          <View style={styles.infoBox}>
            <Text>Traits de personnalité: {dog.personality}</Text>
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
    justifyContent: "center",
    gap: 40,
    alignItems: "center",
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
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  infoDemiBox: {
    width: "40%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  arrow: {
    position: "absolute",
    top: 70,
    left: 40,
  },
  vaccins: {
    gap: 15,
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: -50,
  },
})
