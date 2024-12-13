import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import AppLoading from "expo-app-loading"

const GOOGLE_MAP_PLATEFORM_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_PLATEFORM_API_KEY;

const SearchBar = ({gotToLatLng, createRedPoint, navigation}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    //Nécessaire pour la configuration des fonts
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  })
  if (!fontsLoaded) {
    return <AppLoading />
  }

    const choseAddress = async (addressDetails) => {
        const placeId = addressDetails?.place_id;
        if(placeId) {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAP_PLATEFORM_API_KEY}&language=fr`;
            try {
                const response = await fetch(url);
              const data = await response.json();

              
              gotToLatLng(data.result.geometry.location);
              setQuery(data.result.formatted_address);
              setResults([]);

              createRedPoint(data.result.geometry.location); // Affiche le marker rouge


            } catch (error) {
              console.error(error);
              
            }
          }
        }

    const gotToAddress = async () => {
        let theResult = await lookLatLongAddFromText(query);
        let chosenAddress = await choseAddress(theResult[0]);
    }
    const goToSettings = () => {
      navigation.navigate("Settings")
    }
  
    const fetchPlaces = async (text) => {
      setQuery(text);
         console.log(text);
         let theResult = await lookLatLongAddFromText(text);
      setResults(theResult);
    };

     const lookLatLongAddFromText = async (text) => {
        console.log(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${GOOGLE_MAP_PLATEFORM_API_KEY}&language=fr&components=country:fr`);
        if (text.length > 2) {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${GOOGLE_MAP_PLATEFORM_API_KEY}&language=fr&components=country:fr`;
            try {
                const response = await fetch(url);
              const data = await response.json();
              return data.predictions;


            } catch (error) {
              console.error(error);
              return [];
            }
          } else {
            return [];
          }
    }

  return (
    <View style={styles.search}>
      <View style={styles.buttons}>
        <TextInput
        style={styles.input}
        placeholder="Rechercher une adresse..."
        value={query}
        onChangeText={fetchPlaces}
        placeholderTextColor="lightgrey" // Déplacé ici
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => gotToAddress()}
        >
          <FontAwesome name="search" size={16} color="#0639DB" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSettings}
          onPress={() => goToSettings()}
        >
          <FontAwesome name="user" size={16} color="#0639DB" style={styles.icon} />
        </TouchableOpacity>

      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        style={styles.listView}
        renderItem={({ item }) => (
          <Text style={styles.row} onPress={() => choseAddress(item)}>{item.description}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "90%", // Prenez tout l'espace disponible
    flex:1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttons: {
    width: "90%", // Prenez tout l'espace disponible
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  }, 
  input: {
    width: "87%",
    fontSize: 16,
    height: 45,
    paddingHorizontal: 10,
    borderRadius: 25,
    color:"#0639DB",
    fontFamily: "Lexend_400Regular",
    backgroundColor: "#fff",
    elevation: 2, // Équivaut à box-shadow en React Native
  },
  listView: {
    fontSize: 12, // Taille du texte
    backgroundColor: "#fff",
    color:"#000",
    borderRadius: 8,
    marginTop: 5,
    flexGrow: 0, // Empêche le listView d'occuper tout l'espace vertical
    flexShrink: 1,
  },
  row: {
    flex:1,
    padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    color: "#101626",
    fontWeight:"bold"
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  button: {
    backgroundColor: "#FFF",
    paddingBottom: 4,
    height: 35,
    width: '10%',
    borderRadius: 25,
    position: "fixed",
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    right: 40,
    marginTop: 5,
    elevation: 2, // Équivaut à box-shadow en React Native
  },
  buttonHover: {
    transform: [{ scale: 1.1 }],
    backgroundColor: "blue",
  },
  icon: {
    alignSelf: 'center',
  },
  buttonSettings: {
    backgroundColor: "#FFF",
    height: 45,
    width: '15%',
    borderRadius: 25,
    position: "fixed",
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    right: 0,
    elevation: 2, // Équivaut à box-shadow en React Native
  },
});

export default SearchBar;