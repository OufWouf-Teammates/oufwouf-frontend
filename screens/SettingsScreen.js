import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen({ navigation }) {
 return (
    <View style={styles.container}>
        <Text>SettingsScreen</Text>
    </View>
 );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });