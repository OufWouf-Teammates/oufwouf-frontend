import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  View,
  Text,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import AppLoading from "expo-app-loading";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function BookmarksScreen() {
  const navigation = useNavigation();
  const userToken = useSelector((state) => state.user.value.token);
  console.log(userToken)
  const [bookmarks, setBookmarks] = useState([]);

  const isFocused = useIsFocused();

  const fetchFavorite = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}map`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data)
      setBookmarks(data.favorite);
      console.log(bookmarks)

      
    } catch (error) {
      console.error("ERROR pour afficher les favories", error.message);
    }
  };

  useEffect(() => {
    fetchFavorite();
  }, [isFocused]);

  console.log(bookmarks)
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
        bookmarks.map((e) => (
          <View key={e._id} style={styles.card}>
            <Image
              source={{ uri: e.uri }}
              style={styles.image}
              resizeMode="cover"
            />
            <View>
              <View style={styles.cardInfos}>
                <View>
                  <Text style={styles.nameInfos}>{e.name}</Text>
                  <Text style={styles.cityInfos}>{e.city}</Text>
                </View>
                <FontAwesome name="bookmark" size={35} color="#EAD32A"/>
              </View>
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
  },
  iconBack: {
    position: "absolute",
    top: 50,
    left: 30
  },
  scroll: {
    marginTop: 80,

  },
  textFont: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    marginTop: 10,
    textAlign: "center",
  },
  content: {
    width: "100%",
  },
  cardInfos: {
    flexDirection: 'row',
    padding: 30,
    justifyContent: 'space-between'
  },
  card: {
    width: '90%',
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    alignItems: "left",
    marginHorizontal: 20,
  },
  nameInfos: {
    
  },
  image: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginBottom: 10,
  },
});

export default BookmarksScreen;
