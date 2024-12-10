import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    (async () => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
   
      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location.coords);
            console.log(location);
          });
      }
    })();
   }, []);


  return (
    <MapView style={styles.map}>
      {currentPosition && (
        <Marker
        coordinate={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          }}
          title="My Position"
          />
          )}
    </MapView>
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
