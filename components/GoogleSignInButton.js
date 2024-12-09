import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Permet à Expo d'utiliser les navigateurs web
WebBrowser.maybeCompleteAuthSession();

const GoogleSignInButton = () => {
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

  return (
    <TouchableOpacity
      onPress={() => promptAsync()}
      style={styles.buttonSignUpGoogle}
      activeOpacity={0.8}
    >
      <View style={styles.googleContainer}>
        <FontAwesome name="google" size={20} color="#DB4437" style={styles.googleIcon} />
        <Text style={styles.textButtonSignUpGoogle}>Continuer avec Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonSignUpGoogle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width:"80%",
  },
  googleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    marginRight: 8,
  },
  textButtonSignUpGoogle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft:20,
  },
});

export default GoogleSignInButton;