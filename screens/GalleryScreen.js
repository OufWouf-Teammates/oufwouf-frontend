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


import { useEffect, useState } from "react"
import FontAwesome from 'react-native-vector-icons/FontAwesome';
function Gallery() {

  // Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  const apiPicture = `${process.env.EXPO_PUBLIC_BACKEND_URL}personalPicture`;
  // const userToken = useSelector((state) => state.value.token);
  const userToken = "HYG44QCUa6YAlUavvkHQYqBGlAVJUNfp";

  const [galerie, setGalerie] = useState([]);

  // const [galerie, setGalerie] = useState([
  //   {
  //     description: "voila cest la description tac",
  //     uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
  //   },
  //   {
  //     description: "voila cest la description tac",
  //     uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
  //   },
  //   {
  //     description: "voila cest la description tac",
  //     uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
  //   },
  //   {
  //     description: "voila cest la description tac",
  //     uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
  //   },
  //   {
  //     description: "voila cest la description tac",
  //     uri: "https://img.20mn.fr/2c2xoZqdQhu84Dmhb8ci9Sk/1444x920_le-berger-australien-est-le-chien-prefere-des-francais",
  //   },
  // ])



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
  }, []);

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
            galerie.map((e, i) => (
              <View key={i} style={styles.card}>
                <Image
                  source={{ uri: e.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View  style={styles.cardInfo}>
                  <TouchableOpacity>
                    <Text style={styles.textFont}>{e.city}</Text>
                  </TouchableOpacity>
                  <Text style={styles.textFont}>{e.description}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },  
  iconBack: {
    marginBottom: 50
  },
  image: {
    width: 350,
    height: 350,
  },
  cardInfo: {
    width: 350,
    backgroundColor: "white",
    padding: 50,
    marginBottom: 50,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
  },
  textFont: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  }
})


export default Gallery;
