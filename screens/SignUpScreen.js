import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, Image, TextInput, Platform, KeyboardAvoidingView, TouchableOpacity,} from 'react-native';
import Checkbox from 'expo-checkbox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useFonts, Lexend_400Regular, Lexend_700Bold,} from '@expo-google-fonts/lexend';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { connectUser } from '../reducers/user';


import { NEXT_PUBLIC_BACKEND_URL } from "@env";

export default function SignUpScreen ({ navigation, route}) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassworrd] =useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);

    //Nécessaire pour la configuration des fonts 
    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_700Bold,
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    }
    const {connectToAccount} = route.params

    const handleConnection = () => {
        if (password === confirmPassword && isChecked) {
            connectToAccount({email, password});
        }else{
            setPassword('')
            setConfirmPassworrd('')
            alert('Les mots de passe ne correspondent pas')
        }
      
    };

    

    return (
        <ImageBackground
            source={require('../assets/BG_App.png')}
            style={styles.container}
        >
          <KeyboardAvoidingView style={styles.innerContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Image style={styles.image} source={require('../assets/logo_oufwouf_couleur.png')} />
            <Text style={styles.title}>S'inscrire</Text>
            <View style={styles.boxInputEmail}>
                <TextInput 
                    placeholder="Adresse Email" 
                    onChangeText={(value) => setEmail(value)} 
                    value={email} 
                    style={styles.inputEmail}
                    autoCapitalize="none" // Évite la capitalisation automatique
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                />
            </View>
            <View style={styles.boxInputPassword}>
                <TextInput 
                    placeholder="Mot de passe" 
                    onChangeText={(value) => setPassword(value)} 
                    value={password} 
                    style={styles.inputPassword} 
                    secureTextEntry={true} // Masque les caractères
                    autoCapitalize="none" // Évite la capitalisation automatique
                />
            </View>
            <View style={styles.boxInputPassword}>
                <TextInput 
                    placeholder="Confirmer le mot de passe" 
                    onChangeText={(value) => setConfirmPassworrd(value)} 
                    value={confirmPassword} 
                    style={styles.inputPassword} 
                    secureTextEntry={true} // Masque les caractères
                    autoCapitalize="none" // Évite la capitalisation automatique
                />
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    disabled={false}
                    value={isChecked}
                    onValueChange={(newValue) => setIsChecked(newValue)}
                    color={isChecked ? '#0639DB' : undefined} // Couleur pour l'état coché
                    style={styles.checkbox}
                />
                <Text style={styles.label}>J'accepte les CGU</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    disabled={false}
                    value={isChecked2}
                    onValueChange={(newValue) => setIsChecked2(newValue)}
                    color={isChecked2 ? '#0639DB' : undefined} // Couleur pour l'état coché
                    style={styles.checkbox}
                />
                <Text style={styles.label}>J'accepte de recevoir les offres promotionnelles des partenaires de OufWouf !</Text>
            </View>

            <TouchableOpacity onPress={() => handleConnection()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>M'inscrire</Text>
                <FontAwesome name='arrow-right' size={25} color='#F5F5F5'/>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ImageBackground>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      innerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        width: '70%',
        height: '20%', 
      },
      title: {
        width: '80%',
        fontSize: 24, 
        fontFamily: 'Lexend_700Bold',
        marginVertical: 10,
      },
      inputEmail: {
        color: '#F5F5F5',
        fontSize: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        fontFamily: 'Lexend_400Regular',
      },
      boxInputEmail: {
        backgroundColor: '#EAD32A',
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginVertical: 5,
        padding: 20,
        borderRadius: 5,
      }, 
      inputPassword: {
        color: '#0639DB',
        fontSize: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#0639DB',
        fontFamily: 'Lexend_400Regular',
      },
      boxInputPassword: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginVertical: 5,
        padding: 20,
        borderRadius: 5,
      },
      checkboxContainer:{
        width: "80%",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        margin: 10,
      },
      checkbox: {
        marginRight: 5,
      },
      label: {
        fontFamily: 'Lexend_400Regular',
        color: '#0639DB'
      },
      button: {
        backgroundColor: '#0639DB',
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        padding: 15,
        borderRadius: 5,
      }, 
      textButton: {
        color: '#F5F5F5',
        fontSize: 16,
        width: '70%',
        fontFamily: 'Lexend_400Regular',
      }
    });