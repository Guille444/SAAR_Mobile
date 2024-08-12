import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ onPress, title }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CustomButton;