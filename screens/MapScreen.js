import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  // Coordonnées fixes pour le Marker
  const markerPosition = {
    latitude: 48.8566,  // Latitude pour Paris
    longitude: 2.3522,  // Longitude pour Paris
  };

  return (
    <MapView style={styles.map} initialRegion={{
      latitude: 48.8566,  // Latitude de départ pour le centre de la carte
      longitude: 2.3522,  // Longitude de départ pour le centre de la carte
      latitudeDelta: 0.0922, // Zoom de la carte
      longitudeDelta: 0.0421, // Zoom de la carte
    }}>
      <Marker
        coordinate={markerPosition}
        title="Marker Example"
        description="C'est un marker avec une latitude et une longitude précises."
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
