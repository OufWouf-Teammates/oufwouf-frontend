import React, { useEffect, useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Linking,
  TextInput,
} from "react-native"
import { FlatList } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend"
import AppLoading from "expo-app-loading"
import { useSelector } from "react-redux"

const InterestPoint = ({ navigation, route }) => {
  const { markerData } = route.params
  const [search, setSearch] = useState('')
  const [friends, setFriends] = useState([]); 
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiFriend = `${process.env.EXPO_PUBLIC_BACKEND_URL}friends`;
  console.log(markerData)

  const userToken = useSelector((state) => state.user.value?.token)
  console.log(userToken)

    useEffect(() => {
        const fetchFriends = async () => {
          try {
            const response = await fetch(apiFriend, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              });
            if (!response.ok) {
              throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }
            const data = await response.json();
            setFriends(data); // Mettre à jour la liste complète
            setFilteredFriends(data); // Initialiser la liste filtrée
          } catch (error) {
            console.error('Erreur lors de la récupération des amis :', error);
          } finally {
            setIsLoading(false); // Fin du chargement
          }
        };
    
        fetchFriends();
      }, []);

  // Gérer la recherche et filtrer la liste
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFriends(filtered);
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
      <ScrollView style={styles.discussions}>
        <Text style={styles.discussionsTitle}>Social</Text>
        <View>
            <TextInput
            placeholder="Rechercher un contact"
            style={styles.searchBar}
            value={search}
            onChangeText={handleSearch}
            />
            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id.toString()} // Remplacez `id` par la clé unique de vos objets
                renderItem={({ item }) => (
                <TouchableOpacity style={styles.item}>
                    <Text>{item.name}</Text>
                </TouchableOpacity>
                )}
            />
        </View>
        <View>
            <TouchableOpacity style={styles.button}>
                <FontAwesome name="plus" size={30} color="white" />
            </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -10,
  },
  iconBack: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 50,
  },
  discussions: {
    justifyContent: 'space-around',
    width: '100%'
  },
  discussionsTitle: {
    fontSize: 36,
    textAlign: 'left',
    color: "#0639DB"
  },
  searchBar: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
})

export default InterestPoint
