import React from 'react';
import { View } from 'react-native';
import AppleAuthentication from '@invertase/react-native-apple-authentication';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AppleConnect = () => {
  const handleAppleLogin = async () => {
    try {
      // Demander l'authentification via Apple
      const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.Scope.FULL_NAME,
          AppleAuthentication.Scope.EMAIL,
        ],
      });

      // Récupérer le token d'authentification
      const { identityToken, fullName, email } = appleAuthRequestResponse;

      if (identityToken) {
        // Envoyer le token au serveur pour validation
        console.log('Apple Identity Token:', identityToken);
        console.log('User Full Name:', fullName);
        console.log('User Email:', email);

        // Vous pouvez maintenant envoyer ce token au serveur pour validation
        // Exemple d'appel vers le serveur
        fetch('https://votre-api.com/auth/apple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: identityToken }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            // L'utilisateur a été authentifié avec succès
            console.log('Authentification réussie', data);
          } else {
            console.log('Erreur d\'authentification', data);
          }
        })
        .catch(error => {
          console.error('Erreur lors de l\'authentification via Apple', error);
        });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion avec Apple', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Créer un bouton personnalisé avec l'icône Apple */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAppleLogin}
        activeOpacity={0.8}
      >
        {/* Icône Apple à gauche */}
        <FontAwesome name="apple" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Connexion via Apple</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
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
