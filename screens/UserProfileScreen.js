import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserProfileScreen = ({ navigation, route }) => {
  const { dogName } = route.params;
  const [userData, setUserData] = useState(null);
  const [galerie, setGalerie] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiGetUser = `${process.env.EXPO_PUBLIC_BACKEND_URL}users/dogname`;
  const token = useSelector((state) => state.user.value.token);

  //Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  useEffect(() => {
    (async () => {
      const getDog = await fetch(`${apiGetUser}?name=${dogName}`);

      const response = await getDog.json();
      setUserData(response?.user);
      setGalerie(response?.photos);
    })();
  }, []);

  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}friends/request/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId }),
        }
      );

      const data = await response.json();
      if(data.result){
        Alert.alert("Succès !", "Demande de Woof envoyée !");
      } else {
        Alert.alert("Demande de Woof déjà envoyée !");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Image
          source={{
            uri: userData?.dogs[0].uri || "https://via.placeholder.com/150",
          }}
          style={styles.profilePicture}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]} // Si loading, applique le style désactivé
          onPress={() => sendFriendRequest(userData?._id)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Afficher un loader pendant l'envoi
          ) : (
            <Text style={styles.buttonText}>Ajouter</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{userData?.dogs[0].name}</Text>
        <Text style={styles.email}>{userData?.email}</Text>

        <Text style={styles.galleryTitle}>Galerie de photos</Text>
        <View style={styles.photoGallery}>
          {galerie &&
            galerie.map((e, i) => (
              <Image
                key={i}
                source={{ uri: e.uri }}
                style={styles.galleryPhoto}
              />
            ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
    marginTop: 100,
    paddingBottom: 50,
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#0639DB",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Lexend_700Bold",
    color: "#0639DB",
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#4D4D4D",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
    color: "#4D4D4D",
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Lexend_700Bold",
    color: "#0639DB",
    marginTop: 20,
    marginBottom: 10,
  },
  photoGallery: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryPhoto: {
    width: "48%",
    height: 100,
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#EAD32A",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff", // Couleur du texte en blanc
    fontSize: 16, // Taille du texte
    fontWeight: "bold", // Mettre le texte en gras
  },
  buttonDisabled: {
    backgroundColor: "#B0BEC5", // Couleur gris clair pour un bouton désactivé
    elevation: 0, // Pas d'ombre pour un bouton désactivé
    shadowOpacity: 0, // Pas d'ombre
  },
});

export default UserProfileScreen;
