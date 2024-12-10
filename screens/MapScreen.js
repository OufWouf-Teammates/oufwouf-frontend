import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMessage('Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {currentPosition ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentPosition.coords.latitude,
              longitude: currentPosition.coords.longitude,
            }}
            title="Ma position"
            pinColor="#fecb2d"
          />
        </MapView>
      ) : (
        <Text>{errorMessage || "Chargement de la position..."}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});