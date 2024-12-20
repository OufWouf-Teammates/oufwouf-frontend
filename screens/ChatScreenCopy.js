import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Audio } from "expo-av";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Pusher from "pusher-js/react-native";

const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ChatScreen({ navigation, route: { params } }) {
  const { roomName } = params;
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);

  const token = useSelector((state) => state.user.value?.token);

  const channelName = `room-${roomName.replace(/\s+/g, "-").toLowerCase()}`;
  const newUser = `${username.replace(/\s+/g, "-").toLowerCase()}`;

  const getUserName = async () => {
    try {
      const response = await fetch(`${BACKEND_ADDRESS}dogName/${token}`);
      const data = await response.json();
      setUsername(data?.dogName);

      if (data.dogName) {
        const joinRes = await fetch(
          `${BACKEND_ADDRESS}users/${data?.dogName}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomName }),
          }
        );

        if (!joinRes.ok) {
          console.error("Erreur lors de la jonction de la salle");
        }
      }
    } catch (error) {
      console.error("Erreur dans getUserName :", error);
    }
  };

  useEffect(() => {
    getUserName();

    // Cleanup on unmount
    return async () => {
      try {
        await fetch(`${BACKEND_ADDRESS}users/${newUser}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName }),
        });
      } catch (error) {
        console.error("Erreur lors du nettoyage :", error);
      }
      subscription.unsubscribe();
    };
  }, [username]);

  useEffect(() => {
    const pusher = new Pusher("33b9c1445a837cef17f5", { cluster: "eu" });

    // Subscribe to Pusher channel
    const subscription = pusher.subscribe(channelName);
    subscription.bind("pusher:subscription_succeeded", () => {
      subscription.bind("message", (data) => {
        handleReceiveMessage(data);
      });
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, []);

  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  useEffect(() => {
    if (sound) {
      return () => sound.unloadAsync();
    }
  }, [sound]);

  const handleReceiveMessage = (data) => {
    console.log("data received =>", data);
    setMessages((messages) => [...messages, data]);
  };

  const handleSendMessage = () => {
    if (!messageText && !recordingUri) {
      return;
    }

    let payload = {};
    let headers = {};

    if (messageText) {
      payload = JSON.stringify({
        text: messageText,
        username,
        createdAt: new Date(),
        type: "text",
        roomName,
      });

      headers = { "Content-Type": "application/json" };
    } else if (recordingUri) {
      payload = new FormData();

      payload.append("audio", {
        uri: recordingUri,
        name: "audio.m4a",
        type: "audio/m4a",
      });

      payload.append("username", username);
      payload.append("createdAt", new Date().toISOString());
      payload.append("type", "audio");
      payload.append("roomName", roomName);
    }

    fetch(`${BACKEND_ADDRESS}message`, {
      method: "POST",
      headers,
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setMessageText("");
          setRecordingUri(null);
        }
      });
  };

  const startRecording = async () => {
    const { recording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    setRecording(recording);
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecordingUri(uri);
      setRecording(null);
    }
  };

  const playRecording = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({
      uri,
      overrideFileExtensionAndroid: "m4a",
    });
    setSound(sound);

    await sound.playAsync();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.banner}>
        <MaterialIcons
          name="keyboard-backspace"
          color="#ffffff"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.greetingText}>
         {roomName}  🐾
        </Text>
      </View>

      <View style={styles.inset}>
        <ScrollView style={styles.scroller}>
          {messages.map((message, i) => (
            <View
              key={i}
              style={[
                styles.messageWrapper,
                {
                  ...(message.username === username
                    ? styles.messageSent
                    : styles.messageRecieved),
                },
              ]}
            >
              <View
                style={[
                  styles.message,
                  {
                    ...(message.username === username
                      ? styles.messageSentBg
                      : styles.messageRecievedBg),
                  },
                ]}
              >
                {message.type === "audio" ? (
                  <TouchableOpacity onPress={() => playRecording(message.url)}>
                    <MaterialIcons
                      name="multitrack-audio"
                      size={24}
                      style={styles.messageText}
                    />
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.messageText}>{message.text}</Text>
                )}
              </View>
              <Text style={styles.timeText}>
                {new Date(message.createdAt).getHours()}:
                {String(new Date(message.createdAt).getMinutes()).padStart(
                  2,
                  "0"
                )}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          {recording ? (
            <TextInput value="Recording..." style={styles.input} />
          ) : (
            <TextInput
              onChangeText={(value) => setMessageText(value)}
              value={recordingUri ? "Audio message" : messageText}
              style={styles.input}
            />
          )}
          <TouchableOpacity
            onPressIn={() => startRecording()}
            onPressOut={() => stopRecording()}
            style={styles.recordButton}
          >
            <MaterialIcons name="mic" color="#ffffff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSendMessage()}
            style={styles.sendButton}
          >
            <MaterialIcons name="send" color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
  },
  inset: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "#ffffff",
    width: "100%",
    paddingTop: 20,
    position: "relative",
    borderTopColor: "#ffe099",
    borderLeftColor: "#ffe099",
    borderRightColor: "#ffe099",
    borderTopWidth: 4,
    borderRightWidth: 0.1,
    borderLeftWidth: 0.1,
  },
  banner: {
    width: "100%",
    height: "15%",
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  greetingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
  },
  message: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 24,
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: "65%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  messageWrapper: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  messageRecieved: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  messageSent: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageSentBg: {
    backgroundColor: "#ffad99",
  },
  messageRecievedBg: {
    backgroundColor: "#d6fff9",
  },
  messageText: {
    color: "#506568",
    fontWeight: "400",
  },
  timeText: {
    color: "#506568",
    opacity: 0.5,
    fontSize: 10,
    marginTop: 2,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    justifySelf: "flex-end",
    alignContent: "flex-start",
    marginBottom: 30,
    marginTop: "auto",
    background: "transparent",
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    width: "60%",
    padding: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  recordButton: {
    borderRadius: 50,
    padding: 16,
    backgroundColor: "#ff5c5c",
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  sendButton: {
    borderRadius: 50,
    padding: 16,
    backgroundColor: "#ffe099",
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  scroller: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
