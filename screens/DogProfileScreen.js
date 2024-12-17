import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet"
import * as ImagePicker from "expo-image-picker"
import * as MediaLibrary from "expo-media-library"
import { useNavigation } from '@react-navigation/native';

const DogProfileScreen = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.user.value.token)
  const [dog, setDog] = useState({})
  const [imageUri, setImageUri] = useState(null)
    const apiNewDog = `${process.env.EXPO_PUBLIC_BACKEND_URL}dogs`
  // gestion des options pour la phtoto de profil //

  const { showActionSheetWithOptions } = useActionSheet()

  useEffect(() => {
    const askPermissions = async () => {
      try {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        const mediaPermission = await MediaLibrary.requestPermissionsAsync();
    
        if (cameraPermission.status !== "granted" || mediaPermission.status !== "granted") {

        }
      } catch (error) {
        console.error("Permission error:", error);
      }
    };

    askPermissions()
  }, [])

    //Nécessaire pour la configuration des fonts
    const [fontsLoaded] = useFonts({
      Lexend_400Regular,
      Lexend_700Bold,
    })

    useEffect(() => {
      async function hideSplashScreen() {
        if (fontsLoaded) {
          await SplashScreen.hideAsync()
        }
      }
      hideSplashScreen();


    (async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}dogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      setDog(data.dog)
    })();

    }, [fontsLoaded])
  
    if (!fontsLoaded) {
      return null // Rien n'est affiché tant que les polices ne sont pas chargées
    }

    
    const handleChooseImage = async () => {
      const options = ["Prenez une photo", "Sélectionnez une photo", "Annuler"];
      const cancelButtonIndex = options.length - 1;
    
      showActionSheetWithOptions(
        { options, cancelButtonIndex },
        async (buttonIndex) => {
          let result = null;
    
          try {
            if (buttonIndex === 0) {
              result = await ImagePicker.launchCameraAsync({
                mediaType: "photo",
                saveToPhotos: true,
              });
              handleImageSelection(result);
            } else if (buttonIndex === 1) {
              result = await ImagePicker.launchImageLibraryAsync({
                mediaType: "photo",
                quality: 1,
                selectionLimit: 1,
              });
              handleImageSelection(result);
            }
          } catch (error) {
            console.error("Erreur lors de la sélection d'image :", error.message);
          }
        }
      );
    };
    
    
    const handleImageSelection = async (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        console.log("Image sélectionnée :", selectedImageUri);
    
        setImageUri(selectedImageUri); // Mettre à jour l'URI de l'image dans l'état local
    
        try {
          // Créer un formulaire avec uniquement l'image sélectionnée
          const formData = new FormData();
    
          formData.append("photoFromFront", {
            uri: selectedImageUri,  // Utiliser l'URI de l'image sélectionnée
            type: "image/jpeg",      // Assurez-vous du type correct selon l'image
            name: "dog_image.jpg",   // Le nom du fichier
          });
    
          // Effectuer l'appel réseau pour mettre à jour l'image
          const response = await fetch(`${apiNewDog}/modifier`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`, // Assurez-vous que `token` est bien défini
            },
            body: formData,
          });
    
          const responseData = await response.json();
          console.log("Réponse du serveur :", responseData);
    
          if (response.ok) {
            // Mettre à jour l'état local de l'image si nécessaire
            setDog((prevState) => ({
              ...prevState,
              uri: selectedImageUri, // Mettre à jour l'URI de l'image dans l'état
            }));
          } else {
            console.error("Erreur serveur :", responseData);
            alert("Erreur lors de la mise à jour. Veuillez réessayer.");
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi :", error.message);
          alert("Erreur lors de la mise à jour. Veuillez vérifier votre connexion.");
        }
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, width: "100%", paddingBottom: 20 }}>
      <SafeAreaView style={styles.innerContainer}>
        <TouchableOpacity  onPress={handleChooseImage}>
          <Image
            source={{
              uri: dog.uri,
            }}
            style={styles.dogPic}
          />
          <View style={styles.updatePhoto}>
            <FontAwesome name="pencil" size={15} color="#0639DB" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{dog.name}</Text>
        {/* Infos du carnet */}
        <View style={styles.infos}>
          {/* ID */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="id-badge"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{dog.ID} </Text>
          </View>
          {/* Race */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="paw"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{dog.race} </Text>
          </View>
          {/* Moitié de boite */}
          <View style={styles.demiBox}>
            {/* Sex */}
            <View style={styles.infoDemiBox}>
              <FontAwesome
                name="venus-mars"
                size={25}
                color="#0639DB"
                style={styles.iconsDemi}
              />
              <Text style={styles.dogInfo}>{dog.sex} </Text>
            </View>
            {/* Anniversaire */}
            <View style={styles.infoDemiBox}>
              <FontAwesome
                name="calendar"
                size={25}
                color="#0639DB"
                style={styles.iconsDemi}
              />
              <Text style={styles.dogInfo}>{dog.birthday} </Text>
            </View>
          </View>

          {dog.vaccins &&
            dog.vaccins.map((e, index) => (
              <View key={index} style={styles.vaccins}>
                {/* Vaccin si besoin */}
                <View style={styles.infoBox}>
                  <FontAwesome
                    name="heartbeat"
                    size={25}
                    color="#0639DB"
                    style={styles.icons}
                  />
                  <Text style={styles.dogInfo}>{e.name}</Text>
                </View>

                <View style={styles.demiBox}>
                  {/* Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text style={styles.dogInfo}>
                      <FontAwesome
                        name="bell"
                        size={25}
                        color="#0639DB"
                        style={styles.iconsDemi}
                      />
                      <View style={styles.dogInfo}>
                      <Text>{e.rappel ? "oui" : "non"}</Text>
                      </View>
                    </Text>
                  </View>
                  {/* Date de Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text>
                      <FontAwesome
                        name="calendar-check-o"
                        size={25}
                        color="#0639DB"
                        style={styles.iconsDemi}
                      />
                      <View style={styles.dogInfo}>
                      <Text>{e.date}</Text>
                      </View>
                    </Text>
                  </View>
                </View>
              </View>
            ))}

          {/* Infos général */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="info-circle"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{dog.infos}</Text>
          </View>
          {/* Personnalité */}
          <View style={styles.infoBox}>
            <FontAwesome
              name="smile-o"
              size={25}
              color="#0639DB"
              style={styles.icons}
            />
            <Text style={styles.dogInfo}>{dog.personality}</Text>
          </View>
        </View>
      </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 40,
    marginTop: 100,
  },
  dogPic: {
    width: "50%",
    marginBottom: 35,
    aspectRatio: 1,
    borderRadius: 500,
  },
  infos: {
    width: "80%",
    gap: 20,
  },
  demiBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  }, 
  updatePhoto: {
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 170,
    right: 0,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: 'center',
    width: "100%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },
  dogInfo: {
    width: "90%",
    fontFamily: "Lexend_400Regular",
  },
  infoDemiBox: {
    flexDirection: "row",
    alignItems: 'center',
    width: "48%",
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "white",
    borderRadius: 5,
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  vaccins: {
    gap: 15,
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: -40,
    fontFamily: "Lexend_700Bold",
  },
  icons: {
    marginRight: 15,
    marginLeft: 15,
  },
  iconsDemi: {
    marginRight: 5,
    marginLeft: 5,
  },
})

export default () => (
  <ActionSheetProvider>
    <DogProfileScreen />
  </ActionSheetProvider>
)
