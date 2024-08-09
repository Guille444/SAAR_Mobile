import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Constantes from '../../utils/constantes';

export default function Inicio({ navigation }) {
    const ip = Constantes.IP;

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Inicio</Text>
                </View>
            ),
            headerTitleAlign: 'center',
        });
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('../img/llanta.png')} style={styles.image} />
            <TouchableOpacity>
                <Text style={styles.welcomeText}>Bienvenid@</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Establece el fondo blanco aquí
    },
    headerTitleContainer: {
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    alertConfirmButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    alertConfirmButtonText: {
        fontSize: 16,
    },
    alertContentContainer: {
        borderRadius: 10,
        padding: 20,
        backgroundColor: 'white', // Asegúrate de que el fondo sea blanco
    },
    alertTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    alertMessage: {
        fontSize: 18,
        marginBottom: 10,
    },
});
