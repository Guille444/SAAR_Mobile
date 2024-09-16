import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importar los iconos

export default function VehiculoCard({ vehiculo, onEdit, onDelete }) {
    return (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{vehiculo.marca_vehiculo} {vehiculo.modelo_vehiculo}</Text>
                    <Text style={styles.text}><Text style={styles.bold}>Placa:</Text> {vehiculo.placa_vehiculo}</Text>
                    <Text style={styles.text}><Text style={styles.bold}>Año:</Text> {vehiculo.año_vehiculo}</Text>
                    <Text style={styles.text}><Text style={styles.bold}>Color:</Text> {vehiculo.color_vehiculo}</Text>
                    <Text style={styles.text}><Text style={styles.bold}>VIN:</Text> {vehiculo.vin_motor}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => onEdit(vehiculo.id_vehiculo)}>
                        <FontAwesome name="edit" size={24} color="#FEAF00" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => onDelete(vehiculo.id_vehiculo)}>
                        <FontAwesome name="trash" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 15, // Agrega este margen para mover la tarjeta a la derecha
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: '90%', // Ajusta el ancho de la tarjeta
    },
    infoContainer: {
        flexDirection: 'row', // Distribuye la información en fila
        alignItems: 'center', // Alinea verticalmente
    },
    textContainer: {
        flex: 1, // Toma todo el espacio disponible
    },
    buttonsContainer: {
        flexDirection: 'row', // Distribuye los botones en fila
        alignItems: 'center', // Alinea los botones verticalmente
    },
    button: {
        marginLeft: 10, // Espacio entre los botones
        marginTop: 100,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold', // Estilo para el texto en negrita
    },
});