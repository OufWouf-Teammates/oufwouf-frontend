import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  ScrollView,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

const DiscussionsScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [dogs, setDogs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState("");
  const apiDog = `${process.env.EXPO_PUBLIC_BACKEND_URL}dogs/`;
  const apiRoom = `${process.env.EXPO_PUBLIC_BACKEND_URL}rooms/all`;
  const userToken = useSelector((state) => state.user.value?.token);
  const dogName = useSelector((state) => state.dog.value?.name);

  useEffect(() => {
    (async () => {
      const getRooms = await fetch(apiRoom, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const response = await getRooms.json();

      setRooms(response.rooms);
    })();
  }, []);

  const fetchDogs = async () => {
    try {
      const response = await fetch(`${apiDog}allDogs`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      setDogs(data); // Mettre à jour la liste complète des chiens
      setFilteredDogs(data); // Initialiser la liste filtrée avec tous les chiens au début
    } catch (error) {
      console.error("Erreur lors de la récupération des chiens :", error);
    } finally {
      setIsLoading(false);
    }
  };

  // This function will be triggered when typing in TextInput
  const handleSearch = (text) => {
    setSearch(text);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 500); // Wait 500ms after the user stops typing

    return () => clearTimeout(timer); // Clean up the timer on each render to prevent memory leaks
  }, [search]);

  useEffect(() => {
    if (debounceSearch) {
      const filtered = dogs.filter((dog) =>
        dog.name.toLowerCase().includes(debounceSearch.toLowerCase())
      );
      setFilteredDogs(filtered);
    } else {
      setFilteredDogs(dogs);
    }
  }, [debounceSearch, dogs]);

  // Charger les chiens lorsque le composant est monté
  useEffect(() => {
    fetchDogs();
  }, [userToken]);

  const handleDogPress = (dogName) => {
    navigation.navigate("userProfile", { dogName });
  };

  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBack}
        >
          <FontAwesome name="arrow-left" size={30} color="#0639DB" />
        </TouchableOpacity>

        <Text style={styles.discussionsTitle}>Social</Text>
        <View style={styles.discussions}>
          <TextInput
            placeholder="Rechercher un chien"
            style={styles.searchBar}
            value={search}
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)}
          />
          {isFocused && (
            <FlatList
              style={styles.dogList}
              data={filteredDogs.slice(0, 5)}
              dogList={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleDogPress(item.name)}
                  style={styles.dogItem}
                >
                  <FontAwesome name="paw" size={15} color="#0639DB" />
                  <Text style={styles.dogName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        <ScrollView style={styles.discussions}>
          {rooms &&
            rooms.map((room, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.chatCard}
                  onPress={() =>
                    navigation.navigate("Chat", { roomName: room.name })
                  }
                >
                  <Text style={styles.chatId}>{room.name}</Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  discussions: {
    padding: 10,
    width: "100%",
    paddingHorizontal: 30,
  },
  discussionsTitle: {
    fontSize: 36,
    textAlign: "left",
    color: "#0639DB",
    fontFamily: "Lexend_700Bold",
    padding: 30,
    marginTop: 70,
  },
  searchBar: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 10,
    color: "#000000",
    placeholderTextColor: "#999999",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  dogItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 3,
    width: "100%",
    zIndex: 1000,
  },
  dogName: {
    flexDirection: "row",
    fontSize: 20,
    color: "#4D4D4D",
    fontFamily: "Lexend_400Regular",
  },
  loader: {
    marginTop: 20,
  },
  dogList: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    color: "#0639DB",
    zIndex: 50,
  },
  chatCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  chatPreview: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
});

export default DiscussionsScreen;
