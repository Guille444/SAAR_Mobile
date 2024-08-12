import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const CustomTextInput = ({ value, onChangeText, placeholder, secureTextEntry }) => {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            style={styles.input}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f9f9f9', // Fondo claro para los campos de entrada
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        fontSize: 16,
        borderRadius: 8, // Bordes redondeados para el input
    },
});

export default CustomTextInput;