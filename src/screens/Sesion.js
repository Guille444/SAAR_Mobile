// Importaciones
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useFocusEffect } from '@react-navigation/native';
import * as Constantes from '../../utils/constantes';

// Componente principal
export default function Sesion({ navigation }) {

    const ip = Constantes.IP;
    // Estados
    const [isContra, setIsContra] = useState(true);  // Estado para mostrar/ocultar la contraseña
    const [usuario, setUsuario] = useState(''); // Estado para el campo del usuario
    const [contrasenia, setContrasenia] = useState(''); // Estado para el campo de la contraseña
    const [showAlertWithMessage, setshowAlertWithMessage] = useState(false); // Estado para mostrar/ocultar la alerta
    const [alertMessage, setAlertMessage] = useState(''); // Estado para el mensaje de la alerta
    const [showProgress, setShowProgress] = useState(false); // Estado para mostrar/ocultar el indicador de progreso

    // Función para mostrar una alerta con un mensaje específico
    const showAlertWithMessageWithMessage = (message, showProgressIndicator = false) => {
        setAlertMessage(message);
        setShowProgress(showProgressIndicator);
        setshowAlertWithMessage(true);
    };

    // Efecto para cargar los detalles del carrito al cargar la pantalla o al enfocarse en ella
    useFocusEffect(
        // La función useFocusEffect ejecuta un efecto cada vez que la pantalla se enfoca.
        React.useCallback(() => {
            validarSesion(); // Llama a la función getDetalleCarrito.
        }, [])
    );

    // Función para manejar el cierre de sesión del usuario
    const cerrarSesion = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=logOut`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.status) {
                console.log("Sesión Finalizada")
            } else {
                console.log('No se pudo eliminar la sesión')
            }
        } catch (error) {
            console.error(error, "Error desde Catch");
            showAlertWithMessageWithMessage('Error', 'Ocurrió un error al iniciar sesión con bryancito');
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            // Restablecer los estados de usuario y contrasenia cuando la pantalla se enfoca
            setUsuario('');
            setContrasenia('');
        }, [])
    );


    // Función para validar si hay una sesión activa
    const validarSesion = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=getUser`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.status === 1) {
                navigation.navigate('TabNavigator');
                console.log("Se ingresa con la sesión activa")
            } else {
                console.log("No hay sesión activa")
                return
            }
        } catch (error) {
            console.error(error);
            showAlertWithMessageWithMessage('Error', 'Ocurrió un error al validar la sesión');
        }
    };

    // Función para manejar el proceso de inicio de sesión
    const handlerLogin = async () => {
        if (!usuario.trim() || !contrasenia.trim()) {
            showAlertWithMessageWithMessage('Por favor completa todos los campos'); // Verifica que los campos no estén vacíos
            return;
        }
        showAlertWithMessageWithMessage('Iniciando sesión...', true); // Muestra un mensaje de progreso
        try {
            const formData = new FormData();
            formData.append('alias', usuario);
            formData.append('clave', contrasenia);

            const response = await fetch(`${ip}/services/public/cliente.php?action=logIn`, {
                method: 'POST',
                body: formData
            });

            const text = await response.text();
            console.log('Response text:', text); // Muestra el texto de la respuesta

            const data = JSON.parse(text);

            if (data.status) {
                setContrasenia('');
                setUsuario('');
                showAlertWithMessageWithMessage('¡Bienvenido!'); // Muestra un mensaje de bienvenida
                setTimeout(() => {
                    navigation.navigate('TabNavigator'); // Navega a la siguiente pantalla
                    setshowAlertWithMessage(false);
                }, 2000);
            } else {
                console.log(data);
                showAlertWithMessageWithMessage(data.error); // Muestra un mensaje de error
            }
        } catch (error) {
            console.error('Error desde Catch:', error.message);
            showAlertWithMessageWithMessage('Ocurrió un error al iniciar sesión');  // Muestra un mensaje de error
        } finally {
            setShowProgress(false); // Oculta el indicador de progreso
        }
    };

    // Función para navegar hacia la pantalla de registro
    const irRegistrar = async () => {
        navigation.navigate('Registro');
    };

    // Función para navegar hacia la pantalla de recuperación de contraseña
    const Recuperar = async () => {
        navigation.navigate('RecuperarContrasenia');
    };

    // Efecto para validar la sesión al montar el componente
    useEffect(() => {
        validarSesion();
    }, []);

    return (
        <View style={styles.container}>
            <Text onPress={cerrarSesion} style={styles.welcomeText}>Bienvenido</Text>
            <TextInput
                value={usuario}
                onChangeText={setUsuario}
                style={styles.input}
                placeholder="Alias"
            />
            <TextInput
                value={contrasenia}
                onChangeText={setContrasenia}
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry={true}
            />
            <TouchableOpacity onPress={Recuperar}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={irRegistrar}>
                <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlerLogin} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
    <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
</TouchableOpacity>

            
            <AwesomeAlert
                show={showAlertWithMessage}
                showProgress={showProgress}
                title="Alerta"
                message={alertMessage}
                closeOnTouchOutside={!showProgress}
                closeOnHardwareBackPress={!showProgress}
                showCancelButton={false}
                showConfirmButton={!showProgress}
                confirmText="OK"
                confirmButtonColor="gray"
                onConfirmPressed={() => {
                    setshowAlertWithMessage(false);
                }}
                contentContainerStyle={styles.alertContentContainer}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
                confirmButtonStyle={styles.alertConfirmButton}
                confirmButtonTextStyle={styles.alertConfirmButtonText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 18,
    },
    forgotPasswordText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    registerText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 40,
        alignSelf: 'flex-start',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    loginButtonText: {
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