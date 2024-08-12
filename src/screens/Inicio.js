import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
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

    // Estados para manejar la visibilidad y el mensaje de la alerta
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    // Función para mostrar una alerta con un mensaje específico
    const showAlert = (title, message, type) => {
        setAlertMessage(message); // Establecer el mensaje de la alerta
        setAlertType(type); // Establecer el tipo de alerta
        setAlertVisible(true); // Mostrar la alerta
    };

    return (
        <View style={styles.container}>
            <Image source={require('../img/llanta.png')} style={styles.image} />
            <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title={alertType === 'success' ? 'Éxito' : 'Error'}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={alertType === 'success' ? '#0A305E' : '#DD6B55'}
                confirmButtonStyle={styles.alertConfirmButton}
                confirmButtonTextStyle={styles.alertConfirmButtonText}
                onConfirmPressed={() => setAlertVisible(false)}
                contentContainerStyle={styles.alertContentContainer}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
