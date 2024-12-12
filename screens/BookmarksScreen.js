import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  View,
  Text,
  Image,
} from "react-native"
import { useSelector } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"

import FontAwesome from "react-native-vector-icons/FontAwesome"
function BookmarksScreen() {
  const navigation = useNavigation()
  const backend = process.env.EXPO_PUBLIC_BACKEND_URL
  const userToken = useSelector((state) => state.user.value.token)
  const [bookmarks, setBookmarks] = useState([{ name: "tac" }])

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <FontAwesome
        name="arrow-left"
        size={25}
        color="#0639DB"
        style={styles.iconBack}
        onPress={() => navigation.goBack()}
      />
      <SafeAreaView style={styles.content}>
        <ScrollView style={styles.scroll}>
          {bookmarks &&
            bookmarks.map((e, i) => (
              <View key={i} style={styles.card}>
                <Image
                  style={styles.image}
                  source={require("../assets/dog_example.webp")}
                ></Image>
                <Text>{e.name}</Text>
                <FontAwesome name="bookmark" size={35} color="#EAD32A" />
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
  },
  iconBack: {
    position: "absolute",
    top: 30,
    left: 30,
  },
  card: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "80%",
    backgroundColor: "white",
    height: 500,
    marginHorizontal: "auto",
    marginVertical: 10,
    borderRadius: 20,
  },
  textFont: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },
  content: {
    width: "100%",
  },
  scroll: {
    marginTop: 200,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "40%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
})

export default BookmarksScreen
