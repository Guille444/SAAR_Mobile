import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function VehiculosRegistrados() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>No hay vehículos registrados</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Fondo blanco
    },
    text: {
        fontSize: 18,
        color: '#000', // Texto negro
    },
});
