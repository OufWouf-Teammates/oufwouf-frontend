import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import TabBar from '../components/TabBar.js';

export default function MapScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const requestLocationPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }
      
      const locationSubscription = await Location.watchPositionAsync(
        { distanceInterval: 10 },
        (location) => {
          setCurrentPosition(location);
        }
      );

      return () => locationSubscription.remove(); // Cleanup on unmount
    };

    requestLocationPermissions();
    
  }, []);

  let marker = currentPosition?.coords && (
    <Marker coordinate={currentPosition?.coords} title="My position" pinColor="#fecb2d" />
  );

  return (
    <View style={{ flex: 1 }}>
      <MapView style={styles.map}>
        {currentPosition && marker}
      </MapView>

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}

      <TabBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  errorContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    zIndex: 1,
  },
  errorMessage: {
    color: 'white',
    fontSize: 16,
  },
});