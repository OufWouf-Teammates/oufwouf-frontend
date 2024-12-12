import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

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
        })()
      }, [])
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
                    ssource={dog?.uri ? { uri: dog.uri } : require("../assets/chien.png")}
                    style={styles.dogPic}
                />
                 <Text>{dog.name}</Text> 
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
        width: "80%",
    },
    in: {
        width: '100%',
        alignItems: 'center',
    },
    dogPic: {
        width: "40%",
        aspectRatio: 1,
        borderRadius: 500,
        borderWidth: 2,
        marginVertical: 20,
    },
  });