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
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import AppLoading from "expo-app-loading";

import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome";
function Gallery() {
  const apiPicture = `${process.env.EXPO_PUBLIC_BACKEND_URL}pictures`;
  const userToken = useSelector((state) => state.user.value.token);

  const [galerie, setGalerie] = useState([]);
  const [editedDescription, setEditedDescription] = useState("");
  const [selectedUri, setSelectedUri] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchGalerie = async () => {
      try {
        const response = await fetch(apiPicture, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setGalerie(data.personalPicture);
      } catch (error) {
        console.error("ERROR pour afficher les photos", error.message);
      }
    };
    fetchGalerie();
  }, [isFocused]);


  const handleDescription = async (uri) => {
    try {
      const response = await fetch("", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          uri,
          description : editedDescription,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setEditedDescription('')
        setSelectedUri(null)
        console.log("yaay new des");
      } else {
        console.log("nauur no new des");
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <FontAwesome
          name="arrow-left"
          size={25}
          color="#0639DB"
          style={styles.iconBack}
          onPress={() => navigation.goBack()}
        />
        <ScrollView style={styles.scroll}>
          {galerie &&
            galerie.map((e) => (
              <View key={e._id} style={styles.card}>
                <Image
                  source={{ uri: e.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  {/* <TouchableOpacity>
                    <Text style={styles.textFont}>{e.city}</Text>
                  </TouchableOpacity > */}
                  <Text style={styles.textFont}>{e.description}</Text>
                  <TouchableOpacity onPress={() => handleDescription(e._id)}>
                  <FontAwesome name="pencil" size={15} color="#0639DB" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBack: {
    marginBottom: 50,
  },
  image: {
    width: 350,
    height: 350,
  },
  cardInfo: {
    gap: 20,
    flexDirection: "row",
    width: 350,
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 30,
    marginBottom: 50,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
  },
  textFont: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },
});

export default Gallery;
