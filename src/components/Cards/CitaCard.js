import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importar los iconos

const CitaCard = ({ id_cita, fecha, hora, vehiculo, servicios = [], estado, onEdit, onDelete }) => {
  // Función para convertir la hora al formato 12 horas con AM/PM
  const formatearHora = (hora) => {
    if (!hora) return ''; // Asegura que no haya un error si la hora es undefined
    const [hora24, minutos] = hora.split(':'); // Separa la hora y los minutos
    let hora12 = parseInt(hora24) % 12 || 12; // Convierte al formato de 12 horas
    const periodo = parseInt(hora24) >= 12 ? 'p.m.' : 'a.m.'; // Determina si es AM o PM
    return `${hora12}:${minutos} ${periodo}`;
  };

  console.log('ID de cita en CitaCard:', id_cita); // Verifica aquí

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Fecha programada: </Text>
            <Text style={styles.text}>{fecha}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Hora programada: </Text>
            <Text style={styles.text}>{formatearHora(hora)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Vehículo: </Text>
            <Text style={styles.text}>{vehiculo}</Text>
          </View>
          <Text style={[styles.text, styles.bold]}>Servicios a realizar: </Text>
          <View style={styles.servicesList}>
            {Array.isArray(servicios) && servicios.length > 0 ? (
              servicios.map((servicio, index) => (
                <Text key={index} style={styles.serviceItem}>{`- ${servicio}`}</Text>
              ))
            ) : (
              <Text style={styles.serviceItem}>No hay servicios disponibles</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Estado: </Text>
            <Text style={styles.text}>{estado}</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => onEdit(id_cita)}>
            <FontAwesome name="edit" size={24} color="#FEAF00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onDelete(id_cita)}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  servicesList: {
    marginBottom: 5,
  },
  serviceItem: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 5,
    marginTop: 150,
  },
});

export default CitaCard;