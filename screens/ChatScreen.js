import React, { useEffect, useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Linking,
  TextInput,
} from "react-native"
import { FlatList } from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import AppLoading from "expo-app-loading"
import { useSelector } from "react-redux"

const DiscussionsScreen = ({ navigation, route }) => {
  const { roomId } = route.params
  const [search, setSearch] = useState("")
  const [messages, setMessages] = useState([])
  const apiRoom = `${process.env.EXPO_PUBLIC_BACKEND_URL}rooms`
  const apiMessage = `${process.env.EXPO_PUBLIC_BACKEND_URL}messages`
  const userToken = useSelector((state) => state.user.value?.token)
  const [toggle, setToggle] = useState(false)
  const [userid, setuserid] = useState("")

  useEffect(() => {
    ;(async () => {
      const getMessages = await fetch(`${apiRoom}?room=${roomId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      })

      const response = await getMessages.json()

      setMessages(response.messages)
      setuserid(response.userID)
    })()
  }, [toggle])

  const sendMessage = async () => {
    const send = await fetch(`${apiMessage}?room=${roomId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: search,
      }),
    })

    const response = await send.json()

    setToggle((prev) => !prev)
    setSearch("")
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
        <View style={styles.header}></View>
        <ScrollView
          contentContainerStyle={styles.messages}
          style={styles.messages}
        >
          {messages &&
            messages.map((e, i) => (
              <View
                key={i}
                style={[
                  styles.message,

                  e.sender === userid
                    ? styles.messageSent
                    : styles.messageReceived,
                ]}
              >
                <Text style={e?.isSentByUser ? { color: "white" } : null}>
                  {e.content}
                </Text>
              </View>
            ))}
        </ScrollView>
        <View style={styles.sender}>
          <TextInput
            style={styles.inputMessage}
            placeholder="Envoyer un message..."
            value={search}
            onChangeText={(e) => setSearch(e)}
          ></TextInput>
          <TouchableOpacity
            style={styles.iconSearch}
            onPress={() => sendMessage()}
          >
            <FontAwesome name="paper-plane" size={25} color="#0639DB" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: 150,
  },
  messages: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  message: {
    maxWidth: "70%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    textAlign: "justify",
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },

  messageSent: {
    alignSelf: "flex-end",
    backgroundColor: "#0639DB",
    color: "white",
  },
  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  sender: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    justifyContent: "space-between",
    alignSelf: "flex-end",
    padding: 10,
  },
})

export default DiscussionsScreen
