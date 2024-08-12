import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CitaCard = ({ fecha, vehiculo, servicios, onPress }) => {

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.text}>Fecha: {fecha}</Text>
        <Text style={styles.text}>Vehículo: {vehiculo}</Text>
        <Text style={styles.text}>Servicios: {servicios}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3, // Añadido para sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default CitaCard;
