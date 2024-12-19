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

const pusher = new Pusher("PUSHER_KEY", { cluster: "PUSHER_CLUSTER" });
const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ChatScreen({ navigation, route: { params } }) {
  const { roomName } = params;
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);

  const token = useSelector((state) => state.user.value?.token)

  const channelName = `room-${roomName.replace(/\s+/g, "-").toLowerCase()}`;

  const getUserName = async () => {
    try {
      const response = await fetch(`${BACKEND_ADDRESS}dogName/${token}`);
      const data = await response.json();
      setUsername(data?.dogName[0])
  
      if (data.dogName) {
        const joinRes = await fetch(`${BACKEND_ADDRESS}users/${data?.dogName[0]}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName }),
        });
  
        if (!joinRes.ok) {
          console.error("Erreur lors de la jonction de la salle");
        }
      }
    } catch (error) {
      console.error("Erreur dans getUserName :", error);
    }
  };
  

  useEffect(() => {

    getUserName()

    // Subscribe to Pusher channel
    const subscription = pusher.subscribe(channelName);
    subscription.bind("pusher:subscription_succeeded", () => {
      subscription.bind("message", handleReceiveMessage);
    });

    // Cleanup on unmount
    return async () => {
      try {
        await fetch(`${BACKEND_ADDRESS}users/${username}`, {
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
          Room: {roomName} | Welcome {username} 👋
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
