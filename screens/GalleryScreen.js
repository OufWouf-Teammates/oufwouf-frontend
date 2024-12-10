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

import { useEffect, useState } from "react"

function Gallery() {
  const [galerie, setGalerie] = useState([
    {
      description: "voila cest la description tac",
      uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
    },
  ])

  useEffect(() => {
    ;(async () => {
      const response = await fetch("")

      const data = await response.json()

      setGalerie(data.data)
    })()
  }, [])

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <ScrollView>
        {galerie &&
          galerie.map((e, i) => (
            <View key={i}>
              <Image
                source={{ uri: e.uri }}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity>
                <Text>Location</Text>
              </TouchableOpacity>
              <Text>{e.description}</Text>
            </View>
          ))}
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
  image: {
    width: "60%",
  },
})

export default Gallery
