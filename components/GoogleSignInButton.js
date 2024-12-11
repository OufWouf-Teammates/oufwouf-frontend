import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { makeRedirectUri } from 'expo-auth-session';

const redirectUri = makeRedirectUri({
  useProxy: true, // Utilise l'URL proxy d'Expo
});
// Permet à Expo d'utiliser les navigateurs web
WebBrowser.maybeCompleteAuthSession();

const GoogleSignInButton = (props) => {
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '940302423711-diep1ijqc9d94j1pc6868kjeic5234n1.apps.googleusercontent.com',
    redirectUri: redirectUri,
  });

  // Gestion des réponses de l'authentification
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      Alert.alert('Connecté avec succès', JSON.stringify(authentication));
      // Vous pouvez utiliser l'objet "authentication" pour récupérer un token ou d'autres données.
    }
  }, [response]);

  const clickOnConnect = () => {





    
    if(props.connectToAccount) {
      props.connectToAccount({email: "admin", password: "admin"});
    } else {
      if(props.signUpToAccount) {
        const random = Math.random();
        props.signUpToAccount({email: "adminInsc"+random+"@gmail.com", password: "adminInsc"});
      }
    }
  }


  return (
    <View style={styles.container}>
   <TouchableOpacity
      onPress={() => {
        if (request) {
          promptAsync();
        } else {
          Alert.alert('Erreur', 'La demande de connexion Google n’est pas prête.');
        }}}
      style={styles.button}
      activeOpacity={0.8}
    >
        <FontAwesome name="google" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    width:"100%",
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
    width:"80%",
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

export default GoogleSignInButton;