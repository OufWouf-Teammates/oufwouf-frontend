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
import FontAwesome from "react-native-vector-icons/FontAwesome";

function BookmarksScreen() {
  const navigation = useNavigation();
  const apiPicture = `${process.env.EXPO_PUBLIC_BACKEND_URL}pictures`;
  const userToken = useSelector((state) => state.user.value.token);

  const [bookmarks, setBookmarks] = useState([]);

  const isFocused = useIsFocused();

  const fetchFavorite = async () => {
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
      setBookmarks(data.favorites);
    } catch (error) {
      console.error("ERROR pour afficher les photos", error.message);
    }
  };

  useEffect(() => {
    fetchGalerie();
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
          {bookmarks.map((bookmark) => (
            <View key={bookmark._id} style={styles.card}>
              <Image
                style={styles.image}
                source={{ uri: bookmark.uri }}
              />
              <Text style={styles.textFont}>{bookmark.name}</Text>
              <FontAwesome name="bookmark" size={35} color="#EAD32A" />
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
  },
  iconBack: {
    position: "absolute",
    top: 30,
    left: 30,
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
  scroll: {
    marginTop: 100,
    width: "100%",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginBottom: 10,
  },
});

export default BookmarksScreen;
