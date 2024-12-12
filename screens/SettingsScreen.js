import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
    useFonts,
    Lexend_400Regular,
    Lexend_700Bold,
  } from "@expo-google-fonts/lexend"
  import AppLoading from "expo-app-loading"

export default function SettingsScreen({ navigation }) {
    const token = useSelector((state) => state.user.value.token)
    const [dog, setDog] = useState({})
    useEffect(() => {
        ;(async () => {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}dogs`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
    
          const data = await response.json()
    
          setDog(data.dog[0])
          console.log(data.dog[0]);
          
        })()
    }, [])
    //Nécessaire pour la configuration des fonts
    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_700Bold,
    })
    if (!fontsLoaded) {
        return <AppLoading />
    }
 return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
        <SafeAreaView style={styles.innerContainer}>
            <TouchableOpacity
                style={styles.buttonSettings}
                onPress={() => navigation.goBack()}
            >
                <FontAwesome name="arrow-left" size={25} color="#0639DB" />
            </TouchableOpacity>
            <View style={styles.in}>
                <Image
                    source={dog?.uri ? { uri: dog.uri } : require("../assets/chien.png")}
                    style={[styles.dogPic, {width: 150, height: 150}]}
                />
                 <Text style={styles.name}>{dog?.name || 'Tuu'}</Text> 
                 <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    <FontAwesome name="paw" size={25} color="#0639DB" /> 
                    <Text style={styles.textButton}>Information personal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    <FontAwesome name="bell" size={25} color="#0639DB" /> 
                    <Text style={styles.textButton}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    <FontAwesome name="calendar" size={25} color="#0639DB" /> 
                    <Text style={styles.textButton}>Agenda</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonParam}
                    activeOpacity={0.8}
                >
                    <FontAwesome name="gear" size={25} color="#FFF" /> 
                    <Text style={styles.textButtonParam}>Paramètres</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        
    </ImageBackground>
 );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    innerContainer:{
        flex: 1,
        width: "90%",
        height: '100%',
    },
    in: {
        width: '100%',
        alignItems: 'center',
    },
    dogPic: {
        aspectRatio: 1,
        borderRadius: 500,
        marginVertical: 20,
    },
    name: {
        fontFamily: 'Lexend_700Bold',
        fontSize: 24,
    },
    button: {
        backgroundColor: "#FFF",
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        marginVertical: 10,
        padding: 15,
        borderRadius: 5,
      },
      textButton: {
        color: "#0639DB",
        fontSize: 16,
        width: "70%",
        fontFamily: "Lexend_400Regular",
      },
      buttonParam: {
        backgroundColor: "#0639DB",
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        marginVertical: 100,
        padding: 15,
        borderRadius: 5,
        
      },
      textButtonParam: {
        color: "#FFF",
        fontSize: 16,
        width: "70%",
        fontFamily: "Lexend_400Regular",
      },
  });