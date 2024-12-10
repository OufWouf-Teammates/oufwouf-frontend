import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function TabBar ({navigation}) {
    return (
        
            <View style={styles.container}>
                <View style={styles.tabBarBackground}>
                    <View style={styles.containerInside}>
                        <View style={styles.containerOneButtonLeft}>
                        <TouchableOpacity>
                            <FontAwesome name="heart-o" size={30} color="#1738D3" />
                        </TouchableOpacity>
                        </View>
                        <View style={styles.containerOneButtonTop}>
                            <View>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesome name="paw" size={30} color="#F5F5F5" />
                            </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.containerOneButtonRight}>
                        <TouchableOpacity>
                            <FontAwesome name="camera" size={30} color="#1738D3" />
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
      );
    }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      backgroundColor:"transparent"
    },
    tabBarBackground: {
        position: 'absolute',
        bottom: 0,
        left: -20, // Décale à gauche pour élargir la courbure
        right: -20, // Décale à droite pour élargir la courbure
        height: "26%", // Ajustez la hauteur pour jouer avec la courbure
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 150, // Rayon plus grand pour arrondir davantage
        borderTopRightRadius: 150,
        zIndex: 0,
      },
    containerInside: {
      flex:1,
      flexDirection:"row",
      width:"100%",
    },
    containerOneButtonLeft: {
        flex:1,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight:40,
    },
    containerOneButtonRight: {
        flex:1,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft:40,
    },
    containerOneButtonTop: {
        flex:1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop:-20,
    },
  button: {
    backgroundColor: '#1738D3', // Couleur de fond
    borderRadius: 27, // Coins arrondis
    padding: 10, // Espace intérieur
    alignItems: 'center', // Centrage horizontal
    justifyContent: 'center', // Centrage vertical
    width: 60, // Largeur du bouton
    height: 60, // Hauteur du bouton
  },
  });
  