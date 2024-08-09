// Importaciones necesarias de React y componentes de React Native.
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';

// Componente principal de registro.
export default function Registro({ navigation }) {
    // Obtención de la IP del servidor desde el archivo de constantes.
    const ip = Constantes.IP;

    // Estados para almacenar los datos del formulario.
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [alias, setAlias] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');
    const [showAlert, setShowAlert] = useState(false);// Estado para manejar la visibilidad de la alerta.
    const [alertMessage, setAlertMessage] = useState('');// Estado para manejar el mensaje de la alerta.
    const [isRegistering, setIsRegistering] = useState(false);// Estado para indicar si se está registrando.

    // Expresión regular para validar el formato del teléfono (####-####).
    const telefonoRegex = /^\d{4}-\d{4}$/;

    // Función para manejar el cambio de texto en el campo de teléfono.
    const handleTextChange = (text) => {
        let formatted = text.replace(/[^\d]/g, ''); // Elimina todos los caracteres no numéricos.
        if (formatted.length > 8) {
            formatted = formatted.slice(0, 8); // Limita a 8 dígitos.
        }
        if (formatted.length > 4) {
            formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
        }
        setTelefono(formatted); // Actualiza el estado con el valor formateado.
    };

    // Función para mostrar una alerta con un mensaje específico.
    const showAlertWithMessage = (message) => {
        setAlertMessage(message);  // Establece el mensaje de la alerta.
        setShowAlert(true); // Muestra la alerta.
    };

    // Función asíncrona para manejar la creación de una cuenta.
    const handleCreate = async () => {
        // Validaciones de los campos del formulario.
        if (!nombre.trim() || !apellido.trim() || !alias.trim() || !telefono.trim() ||
            !email.trim() || !clave.trim() || !confirmarClave.trim()) {
            showAlertWithMessage("Debes llenar todos los campos");
            return;
        } else if (!telefonoRegex.test(telefono)) {
            showAlertWithMessage("El teléfono debe tener el formato correcto (####-####)");
            return;
        } else if (clave !== confirmarClave) {
            showAlertWithMessage("Las contraseñas no coinciden");
            return;
        }

        setIsRegistering(true);

        try {
            // Creación de un objeto FormData para enviar los datos del formulario.
            const formData = new FormData();
            formData.append('nombreCliente', nombre);
            formData.append('apellidoCliente', apellido);
            formData.append('aliasCliente', alias);
            formData.append('contactoCliente', telefono);
            formData.append('correoCliente', email);
            formData.append('claveCliente', clave);
            formData.append('confirmarClave', confirmarClave);
            // Envío de los datos del formulario al servidor.
            const response = await fetch(`${ip}/services/public/cliente.php?action=signUp`, {
                method: 'POST',
                body: formData
            });

            const responseText = await response.text();
            console.log(responseText); // Muestra la respuesta cruda en la consola

            const data = JSON.parse(responseText);
            if (data.status) {
                showAlertWithMessage('Cuenta registrada correctamente');
                setTimeout(() => {
                    setShowAlert(false);
                    navigation.navigate('Sesion'); // Redirección a la pantalla de inicio de sesión después de 2 segundos.
                }, 2000);
            } else {
                showAlertWithMessage(data.error);
            }
        } catch (error) {
            showAlertWithMessage('Ocurrió un problema al registrar la cuenta');
        } finally {
            setIsRegistering(false); // Indica que se ha terminado el registro.
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../img/atras.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.title}>Registro</Text>
            </View>
            <TextInput
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
                placeholder="Nombre"
            />
            <TextInput
                value={apellido}
                onChangeText={setApellido}
                style={styles.input}
                placeholder="Apellido"
            />
            <TextInput
                value={alias}
                onChangeText={setAlias}
                style={styles.input}
                placeholder="Alias"
            />
            <TextInput
                value={telefono}
                onChangeText={handleTextChange}
                style={styles.input}
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
            />
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
            />
            <TextInput
                value={clave}
                onChangeText={setClave}
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry={true}
            />
            <TextInput
                value={confirmarClave}
                onChangeText={setConfirmarClave}
                style={styles.input}
                placeholder="Confirmar contraseña"
                secureTextEntry={true}
            />
            <TouchableOpacity onPress={handleCreate} style={styles.button}>
                <Text style={styles.buttonText}>REGISTRARSE</Text>
            </TouchableOpacity>
            <AwesomeAlert
                show={showAlert}
                showProgress={isRegistering}
                title={isRegistering ? "Registrando" : "Mensaje"}
                message={alertMessage}
                closeOnTouchOutside={!isRegistering}
                closeOnHardwareBackPress={!isRegistering}
                showCancelButton={false}
                showConfirmButton={!isRegistering}
                confirmText="OK"
                confirmButtonColor="gray"
                onConfirmPressed={() => {
                    setShowAlert(false);
                }}
                contentContainerStyle={styles.alertContentContainer}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
                confirmButtonStyle={styles.alertConfirmButton}
                confirmButtonTextStyle={styles.alertConfirmButtonText}
            />
        </ScrollView>
    );
};

// Estilos para el componente.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        color: '#000',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#f9f9f9', // Fondo claro para los campos de entrada
    },
    button: {
        width: '100%',
        borderRadius: 8, // Bordes redondeados para el botón
        height: 50,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
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