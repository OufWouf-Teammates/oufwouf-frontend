import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
} from "react-native";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function DogProfileScreen({ navigation }) {
  const token = useSelector((state) => state.user.value?.accessToken);
  const [dog, setDog] = useState({
    name: "Reptincel",
    id: "26147124561461242",
    uri: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dog_Breeds.jpg",
    race: "Shiba",
    sex: "male",
    anniversaire: "30/08/2003",
    infosGeneral: "connard, enculé, mal aimé",
    personality: "avare, pauvre",
    vaccins: [
      { name: "sida", rappel: true, date: "21/11/2010" },
      { name: "lediable", rappel: false, date: "11/87/2036" },
    ],
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(NEXT_PUBLIC_BACKEND_URL + `?token=${token}`);

      const data = await response.json();

      setDog(data);
    })();
  }, []);
  return (
    <ImageBackground
      source={require("../assets/BG_App.png")}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.arrow} onPress={() => navigation.goBack()}>
          arrow
        </Text>
        <Image
          source={{
            uri: dog.uri,
          }}
          style={styles.dogPic}
          resizeMode="stretch"
        />
        <Text>{dog.name}</Text>
        {/* Infos du carnet */}
        <View style={styles.infos}>
          {/* ID */}
          <View style={styles.infoBox}>
            <Text>ID: {dog.id} </Text>
          </View>
          {/* Race */}
          <View style={styles.infoBox}>
            <Text>Race: {dog.race} </Text>
          </View>
          {/* Moitié de boite */}
          <View style={styles.demiBox}>
            {/* Sex */}
            <View style={styles.infoDemiBox}>
              <Text>Sex: {dog.sex} </Text>
            </View>
            {/* Anniversaire */}
            <View style={styles.infoDemiBox}>
              <Text> {dog.anniversaire} </Text>
            </View>
          </View>

          {dog.vaccins &&
            dog.vaccins.map((e, index) => (
              <View key={index} style={styles.vaccins}>
                {/* Vaccin si besoin */}
                <View style={styles.infoBox}>
                  <Text>Vaccin:{e.name}</Text>
                </View>

                <View style={styles.demiBox}>
                  {/* Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text>Rappel: {e.rappel ? "oui" : "non"} </Text>
                  </View>
                  {/* Date de Rappel */}
                  <View style={styles.infoDemiBox}>
                    <Text> {e.date} </Text>
                  </View>
                </View>
              </View>
            ))}

          {/* Infos général */}
          <View style={styles.infoBox}>
            <Text>Informations général: {dog.infosGeneral}</Text>
          </View>
          {/* Personnalité */}
          <View style={styles.infoBox}>
            <Text>Traits de personnalité: {dog.personality}</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    alignItems: "center",
  },
  dogPic: {
    width: "40%",
    aspectRatio: 1,
    borderRadius: 500,
  },
  infos: {
    width: "80%",
    gap: 20,
  },
  demiBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  infoDemiBox: {
    width: "40%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  arrow: {
    position: "absolute",
    top: 70,
    left: 40,
  },
  vaccins: {
    gap: 15,
  },
});
