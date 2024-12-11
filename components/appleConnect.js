import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux"
import { connectUser } from "../reducers/user"

const AppleConnect = (props) => {
  const dispatch = useDispatch();
  const navigation = props.navigation || useNavigation();

  const handleAppleLogin = async () => {
    if(props.connectToAccount) {

        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
    

          fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/api/auth/apple`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credential),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data?.result) {
                dispatch(
                  connectUser({
                    email: data.result.email,
                    token: data.result.token,
                  })
                )
                navigation.navigate("Map")
              } else {
                alert(data.error)
              }
            })
            .catch((error) => console.error(error))

          //props.connectToAccount({email: "admin", password: "admin"});
        } catch (error) {
          if (error.code === 'ERR_CANCELED') {
            console.error('Apple Sign-In annulé.');
          } else {
            console.error('Erreur Apple Sign-In:', error);
          }
        }

    
    } else {
      if(props.signUpToAccount) {

        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
    

          fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}users/api/auth/apple`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credential),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data?.result) {
                dispatch(
                  connectUser({
                    email: data.result.email,
                    token: data.result.token,
                  })
                )
                navigation.navigate("Map")
              } else {
                alert(data.error)
              }
            })
            .catch((error) => console.error(error))

          //props.connectToAccount({email: "admin", password: "admin"});
        } catch (error) {
          if (error.code === 'ERR_CANCELED') {
            console.error('Apple Sign-Up annulé.');
          } else {
            console.error('Erreur Apple Sign-Up:', error);
          }
        }







      }
    }
  };

  return (
    <View style={styles.containerHere}>
      {AppleAuthentication.isAvailableAsync() && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleAppleLogin}
              activeOpacity={0.8}
            >
              {/* Icône Apple à gauche */}
              <FontAwesome name="apple" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>{props.title}</Text>
            </TouchableOpacity>
      )}
          </View>
  );
};

const styles = StyleSheet.create({
  containerHere: {
    alignItems: 'center',
    marginTop: 20,
    width:"80%",
  },
  button: {
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: '#0639DB', 
    borderStyle: 'solid', 
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',  // Centrer verticalement l'icône et le texte
    width:"100%",
  },
  icon: {
    marginRight: 10, 
    color: '#0639DB',
  },
  buttonText: {
    color: '#0639DB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppleConnect;
