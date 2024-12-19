import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { format, setDate } from 'date-fns';
import {
    SafeAreaView,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
  } from "react-native"
  import FontAwesome from "react-native-vector-icons/FontAwesome"
  import {
    useFonts,
    Lexend_400Regular,
    Lexend_700Bold,
  } from "@expo-google-fonts/lexend"
  import * as SplashScreen from 'expo-splash-screen';
  import { useSelector } from "react-redux"
  import {
    ActionSheetProvider,
    useActionSheet,
  } from "@expo/react-native-action-sheet"
  import { useNavigation } from '@react-navigation/native';
  import { Picker } from "@react-native-picker/picker"

  
const NestedModalCalendar = (props) => {
    const apiVaccins = `${process.env.EXPO_PUBLIC_BACKEND_URL}vaccinsGeneraux`
    const apiNewVaccins = `${process.env.EXPO_PUBLIC_BACKEND_URL}vaccinsPersos`
  const token = useSelector((state) => state.user.value.token)
  const [isOuterModalVisible, setIsOuterModalVisible] = useState(false);
  const [isInnerModalVisible, setIsInnerModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedVaccin, setSelectedVaccin] = useState("")
  const [selectedRappel, setSelectedRappel] = useState(false)
  const [vaccination, setVaccination] = useState("")
  const [suggestionsVaccin, setSuggestionVaccin] = useState([])
  const [loadingVaccin, setLoadingVaccin] = useState(false)
  const [focusedField, setFocusedField] = useState(null)



  const showOuterModal = () => setIsOuterModalVisible(true);
  const hideOuterModal = () => setIsOuterModalVisible(false);
  const showInnerModal = () => setIsInnerModalVisible(true);
  const hideInnerModal = () => setIsInnerModalVisible(false);

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    setSelectedVaccin(date.dateString);
    hideInnerModal();
  };
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
    hideSplashScreen()
}, [fontsLoaded])

if (!fontsLoaded) {
    return null // Rien n'est affiché tant que les polices ne sont pas chargées
}
  const fetchSuggestionsVaccins = async (query) => {
    if (!query) {
      setSuggestionVaccin([])
      return
    }
    setLoadingVaccin(true)

    try {
      const response = await fetch(`${apiVaccins}?search=${query}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      if (data && Array.isArray(data.data)) {
        setSuggestionVaccin(data.data)
      } else {
        setSuggestionVaccin([])
      }
    } catch (error) {
      console.error("ERROR pour afficher les suggestions", error.message)
    } finally {
      setLoadingVaccin(false)
    }
  }
  const handleInputVaccins = (value) => {
    setVaccination(value)
    fetchSuggestionsVaccins(value)
  }

  const handleSuggestionVaccin = (suggestionsVaccin) => {
    setVaccination(suggestionsVaccin)
    setSuggestionVaccin([])
  }

  // Fonction pour changer la couleur de l'input quand il est focus //

  const handleFocus = (field) => {
    setFocusedField(field)
  }

  // Fonction pour gérer la perte de focus //

  const handleBlur = () => {
    setFocusedField(null)
  }
  const handleSubmit = async () => {
    try {
        const vaccinResponse = await fetch(apiNewVaccins, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dogId: props.dog,
            name: vaccination,
            rappel: selectedRappel,
            date: selectedVaccin,
          }),
        });      
        const data = await vaccinResponse.json();
        if (vaccinResponse.ok) {
          console.log('Vaccin ajouté avec succès:', data);
          setVaccination('')
          setSelectedRappel(false)
          setSelectedVaccin('')
          props.onUpdate();
        } else {
          console.error('Erreur lors de l\'ajout du vaccin:', data.error);
        }
      } catch (error) {
        console.error('Erreur réseau ou serveur:', error);
      }
  };



  return (
    <View>
      <TouchableOpacity style={styles.buttonModalSettings} onPress={showOuterModal}><Text style={styles.textStyleSettings}>Ajouter un vaccin à {props.name}</Text></TouchableOpacity>

      <Portal>
        <Modal visible={isOuterModalVisible} onDismiss={hideOuterModal} contentContainerStyle={styles.modalContainer}>
        <TouchableOpacity
                onPress={hideOuterModal}
                >
                <FontAwesome
                    name="close"
                    size={25}
                    color="#0639DB"
                    style={styles.close}
                />
        </TouchableOpacity>
          <Text style={styles.textStyleInfo}>Nouvelle vaccin</Text>
          <Text style={styles.text}>Vaccinations du chien</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "Vaccination" && styles.inputFocused,
                  ]}
                  onFocus={() => handleFocus("Vaccination")}
                  onBlur={handleBlur}
                  onChangeText={(value) => handleInputVaccins(value)}
                  value={vaccination}
                  placeholder="Rechercher"
                  placeholderTextColor="black"
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

                <Text style={styles.text}>Rappel</Text>
                <Picker
                  selectedValue={selectedRappel ? 'true' : 'false'}  // Convertir en string
                  onValueChange={(itemValue) => setSelectedRappel(itemValue === 'true')}  // Convertir en boolean
                  style={styles.picker}
                  mode={Platform.OS === 'ios' ? 'dropdown' : 'dialog'}
                >
                  <Picker.Item label="Non" value="false" />
                  <Picker.Item label="Oui" value="true" />
                </Picker>

                <Text style={styles.text}>Date de vaccination</Text>
            <Text style={styles.dateText}>
                Date sélectionnée : {selectedDate ? format(new Date(selectedDate), 'dd/MM/yyyy') : "Aucune date sélectionnée"}
            </Text>
          <TouchableOpacity onPress={showInnerModal} style={styles.buttonModalSettings}>
            <Text style={styles.textStyleSettings}>Choisir une date</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress={() => {
                hideOuterModal()
                handleSubmit()
            }} 
            style={styles.buttonModalSettings}>
            <Text style={styles.textStyleSettings}>Ajouter le vaccin</Text>
        </TouchableOpacity>

          <Modal visible={isInnerModalVisible} onDismiss={hideInnerModal} contentContainerStyle={styles.modalContainer}>
            <TouchableOpacity
                onPress={hideInnerModal}
                >
                <FontAwesome
                    name="close"
                    size={25}
                    color="#0639DB"
                    style={styles.close}
                />
            </TouchableOpacity>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={selectedDate ? {[selectedDate]: {selected: true, selectedColor: 'blue'}} : {}}
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
          </Modal>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 5,
  },
  textStyleInfo: {
    color: "#0639DB",
    width: "100%",
    textAlign: "center",
    fontFamily: "Lexend_700Bold",
    fontSize: 20,
    marginVertical: 10,
  },
  dateText: {
    color: "#0639DB",
    width: "90%",
    paddingLeft: 15,
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    marginVertical: 10,
  },
  buttonModalSettings: {
    backgroundColor: "#0639DB",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
    alignSelf: "center",
  },
  textStyleSettings: {
    color: "#FFF",
    width: "100%",
    textAlign: "center",
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
  },
  input: {
    height: 60,
    borderColor: "#4D4D4D",
    backgroundColor: "#BFBFBF",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: "black",
    fontSize: 16,
    width: "90%",
    borderBottomWidth: 1,
    fontFamily: "Lexend_400Regular",
    alignSelf: 'center',
  },
  inputFocused: {
    backgroundColor: "#F3E882",
    borderColor: "#FBBC05",
  },
  close: {
    marginBottom: 10,
  },
  text: {
    color: "#0639DB",
    width: "90%",
    paddingLeft: 15,
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    height: 60,
    marginTop: -60,
    paddingBottom: 200,
  },
  loading: {
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
    fontSize: 14,
    color: "black",
  },
  suggestionItem: {
    padding: 10,
    color: 'black',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: "rgb(227, 227, 227);",
    marginBottom: 5,
    borderRadius: 5,
  },
  suggestionText: {
    color: 'black',
    fontFamily: "Lexend_400Regular",
    fontSize: 16,
  },
});

export default NestedModalCalendar;