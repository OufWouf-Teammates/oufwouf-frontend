import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const GOOGLE_MAP_PLATEFORM_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_PLATEFORM_API_KEY;

const SearchBar = ({gotToLatLng, createRedPoint}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

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
       <TextInput
      style={styles.input}
      placeholder="Rechercher une adresse..."
      value={query}
      onChangeText={fetchPlaces}
      placeholderTextColor="lightgrey" // Déplacé ici
      />
    <FlatList
      data={results}
      keyExtractor={(item) => item.place_id}
      style={styles.listView}
      renderItem={({ item }) => (
        <Text style={styles.row} onPress={() => choseAddress(item)}>{item.description}</Text>
      )}
    />
      <TouchableOpacity
        style={styles.button}
        onPress={() => gotToAddress()}
      >
        <Text style={styles.buttonText}>Aller</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    search: {
        width: "90%", // Prenez tout l'espace disponible
        flex:1,
      },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 2,
    borderRadius: 20,
    borderColor:"#CFD0D3",
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
    backgroundColor: "#101626",
    borderWidth: 1,
    paddingVertical: 12.5,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: "absolute",
    right: 0,
    elevation: 2, // Équivaut à box-shadow en React Native
  },
  buttonText: {
    color: "#fff", // Couleur du texte
    fontSize: 12, // Taille du texte
    textAlign: "center", // Centre horizontalement le texte
    fontWeight:"bold",
  },
  buttonHover: {
    transform: [{ scale: 1.1 }],
    backgroundColor: "blue",
  },
});

export default SearchBar;