// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   ImageBackground,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   Platform,
// } from "react-native";

// import { useState, useEffect } from "react";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import {
//   ActionSheetProvider,
//   useActionSheet,
// } from "@expo/react-native-action-sheet";
// import { useCameraPermissions } from "expo-camera";

// import * as MediaLibrary from "expo-media-library";
// import * as Camera from "expo-camera";

// const DogInfoFormScreen = () => {
//   const [name, setName] = useState("");
//   const [info, setInfo] = useState("");
//   const [personnality, setPersonnality] = useState("");

//   //   const [hasPermission, setHasPermission] = useState(false);
//   const [imageUri, setImageUri] = useState(');
    // //   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    // //   const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
    
    //   const { showActionSheetWithOptions } = useActionSheet("");
    //   const { hasPermission, requestPermission } = useCameraPermissions();
    
    //   useEffect(() => {
    //     if (hasPermission === false) {
    //       requestPermission();
    //     }
    //   }, [hasPermission]);
    
    //   //   useEffect(() => {
    //   //     const getPerm = async () => {
    //   //         const { status: cameraStatus } =  await Camera?.requestCameraPermissionsAsync();
    //   //         const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
    //   //         if (cameraStatus === "granted" && mediaLibraryStatus === "granted") {
    //   //           setHasPermission(true);
    //   //         } else {
    //   //           setHasPermission(false)
    //   //           ;
    //   //         }
    //   //     };
    //   //     getPerm();
    //   //   }, []);
    
    // //   useEffect(() => {
    // //     const getPermissions = async () => {
    // //       const { status: mediaLibraryStatus } =
    // //         await MediaLibrary.requestPermissionsAsync();
    // //       setMediaLibraryPermission(mediaLibraryStatus);
    
    // //       requestCameraPermission();
    // //     };
    
    // //     getPermissions();
    // //   }, [requestCameraPermission, []]);
    
    //   const handleLibrary = () => {
    //     launchImageLibrary(
    //       { mediaType: "photo", quality: 1, selectionLimit: 1 },
    //       (response) => {
    //         if (response.didCancel) {
    //           console.log("user a pas choisi de photo");
    //         } else if (response.errorCode) {
    //           console.log("erreur bouhhh: ", response.errorCode);
    //         } else {
    //           setImageUri(response.assets[0].uri);
    //         }
    //       }
    //     );
    //   };
    
    //   const handlePhoto = () => {
    //     launchCamera(
    //       { mediaType: "photo", quality: 1, saveToPhotos: true },
    //       (response) => {
    //         if (response.didCancel) {
    //           console.log("user a pas pris de photo");
    //         } else if (response.errorCode) {
    //           console.log("erreur bouhhh: ", response.errorCode);
    //         } else {
    //           setImageUri(response.assets[0].uri);
    //         }
    //       }
    //     );
    //   };
    
    //   const showActionSheet = () => {
    //     const options = ["Prenez une photo", "Séléctionnez une photo", "Annuler"];
    //     const cancelButtonIndex = options.length - 1;
    
    //     showActionSheetWithOptions(
    //       { options, cancelButtonIndex },
    //       (buttonIndex) => {
    //         if (buttonIndex === 0) {
    //           handlePhoto();
    //         } else if (buttonIndex === 1) {
    //           handleLibrary();
    //         }
    //       }
    //     );
    //   };
    //   return (
    //     <ImageBackground
    //       source={require("../assets/BG_App.png")}
    //       style={styles.container}
    //     >
    //       <SafeAreaView style={styles.innerContainer}>
    //         {imageUri && (
    //           <Image
    //             source={{ uri: imageUri }}
    //             style={{ width: 200, height: 200 }}
    //           />
    //         )}
    //         <TouchableOpacity onPress={() => showActionSheet()}>
    //           <Text> bouton photo +</Text>
    //         </TouchableOpacity>
    
    // <Text>Nom du chien*</Text>
    // <TextInput style={styles.input} onChangeText={(value) => setName(value)} value={name} />
    
    // <Text>Race du chien*</Text>
    // <Text>Sexe du chien*</Text>
    // <Text>Date de naissance*</Text>
    // <Text>Couleur de robe du chien</Text>
    // <Text>Vaccinations du chien</Text>
    // <Text>Rappel</Text>
    // <Text>Date de vaccination</Text>
    
    // <Text>Information général </Text>
    // <TextInput style={styles.input} onChangeText={(value) => setInfo(value)} value={info} />
    
    // <Text>Traits de personalité</Text>
    // <TextInput
    //   onChangeText={(value) => setPersonnality(value)}
    //   value={personnality}
    // />
    //       </SafeAreaView>
    //     </ImageBackground>
    //   );
    // };
    
    // export default () => (
    //   <ActionSheetProvider>
    //     <DogInfoFormScreen />
    //   </ActionSheetProvider>
    // );
    // const styles = StyleSheet.create({
    //   container: {
    //     flex: 1,
    //     alignItems: "center",
    //     justifyContent: "center",
    //   },
    //   innerContainer: {
    //     flex: 1,
    //     width: "100%",
    //     alignItems: "center",
    //     justifyContent: "center",
    //   },
    // });
    