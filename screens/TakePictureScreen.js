import React, { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { CameraView, Camera, FlashMode } from "expo-camera"
import * as Location from "expo-location"
import FontAwesome from "react-native-vector-icons/FontAwesome"

export default function TakePictureScreen({ navigation }) {
  const apiPicture = `${process.env.EXPO_PUBLIC_BACKEND_URL}pictures`
  // const userToken = 'G11TEnZ3rHh5_7tf1E_RVxcI_xkT7M5G'
  const userToken = useSelector((state) => state.user.value.token)

  const [hasPermission, setHasPermission] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(null)

  const [flashStatus, setflashStatus] = useState("off")
  const [facing, setFacing] = useState("back")
  const cameraRef = useRef(null)

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Demander les permissions de localisation
        const locationResult =
          await Location.requestForegroundPermissionsAsync()
        if (locationResult.status === "granted") {
          Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, distanceInterval: 10 },
            (location) => {
              setCurrentPosition(location.coords)
            }
          )
        } else {
          console.warn("Permission de localisation refusée")
        }

        // Demander les permissions de caméra
        const cameraResult = await Camera.requestCameraPermissionsAsync()
        if (cameraResult.status === "granted") {
          setHasPermission(true)
        } else {
          console.warn("Permission de caméra refusée")
        }
      } catch (error) {
        console.error("Erreur lors de la demande de permissions :", error)
      }
    }

    requestPermissions()
  }, [])

  if (!hasPermission) {
    return <View />
  }

  const TakePicture = async (e) => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 })

      if (photo && currentPosition) {
        const formData = new FormData()

        formData.append(
          "data",
          JSON.stringify({
            description: "Décrivez la photo...",
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          })
        )

        formData.append("photoFromFront", {
          uri: photo.uri,
          name: "picture.jpg",
          type: "image/jpeg",
        })

        const response = await fetch(apiPicture, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },

          body: formData,
        })

        const responseData = await response.json()

      }
    } catch (error) {
      console.error("Error taking picture:", error.message)
    }
  }

  const toggleFlash = () => {
    setflashStatus((current) => (current === "off" ? "on" : "off"))
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  return (
    <CameraView
      style={styles.container}
      flash={flashStatus}
      facing={facing}
      ref={(ref) => {
        cameraRef.current = ref
      }}
    >
      <View style={styles.params}>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
            <FontAwesome name="arrow-left" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <FontAwesome name="rotate-right" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleFlash}>
          <FontAwesome
            name="flash"
            size={25}
            color={flashStatus === "on" ? "#e8be4b" : "white"}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.snapButton} onPress={TakePicture}>
        <FontAwesome name="circle-thin" size={80} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.galerie}
        onPress={() => {
          navigation.navigate("Gallery")
        }}
      >
        <FontAwesome name="picture-o" size={25} color="white" />
      </TouchableOpacity>
    </CameraView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  snapButton: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 70,
  },
  params: {
    width: '90%',
    flexDirection: "row",
    justifyContent: 'space-between',
    top: 60,
  },
  galerie: {
    position: "absolute",
    bottom: 50,
    left: 50,
  },
})
