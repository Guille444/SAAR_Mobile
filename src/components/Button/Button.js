import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

// Componente personalizado de botón
const CustomButton = ({ onPress, title }) => {
    return (
        // TouchableOpacity permite detectar toques y aplicar un efecto visual
        <TouchableOpacity onPress={onPress} style={styles.button}>
            {/* Texto del botón, que recibe un título como prop */}
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

// Estilos para el botón y el texto
const styles = StyleSheet.create({
    button: {
        width: '100%', // Ancho del botón al 100% del contenedor
        height: 50, // Altura fija del botón
        backgroundColor: '#000', // Color de fondo negro
        alignItems: 'center', // Alinear contenido horizontalmente al centro
        justifyContent: 'center', // Alinear contenido verticalmente al centro
        borderRadius: 5, // Bordes redondeados
    },
    buttonText: {
        color: '#fff', // Color del texto blanco
        fontSize: 18, // Tamaño de fuente del texto
        fontWeight: 'bold', // Texto en negrita
    },
});

// Exportar el componente para su uso en otras partes de la aplicación
export default CustomButton;
