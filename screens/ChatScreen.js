// import React, { useEffect, useState } from "react"
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   Text,
//   ImageBackground,
//   ActivityIndicator,
//   ScrollView,
//   Linking,
//   TextInput,
// } from "react-native"
// import { FlatList } from "react-native"
// import FontAwesome from "react-native-vector-icons/FontAwesome"
// import {
//   useFonts,
//   Lexend_400Regular,
//   Lexend_700Bold,
// } from "@expo-google-fonts/lexend"
// import AppLoading from "expo-app-loading"
// import { useSelector } from "react-redux"

// const DiscussionsScreen = ({ navigation, route }) => {
//   const [search, setSearch] = useState("")
//   const [dogName, setDogName] = useState(route.dogName)
//   const [messages, setMessages] = useState([])
//   const apiRoom = `${process.env.EXPO_PUBLIC_BACKEND_URL}rooms`
//   const apiMessage = `${process.env.EXPO_PUBLIC_BACKEND_URL}messages`
//   const userToken = useSelector((state) => state.user.value?.token)
//   console.log(userToken)

//   useEffect(() => {
//     ;(async () => {
//       const getMessages = await fetch(`${apiRoom}?name=${dogName}`)

//       const response = await getMessages.json()

//       setMessages(response.messages)
//     })()
//   }, [])

//   const sendMessage = async () => {
//     const send = await fetch(`${apiMessage}?name=${dogName}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${userToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: search,
//       }),
//     })

//     const response = await send.json()
//   }

//   return (
//     <ImageBackground
//       source={require("../assets/BG_App.png")}
//       style={styles.container}
//     >
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.iconBack}
//       >
//         <FontAwesome name="arrow-left" size={30} color="#0639DB" />
//       </TouchableOpacity>
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}></View>
//         <ScrollView style={styles.messages}>
//           <View style={styles.message}>
//             <Text>
//               voil voila voilavoilavoila voilavoilavoilavoilavoilavoilavoila
//               voila voila voila voila voilavoilavoila voilavoila voila
//               voilavoilaa
//             </Text>
//           </View>
//           <View style={styles.message}>
//             <Text>voila</Text>
//           </View>
//           <View style={styles.message}>
//             <Text>voila</Text>
//           </View>
//           <View style={styles.message}>
//             <Text>voila</Text>
//           </View>
//           {messages &&
//             messages.map((e, i) => (
//               <View key={i} style={styles.message}>
//                 <Text>{e.content}</Text>
//               </View>
//             ))}
//         </ScrollView>
//         <View style={styles.sender}>
//           <TextInput
//             style={styles.inputMessage}
//             placeholder="Envoyer un message..."
//             value={search}
//             onChangeText={(e) => setSearch(e)}
//           ></TextInput>
//           <TouchableOpacity
//             style={styles.iconSearch}
//             onPress={() => sendMessage()}
//           >
//             <FontAwesome name="arrow-right" size={25} color="#0639DB" />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </ImageBackground>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//   },
//   header: {
//     width: "100%",
//     height: 150,
//   },
//   messages: {},
//   message: {
//     backgroundColor: "white",
//     padding: 10,
//     margin: 20,
//     borderRadius: 10,
//     textAlign: "justify",
//   },
//   iconBack: {
//     position: "absolute",
//     top: 60,
//     left: 30,
//     zIndex: 50,
//   },
//   sender: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     width: "90%",
//     borderRadius: 10,
//     position: "absolute",
//     bottom: 20,
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//   },
// })

// export default DiscussionsScreen
