import React, { useEffect, useState } from "react";
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
  Alert,
  RefreshControl,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const RequestScreen = () => {

  const navigation = useNavigation();
  const token = useSelector((state) => state.user.value.token);
  const [request, setRequest] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchRequest = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}friends/requestList/${token}`
    );

    const data = await response.json();

    if (data.requestList && data.requestList.length > 0) {
      setRequest(data.requestList);
    } else {
      setRequest([]);
    }
  };

  useEffect(() => {
    if (!refreshing) {
      fetchRequest();
    }
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}friends/addFriend/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ decision: "accepted" }),
        }
      );
      console.log("response =>", response);

      const data = await response.json();
      Alert.alert("Succès !", "Nouveau Woofer dans vos amis!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/addFriend/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ decision: "rejected" }),
        }
      );
      console.log("response =>", response);
      const data = await response.json();
      Alert.alert(data.message);
    } catch (error) {
      console.error(error);
    }
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
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Demandes</Text>
          </View>
          <ScrollView style={styles.scroll}>
            {request.map((requestItem) => {
              const { from, _id } = requestItem;
              const profileImage =
                from.dogs && from.dogs[0] ? from.dogs[0].uri : "";
              const name =
                from.dogs && from.dogs[0] ? from.dogs[0].name : "Sans nom";
              console.log(from.dogs[0]);
              return (
                <View key={_id} style={styles.requestContainer}>
                  <View style={styles.header}>
                    <Image
                      source={{ uri: profileImage || "url_par_defaut" }}
                      style={styles.profileImage}
                    />
                    <Text style={styles.name}>{name}</Text>
                  </View>
                  <Text style={styles.requestText}>
                    Vous a envoyé une demande d'ami.
                  </Text>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#0639DB" }]}
                      onPress={() => handleAccept(_id)}
                    >
                      <Text style={styles.buttonText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#EAD32A" }]}
                      onPress={() => handleDecline(_id)}
                    >
                      <Text style={styles.buttonText}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

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
  title: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 35,
  },
  scroll: {
    marginTop: 10,
  },
  titleBox: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  requestContainer: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "extra-bold",
    fontFamily: "Lexend_400Regular",
  },
  requestText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    fontFamily: "Lexend_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lexend_400Regular",
  },
  textFont: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },
});

export default RequestScreen;
