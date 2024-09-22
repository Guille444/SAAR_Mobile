import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

export default function VerificarCodigo({ route, navigation }) {
    const ip = Constantes.IP; // Obtiene la IP del servidor desde las constantes

    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [number3, setNumber3] = useState('');
    const [number4, setNumber4] = useState('');
    const [number5, setNumber5] = useState('');
    const [number6, setNumber6] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Referencias para los campos de texto
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    // Maneja el cambio de texto en los campos
    const onChangeText = (text, index) => {
        if (/^\d$/.test(text)) { // Verifica que el texto ingresado sea un dígito
            // Actualiza el estado del campo correspondiente
            const setNumber = [setNumber1, setNumber2, setNumber3, setNumber4, setNumber5, setNumber6][index];
            setNumber(text);

            // Mueve el foco al siguiente campo si es necesario
            if (index < 5 && text.length === 1) {
                inputRefs[index + 1].current.focus();
            }
        }
    };

    // Maneja la pulsación de teclas en los campos de la pantalla
    const onKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace') { // Si se presiona "backspace" o la tecla para borrar
            // Limpia el campo actual
            const setNumber = [setNumber1, setNumber2, setNumber3, setNumber4, setNumber5, setNumber6][index];
            setNumber('');

            // Mueve el foco al campo anterior si el campo actual está vacío
            if (index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };

    // Maneja la verificación del PIN
    const handlePin = async () => {
        const pin = [number1, number2, number3, number4, number5, number6].join('');

        // Verifica que el PIN tenga exactamente 6 dígitos
        if (pin.length === 6 && /^\d{6}$/.test(pin)) {
            try {
                const formData = new FormData();
                formData.append('correo_cliente', route.params.correoCliente); // Asegúrate de usar el nombre correcto
                formData.append('codigo_recuperacion', pin); // Asegúrate de usar 'codigo_recuperacion'

                // Envía la solicitud de verificación al servidor
                const response = await fetch(`${ip}/services/public/cliente.php?action=verifPin`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                console.log(data);

                if (data.status) {
                    // Muestra un mensaje de éxito y redirige después de 2 segundos
                    setAlertMessage('Código verificado exitosamente');
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                        navigation.navigate('NuevaClave');
                    }, 2000);
                } else {
                    // Muestra un mensaje de error
                    setAlertMessage(data.error || 'Error al verificar el código');
                    setShowAlert(true);
                }
            } catch (error) {
                console.error(error);
                // Muestra un mensaje de error en caso de excepción
                setAlertMessage('Ocurrió un error al verificar el código');
                setShowAlert(true);
            }
        } else {
            // Muestra un mensaje si no todos los campos están llenos
            setAlertMessage('Por favor, complete todos los campos');
            setShowAlert(true);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Verificar Código</Text>
            <Text style={styles.instructions}>Ingresa el código de verificación enviado a tu correo electrónico</Text>

            <View style={styles.inputsContainer}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <TextInput
                        key={index}
                        style={styles.input}
                        ref={inputRefs[index]}
                        onChangeText={(text) => onChangeText(text, index)}
                        onKeyPress={(e) => onKeyPress(e, index)}
                        value={[number1, number2, number3, number4, number5, number6][index]}
                        placeholder=""
                        keyboardType="numeric"
                        maxLength={1}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handlePin}>
                <Text style={styles.buttonText}>VERIFICAR</Text>
            </TouchableOpacity>

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Alerta"
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="gray"
                onConfirmPressed={() => setShowAlert(false)}
                contentContainerStyle={styles.alertContentContainer}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
                confirmButtonTextStyle={styles.alertConfirmButtonText}
                confirmButtonStyle={styles.alertConfirmButton}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    input: {
        width: 40,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 24,
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    alertConfirmButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    alertConfirmButtonText: {
        fontSize: 16,
    },
});
