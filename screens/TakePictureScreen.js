import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { CameraView, Camera, FlashMode } from "expo-camera";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function TakePictureScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [flashStatus, setflashStatus] = useState("off");
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null);
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return <View />;
  }

  const TakePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });

      if (photo) {
        const formData = new FormData();

        formData.append(
          "data",
          JSON.stringify({
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
          })
        );

        formData.append("photoFromFront", {
          uri: photo.uri,
          name: "picture.jpg",
          type: "image/jpeg",
        });

        await fetch("http://192.168.100.105:3000/personalPic", {
          method: "POST",
          body: formData,
        });
      }
    } catch {
      console.error(error.message);
    }
  };

  const toggleFlash = () => {
    setflashStatus((current) => (current === "off" ? "on" : "off"));
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <CameraView
      style={styles.container}
      flash={flashStatus}
      facing={facing}
      ref={(ref) => {
        cameraRef.current = ref;
      }}
    >
      <View style={styles.params}>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <FontAwesome name="rotate-right" size={50} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleFlash}>
          <FontAwesome
            name="flash"
            size={50}
            color={flashStatus === "on" ? "#e8be4b" : "white"}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.snapButton} onPress={TakePicture}>
        <FontAwesome name="circle-thin" size={150} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.galerie}
        onPress={() => {
          navigation.navigate("Gallery");
        }}
      >
        <FontAwesome name="picture-o" size={70} color="white" />
      </TouchableOpacity>
    </CameraView>
  );
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
    bottom: 150,
  },
  params: {
    flexDirection: "row",
    gap: 300,
    top: 100,
  },
  galerie: {
    position: "absolute",
    bottom: 50,
    left: 50,
  },
});
