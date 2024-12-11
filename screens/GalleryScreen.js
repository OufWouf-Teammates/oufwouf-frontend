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
    {
      description: "voila cest la description tac",
      uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
    },
    {
      description: "voila cest la description tac",
      uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
    },
    {
      description: "voila cest la description tac",
      uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
    },
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
      <SafeAreaView style={styles.content}>
        <ScrollView style={styles.scroll}>
          {galerie &&
            galerie.map((e, i) => (
              <View key={i} style={styles.card}>
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
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 300,
    height: 300,
  },
  content: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  scroll: {
    width: "100%",
    alignContent: "center",
    gap: 10,
  },
  card: {
    width: "60%",
    backgroundColor: "white",
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Gallery
