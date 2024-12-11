import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native"

const InterestPoint = ({ route }) => {
  const { markerData } = route.params
  const [pointData, setPointData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    // Fonction pour récupérer les données d'un point d'intérêt spécifique
    const fetchInterestPoint = async () => {
      try {
        const url = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}lieu/${
            markerData?.latitude || 1
          },${markerData?.longitude || 1}/${markerData.name}`
        )
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors de la récupération des données."
          )
        }
        const data = await response.json()
        setPointData(data)
        console.log(pointData)
      } catch (err) {
        setError(err.message)
        Alert.alert("Erreur", err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInterestPoint()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    )
  }

  if (error || !pointData) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>
          Impossible de charger les données du point d'intérêt.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image principale */}
      {pointData.imageUrl ? (
        <Image source={{ uri: pointData.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>Image indisponible</Text>
        </View>
      )}

      {/* Informations principales */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{pointData.name}</Text>
        <Text style={styles.description}>{pointData.description}</Text>

        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Adresse :</Text>
          <Text style={styles.detailValue}>
            {pointData.address || "Non renseignée"}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Horaires :</Text>
          <Text style={styles.detailValue}>
            {pointData.hours || "Non spécifiés"}
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  placeholderText: {
    color: "#757575",
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  detailContainer: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
})

export default InterestPoint
