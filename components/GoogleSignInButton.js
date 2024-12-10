import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Permet à Expo d'utiliser les navigateurs web
WebBrowser.maybeCompleteAuthSession();

const GoogleSignInButton = (props) => {
  
  /*
  // Configuration de Google OAuth
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.ID_IOS_GOOGLE_SIGNIN,
      redirectUri: makeRedirectUri({
        useProxy: true,
      }),
      scopes: ['openid', 'email', 'profile'], // Scopes pour récupérer des informations utilisateur
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    }
  );

  // Gestion des réponses après Google Sign-In
  React.useEffect(() => {
    if (response?.type === 'success') {
      //const { authentication } = response;
      console.log(response);
      // Envoyer le token à votre backend pour une authentification sécurisée
    }
  }, [response]);

  */

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
      onPress={() => clickOnConnect()}
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