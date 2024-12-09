import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";

const DogInfoFormScreen = () => {
  const [imageUri, setImageUri] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fBhxwxhu_RCuje9dlhLYtPotRfn4E5UN3A&s"
  );
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
  const { hasPermission, requestPermission } = useCameraPermissions();
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    if (hasPermission === false) {
      requestPermission();
    }
  }, [hasPermission]);

  // Fonction pour fermer le clavier //

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // selection de date //

  const handleBirthday = (date) => {
    setSelectedBirthday(date.dateString);
    setIsBirthday(false);
  };

  const handleVaccin = (date) => {
    setSelectedVaccin(date.dateString);
    setIsVaccin(false);
  };

  // choix de selection de photo de profil //

  const handleChooseImage = () => {
    const options = ["Prenez une photo", "Séléctionnez une photo", "Annuler"];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      { options, cancelButtonIndex },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          launchCamera(
            { mediaType: "photo", saveToPhotos: true },
            handleImageSelection
          );
        } else if (buttonIndex === 1) {
          launchImageLibrary(
            { mediaType: "photo", quality: 1, selectionLimit: 1 },
            handleImageSelection
          );
        }
      }
    );
  };

 // recup de la photo de profil //

  const handleImageSelection = (response) => {
    if (response.assets && response.assets[0].uri) {
      setImageUri(response.assets[0].uri);
    } else {
      console.error("Aucune image sélectionnée ou une erreur est survenue");
    }
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
            style={styles.input}
            onChangeText={(value) => setName(value)}
            value={name}
          />

          <Text>Race du chien*</Text>
          <TextInput
            style={styles.input}
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
            style={styles.input}
            placeholder="Choisissez une date"
            value={selectedBirthday}
            onFocus={() => {
              dismissKeyboard();
              setIsBirthday(true);
            }}
          />

          <Text>Couleur de robe du chien</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setRobe(value)}
            value={robe}
          />
          <Text>Vaccinations du chien</Text>
          <TextInput
            style={styles.input}
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
            style={styles.input}
            placeholder="Choisissez une date"
            value={selectedVaccin}
            onFocus={() => {
              dismissKeyboard();
              setIsVaccin(true);
            }}
          />

          <Text>Information général </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setInfo(value)}
            value={info}
          />

          <Text>Traits de personalité</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setPersonnality(value)}
            value={personnality}
          />
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
        <TouchableOpacity>
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
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
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
    top: 80,
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
    height: 50,
  },
});

export default () => (
  <ActionSheetProvider>
    <DogInfoFormScreen />
  </ActionSheetProvider>
);

