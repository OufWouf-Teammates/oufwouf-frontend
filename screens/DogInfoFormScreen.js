import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";

const DogInfoFormScreen = () => {
  // lien des fetchs //

  const apiRace = `${process.env.EXPO_PUBLIC_BACKEND_URL}races`;
  const apiVaccins = `${process.env.EXPO_PUBLIC_BACKEND_URL}vaccinsGeneraux`;
  const apiNewDog = `${process.env.EXPO_PUBLIC_BACKEND_URL}dogs`;
  const apiNewVaccins = `${process.env.EXPO_PUBLIC_BACKEND_URL}vaccinsPersos`;

  // toutes les données du chien //

  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [robe, setRobe] = useState("");
  const [dogId, setDogId] = useState("");
  const [personnality, setPersonnality] = useState("");
  const [isBirthday, setIsBirthday] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState("");
  const [isVaccin, setIsVaccin] = useState(false);
  const [selectedVaccin, setSelectedVaccin] = useState("");
  const [selectedGender, setSelectedGender] = useState("mâle");
  const [selectedRappel, setSelectedRappel] = useState("Non");

  // gestion des fetchs pour la race et les vaccins //

  const [vaccination, setVaccination] = useState("");
  const [suggestionsVaccin, setSuggestionVaccin] = useState([]);
  const [loadingVaccin, setLoadingVaccin] = useState(false);

  const [race, setRace] = useState("");
  const [suggestionsRace, setSuggestionRace] = useState([]);
  const [loadingRace, setLoadingRace] = useState(false);

  // gestion de la couleur des inputs //

  const [focusedField, setFocusedField] = useState(null);

  // gestion des options pour la phtoto de profil //

  const { showActionSheetWithOptions } = useActionSheet();

  // permissions pour utiser l'appareil photo et la galerie //

  useEffect(() => {
    const askPermissions = async () => {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission = await MediaLibrary.requestPermissionsAsync();

      if (
        cameraPermission.status !== "granted" ||
        mediaPermission.status !== "granted"
      ) {
        alert("Permission to access camera or media library is required");
      }
    };

    askPermissions();
  }, []);

  // fonction pour fetch les suggestions de vaccin et race //

  const fetchSuggestionsVaccins = async (query) => {
    if (!query) {
      setSuggestionVaccin([]);
      return;
    }

    setLoadingVaccin(true);

    try {
      const response = await fetch(`${apiVaccins}?search=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        setSuggestionVaccin(data.data);
      } else {
        setSuggestionVaccin([]);
      }
    } catch (error) {
      console.error("ERROR pour afficher les suggestions", error.message);
    } finally {
      setLoadingVaccin(false);
    }
  };

  const fetchSuggestionsRace = async (query) => {
    if (!query) {
      setSuggestionRace([]);
      return;
    }

    setLoadingRace(true);
    console.log(`${apiRace}${query}`);

    try {
      const response = await fetch(`${apiRace}?search=${query}`);
      console.log(`${apiRace}?search=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      if (data && Array.isArray(data.data)) {
        setSuggestionRace(data.data);
      } else {
        setSuggestionRace([]);
      }
    } catch (error) {
      console.error("ERROR pour afficher les suggestions", error.message);
    } finally {
      setLoadingRace(false);
    }
  };

  // maj de l'input et fetch //

  const handleInputVaccins = (value) => {
    setVaccination(value);
    fetchSuggestionsVaccins(value);
  };

  const handleInputRace = (value) => {
    setRace(value);
    fetchSuggestionsRace(value);
  };

  // Gestion de la sélection des inputs //

  const handleSuggestionVaccin = (suggestionsVaccin) => {
    setVaccination(suggestionsVaccin);
    setSuggestionVaccin([]);
  };

  const handleSuggestionRace = (suggestionsRace) => {
    setRace(suggestionsRace);
    setSuggestionRace([]);
  };
  // fonction pour faire disparaitre le clavier //

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Fonction pour changer la couleur de l'input quand il est focus //

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  // Fonction pour gérer la perte de focus //

  const handleBlur = () => {
    setFocusedField(null);
  };

  // modale calendrier anniversaire //

  const handleBirthday = (date) => {
    setSelectedBirthday(date.dateString);
    setIsBirthday(false);
  };
  // modale calendrier vaccin //

  const handleVaccin = (date) => {
    setSelectedVaccin(date.dateString);
    setIsVaccin(false);
  };

  // selection du choix de prise de photo de profil (appareil ou galerie) //

  const handleChooseImage = () => {
    const options = ["Prenez une photo", "Sélectionnez une photo", "Annuler"];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      { options, cancelButtonIndex },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          ImagePicker.launchCameraAsync({
            mediaType: "photo",
            saveToPhotos: true,
          }).then(handleImageSelection);
        } else if (buttonIndex === 1) {
          ImagePicker.launchImageLibraryAsync({
            mediaType: "photo",
            quality: 1,
            selectionLimit: 1,
          }).then(handleImageSelection);
        }
      }
    );
  };

  // reception de la photo de profil //

  const handleImageSelection = (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.errorCode) {
      console.error("Error:", response.errorMessage);
    } else if (response.assets && response.assets[0].uri) {
      setImageUri(response.assets[0].uri);
    } else {
      console.error("No image selected or error occurred");
    }
  };

  // bouton submit et gestion des données soumises //

  const handleSubmit = async () => {
    try {
      if (!imageUri) {
        alert("Veuillez ajouter une photo de profil.");
        return;
      }

      if (!name || !race || !selectedBirthday || !selectedGender) {
        alert("Hep hep hep ! Vous n'avez pas rempli les champs obligatoires !");
        return;
      }

      const response = await fetch(apiNewDog, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          imageUri: imageUri,
          name: name,
          ID: dogId,
          race: race,
          sex: selectedGender,
          birthday: selectedBirthday,
          infos: info,
          personality: personnality,
        }),
      });
      const data = await response.json();

      if (data.result) {
        const response = await fetch(apiNewVaccins, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            name: vaccination,
            rappel: selectedRappel,
            date: selectedVaccin,
          }),
        });

        const date = await response.json();

        if (date.result) {
          console.log("YAY new vaccins");
        } else {
          console.log("nauuur no new vaccins");
        }

        console.log("Wooftastique!");
        setName("");
        setRace("");
        setRobe("");
        setVaccination("");
        setInfo("");
        setPersonnality("");
        setSelectedBirthday("");
        setSelectedVaccin("");
        setDogId("");
        setImageUri(null);
      } else {
        console.log("Naaauur");
      }

      console.log({
        name,
        race,
        robe,
        vaccination,
        selectedBirthday,
        selectedVaccin,
        selectedGender,
        selectedRappel,
        info,
        personnality,
        imageUri,
        dogId,
      });
    } catch {
      console.error(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        style={styles.container}
        source={require("../assets/BG_App.png")}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SafeAreaView style={styles.innerContainer}>
            <TouchableOpacity onPress={handleChooseImage}>
              <Image
                style={styles.image}
                source={imageUri && { uri: imageUri }}
              />
            </TouchableOpacity>
            <View style={styles.form}>
              <Text>Nom du chien<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "name" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                onChangeText={(value) => setName(value)}
                value={name}
              />

              <Text>Race du chien<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "race" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("race")}
                onBlur={handleBlur}
                onChangeText={(value) => handleInputRace(value)}
                value={race}
                placeholder="Rechercher..."
              />
              {loadingRace && <Text style={styles.loading}>Chargement...</Text>}
              {suggestionsRace.length > 0 && (
                <FlatList
                  data={suggestionsRace}
                  keyExtractor={(item, index) => `${item._id}-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionRace(item.name)}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <Text>ID<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "id" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("id")}
                onBlur={handleBlur}
                onChangeText={(value) => setDogId(value)}
                value={dogId}
              />
              <Text>Sexe du chien<Text style={{ color: 'red' }}>*</Text></Text>
              <Picker
                selectedValue={selectedGender}
                onValueChange={(itemValue) => setSelectedGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Mâle" value="mâle" />
                <Picker.Item label="Femelle" value="femelle" />
              </Picker>

              <Text>Date de naissance<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "anniv" && styles.inputFocused,
                ]}
                onBlur={handleBlur}
                placeholder="Choisissez une date"
                value={selectedBirthday}
                onFocus={() => {
                  dismissKeyboard();
                  setIsBirthday(true);
                  handleFocus("anniv");
                }}
              />

              <Text>Couleur de robe du chien</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "robe" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("robe")}
                onBlur={handleBlur}
                onChangeText={(value) => setRobe(value)}
                value={robe}
              />

              <Text>Vaccinations du chien</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "Vaccination" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("Vaccination")}
                onBlur={handleBlur}
                onChangeText={(value) => handleInputVaccins(value)}
                value={vaccination}
                placeholder="Rechercher..."
              />
              {loadingVaccin && (
                <Text style={styles.loading}>Chargement...</Text>
              )}
              {suggestionsVaccin.length > 0 && (
                <FlatList
                  data={suggestionsVaccin}
                  keyExtractor={(item, index) => `${item._id}-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionVaccin(item.name)}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}

              <Text>Rappel</Text>
              <Picker
                selectedValue={selectedRappel}
                onValueChange={(itemValue) => setSelectedRappel(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Non" value="Non" />
                <Picker.Item label="Oui" value="Oui" />
              </Picker>

              <Text>Date de vaccination</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "vaccins" && styles.inputFocused,
                ]}
                onBlur={handleBlur}
                placeholder="Choisissez une date"
                value={selectedVaccin}
                onFocus={() => {
                  dismissKeyboard();
                  setIsVaccin(true);
                  handleFocus("vaccins");
                }}
              />

              <Text>Information général </Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "info" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("info")}
                onBlur={handleBlur}
                onChangeText={(value) => setInfo(value)}
                value={info}
              />

              <Text>Traits de personalité</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "personnality" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("personnality")}
                onBlur={handleBlur}
                onChangeText={(value) => setPersonnality(value)}
                value={personnality}
              />

              {/* modale calendrier anniv */}

              {isBirthday && (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isBirthday}
                  onRequestClose={() => setIsBirthday(false)}
                >
                  <TouchableOpacity
                    style={styles.modalContent}
                    activeOpacity={1}
                    onPress={() => setIsBirthday(false)}
                  >
                    <View style={styles.calendarContainer}>
                      <Calendar
                        onDayPress={handleBirthday}
                        markedDates={{
                          [selectedBirthday]: {
                            selected: true,
                            selectedColor: "blue",
                          },
                        }}
                        monthFormat={"yyyy MM "}
                        hideExtraDays={true}
                        firstDay={1}
                        dayNames={[
                          "Dim",
                          "Lun",
                          "Mar",
                          "Mer",
                          "Jeu",
                          "Ven",
                          "Sam",
                        ]}
                        monthNames={[
                          "Janvier",
                          "Février",
                          "Mars",
                          "Avril",
                          "Mai",
                          "Juin",
                          "Juillet",
                          "Août",
                          "Septembre",
                          "Octobre",
                          "Novembre",
                          "Décembre",
                        ]}
                        locale={"fr"}
                      />
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setIsBirthday(false)}
                      >
                        <Text style={styles.closeButtonText}>Fermer</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}

              {/* modale calendrier vaccins */}

              {isVaccin && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={handleVaccin}
                    markedDates={{
                      [selectedVaccin]: {
                        selected: true,
                        selectedColor: "blue",
                      },
                    }}
                    monthFormat={"yyyy MM"}
                    hideExtraDays={true}
                    firstDay={1}
                    dayNames={["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]}
                    monthNames={[
                      "Janvier",
                      "Février",
                      "Mars",
                      "Avril",
                      "Mai",
                      "Juin",
                      "Juillet",
                      "Août",
                      "Septembre",
                      "Octobre",
                      "Novembre",
                      "Décembre",
                    ]}
                    locale={"fr"}
                  />
                </View>
              )}
            </View>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <Text> Soumettre </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // padding: 20,
  },
  innerContainer: {
    width: "100%",
    // justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#4D4D4D",
    backgroundColor: "#4D4D4D",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    opacity: 0.6,
  },
  inputFocused: {
    backgroundColor: "#F3E882",
    borderColor: "#FBBC05",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  calendarContainer: {
    position: "absolute",
    top: 150,
    zIndex: 1000,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  picker: {
    height: 60,
    marginBottom: 15,
  },
  loading: {
    fontSize: 14,
    color: "#999",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default () => (
  <ActionSheetProvider>
    <DogInfoFormScreen />
  </ActionSheetProvider>
);
