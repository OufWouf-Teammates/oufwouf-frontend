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

  // toutes les données du chien //

  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [robe, setRobe] = useState("");
  const [race, setRace] = useState("");
  const [vaccination, setVaccination] = useState("");
  const [personnality, setPersonnality] = useState("");
  const [isBirthday, setIsBirthday] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState("");
  const [isVaccin, setIsVaccin] = useState(false);
  const [selectedVaccin, setSelectedVaccin] = useState("");
  const [selectedGender, setSelectedGender] = useState("mâle");
  const [selectedRappel, setSelectedRappel] = useState("Non");

  // gestion de la couleur des inputs //
  
  const [focusedField, setFocusedField] = useState(null);

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

  const handleSubmit = () => {
    if (!name || !race || !selectedBirthday || !selectedGender) {
      alert("Hep hep hep ! Vous n'avez pas rempli les champs obligatoires !");
      return;
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
    });

    setName("");
    setRace("");
    setRobe("");
    setVaccination("");
    setInfo("");
    setPersonnality("");
    setSelectedBirthday("");
    setSelectedVaccin("");
    setImageUri(null);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/BG_App.png")}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleChooseImage}>
          <Image style={styles.image} source={imageUri && { uri: imageUri }} />
        </TouchableOpacity>
        <View style={styles.form}>
          <Text>Nom du chien*</Text>
          <TextInput
            style={[styles.input, focusedField==='name' && styles.inputFocused]}
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
            onChangeText={(value) => setName(value)}
            value={name}
          />

          <Text>Race du chien*</Text>
          <TextInput
            style={[styles.input, focusedField==='race' && styles.inputFocused]}
            onFocus={() => handleFocus("race")}
            onBlur={handleBlur}
            onChangeText={(value) => setRace(value)}
            value={race}
          />
          <Text>Sexe du chien*</Text>
          <Picker
            selectedValue={selectedGender}
            onValueChange={(itemValue) => setSelectedGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Mâle" value="mâle" />
            <Picker.Item label="Femelle" value="femelle" />
          </Picker>

          <Text>Date de naissance*</Text>
          <TextInput
            style={[styles.input, focusedField==='anniv' && styles.inputFocused]}
            onBlur={handleBlur}
            placeholder="Choisissez une date"
            value={selectedBirthday}
            onFocus={() => {
              dismissKeyboard();
              setIsBirthday(true);
              handleFocus('anniv');
            }}
          />

          <Text>Couleur de robe du chien</Text>
          <TextInput
            style={[styles.input, focusedField==='robe' && styles.inputFocused]}
            onFocus={() => handleFocus("robe")}
            onBlur={handleBlur}
            onChangeText={(value) => setRobe(value)}
            value={robe}
          />
          <Text>Vaccinations du chien</Text>
          <TextInput
            style={[styles.input, focusedField==='Vaccination' && styles.inputFocused]}
            onFocus={() => handleFocus("Vaccination")}
            onBlur={handleBlur}
            onChangeText={(value) => setVaccination(value)}
            value={vaccination}
          />
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
            style={[styles.input, focusedField==='vaccins' && styles.inputFocused]}
            onBlur={handleBlur}
            placeholder="Choisissez une date"
            value={selectedVaccin}
            onFocus={() => {
              dismissKeyboard();
              setIsVaccin(true);
              handleFocus('vaccins');
            }}
          />

          <Text>Information général </Text>
          <TextInput
            style={[styles.input, focusedField==='info' && styles.inputFocused]}
            onFocus={() => handleFocus("info")}
            onBlur={handleBlur}
            onChangeText={(value) => setInfo(value)}
            value={info}
          />

          <Text>Traits de personalité</Text>
          <TextInput
            style={[styles.input, focusedField==='personnality' && styles.inputFocused]}
            onFocus={() => handleFocus("personnality")}
            onBlur={handleBlur}
            onChangeText={(value) => setPersonnality(value)}
            value={personnality}
          />

          {/* modale calendrier anniv */}

          {isBirthday && (
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleBirthday}
                markedDates={{
                  [selectedBirthday]: { selected: true, selectedColor: "blue" },
                }}
                monthFormat={"yyyy MM "}
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

          {/* modale calendrier vaccins */}

          {isVaccin && (
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleVaccin}
                markedDates={{
                  [selectedVaccin]: { selected: true, selectedColor: "blue" },
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  },
  inputFocused: {
    backgroundColor: "#F3E882",
    borderColor: "#FBBC05"
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
});

export default () => (
  <ActionSheetProvider>
    <DogInfoFormScreen />
  </ActionSheetProvider>
);
