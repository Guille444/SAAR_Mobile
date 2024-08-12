import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';
import { useFocusEffect } from '@react-navigation/native';

export default function EditarVehiculo({ route, navigation }) {
    const ip = Constantes.IP;
    const { vehiculoId } = route.params; // Obtener el ID del vehículo desde las props

    // Estados para manejar datos y mostrar la interfaz
    const [modelos, setModelos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [año, setAño] = useState('');
    const [matricula, setMatricula] = useState('');
    const [color, setColor] = useState('');
    const [vin, setVin] = useState('');
    const [loadingModelos, setLoadingModelos] = useState(false);
    const [loadingMarcas, setLoadingMarcas] = useState(false);
    const [errorModelos, setErrorModelos] = useState('');
    const [errorMarcas, setErrorMarcas] = useState('');
    const [errorMatricula, setErrorMatricula] = useState('');
    const [alertConfig, setAlertConfig] = useState({
        show: false,
        title: '',
        message: '',
        confirmText: 'OK',
        onConfirm: () => { },
    });

    // Funcion para elegin una marca y moodelos de la marca
    const fetchData = async (endpoint, params, setData, setError, setLoading) => {
        setLoading(true);
        try {
            const queryParams = params ? `&${new URLSearchParams(params)}` : '';
            const response = await fetch(`${ip}/services/public/vehiculo.php?action=${endpoint}${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data.status === 0) {
                setError(data.error || `No se encontraron ${endpoint}`);
                setData([]);
            } else {
                setData(data.dataset || []);
                setError('');
            }
        } catch (error) {
            setError(`Error al obtener ${endpoint}`);
            console.error(`Error de red ${endpoint}:`, error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Funcion para obtener las marcas
    const fetchMarcas = useCallback(async () => {
        await fetchData('getMarcas', null, setMarcas, setErrorMarcas, setLoadingMarcas);
    }, [ip]);

    // Funcion para obtener los modelos
    const fetchModelos = useCallback(async (marcaSeleccionada) => {
        if (!marcaSeleccionada) {
            setModelos([]);
            return;
        }
        console.log(`Fetching modelos for marca ID: ${marcaSeleccionada}`);
        await fetchData('getModelosByMarca', { id_marca: marcaSeleccionada }, setModelos, setErrorModelos, setLoadingModelos);
    }, [ip]);

    // Funcion para elegir un vehiuclo y traer sus detalles
    const fetchVehiculoDetails = useCallback(async () => {
        try {
            const response = await fetch(`${ip}/services/public/vehiculo.php?action=readOne`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_vehiculo: vehiculoId })
            });

            const text = await response.text(); // Obtener la respuesta como texto
            console.log('Response text:', text); // Imprimir la respuesta para depuración

            try {
                const data = JSON.parse(text); // Intentar analizar el texto como JSON
                if (data.status === 1) {
                    const vehiculo = data.dataset;
                    setMarca(vehiculo.id_marca || '');
                    setModelo(vehiculo.id_modelo || '');
                    setAño(vehiculo.año_vehiculo || '');
                    setMatricula(vehiculo.placa_vehiculo || '');
                    setColor(vehiculo.color_vehiculo || '');
                    setVin(vehiculo.vin_motor || '');
                } else {
                    showAlert('Error', data.error || 'No se pudo cargar los detalles del vehículo');
                }
            } catch (jsonError) {
                showAlert('Error', 'Error al procesar la respuesta del servidor');
                console.error('Error al analizar JSON:', jsonError);
            }
        } catch (error) {
            showAlert('Error', 'Error al conectar con el servidor');
            console.error('Error al obtener los detalles del vehículo:', error);
        }
    }, [ip, vehiculoId]);

    useEffect(() => {
        fetchMarcas();
        fetchVehiculoDetails();
    }, [fetchMarcas, fetchVehiculoDetails]);

    useEffect(() => {
        fetchModelos(marca);
    }, [marca, fetchModelos]);

    const validarMatricula = (matricula) => {
        const regex = /^[A-Z]{1,2}\s?[0-9A-Z]{3,7}$/;
        return regex.test(matricula);
    };

    // Funcion para actualizar un vehiculo
    const actualizarVehiculo = async () => {
        if (!marca || !modelo || !año || !matricula || !color || !vin) {
            showAlert('Error', 'Todos los campos deben ser completados.');
            return;
        }

        if (!validarMatricula(matricula)) {
            setErrorMatricula('La matrícula debe seguir el formato especificado.');
            return;
        }

        setErrorMatricula('');

        try {
            const response = await fetch(`${ip}/services/public/vehiculo.php?action=updateRow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_vehiculo: vehiculoId, // Cambia "id" a "id_vehiculo"
                    id_marca: marca,
                    id_modelo: modelo,
                    año: año,
                    placa: matricula,
                    color: color,
                    vin: vin
                })
            });

            const text = await response.text(); // Obtener la respuesta como texto
            console.log('Response text:', text); // Imprimir la respuesta para depuración

            try {
                const data = JSON.parse(text); // Intentar analizar el texto como JSON
                if (data.status === 1) {
                    showAlert('Información', 'Vehículo actualizado exitosamente', () => {
                        navigation.goBack(); // Volver a la pantalla anterior después de la actualización exitosa
                    });
                } else {
                    showAlert('Error', data.error || 'Error al actualizar el vehículo');
                }
            } catch (jsonError) {
                showAlert('Error', 'Error al procesar la respuesta del servidor');
                console.error('Error al analizar JSON:', jsonError);
            }

        } catch (error) {
            showAlert('Error', 'Error al conectar con el servidor');
            console.error('Error en la actualización del vehículo:', error);
        }
    };

    const showAlert = (title, message, onConfirm) => {
        setAlertConfig(prevConfig => ({
            show: true,
            title,
            message,
            confirmText: 'OK',
            onConfirm: () => {
                setAlertConfig(prevConfig => ({ ...prevConfig, show: false }));
                if (onConfirm) onConfirm();
            }
        }));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar vehículo</Text>
            <View style={styles.pickerContainer}>
                {loadingMarcas ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    <>
                        <Picker
                            selectedValue={marca}
                            style={styles.picker}
                            onValueChange={(itemValue) => setMarca(itemValue)}
                        >
                            <Picker.Item label="Seleccione una marca" value="" />
                            {marcas.map((item) => (
                                <Picker.Item key={item.id_marca} label={item.marca_vehiculo} value={item.id_marca} />
                            ))}
                        </Picker>
                        {errorMarcas ? <Text style={styles.error}>{errorMarcas}</Text> : null}
                    </>
                )}
            </View>

            <View style={styles.pickerContainer}>
                {loadingModelos ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    <>
                        <Picker
                            selectedValue={modelo}
                            style={styles.picker}
                            onValueChange={(itemValue) => setModelo(itemValue)}
                        >
                            <Picker.Item label="Seleccione un modelo" value="" />
                            {modelos.map((item) => (
                                <Picker.Item key={item.id_modelo} label={item.modelo_vehiculo} value={item.id_modelo} />
                            ))}
                        </Picker>
                        {errorModelos ? <Text style={styles.error}>{errorModelos}</Text> : null}
                    </>
                )}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Matrícula"
                value={matricula}
                onChangeText={setMatricula}
            />
            {errorMatricula ? <Text style={styles.error}>{errorMatricula}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Año"
                keyboardType="numeric"
                value={año}
                onChangeText={setAño}
            />
            <TextInput
                style={styles.input}
                placeholder="Color"
                value={color}
                onChangeText={setColor}
            />
            <TextInput
                style={styles.input}
                placeholder="VIN"
                value={vin}
                onChangeText={setVin}
            />
            <TouchableOpacity style={styles.button} onPress={actualizarVehiculo}>
                <Text style={styles.buttonText}>ACTUALIZAR VEHÍCULO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>VOLVER</Text>
            </TouchableOpacity>

            <AwesomeAlert
                show={alertConfig.show}
                title={alertConfig.title}
                message={alertConfig.message}
                showConfirmButton={true}
                confirmText={alertConfig.confirmText}
                confirmButtonColor="gray"
                onConfirmPressed={() => {
                    setAlertConfig(prevConfig => ({ ...prevConfig, show: false }));
                    if (alertConfig.onConfirm) alertConfig.onConfirm();
                }}
                contentContainerStyle={styles.alertContentContainer}
                titleStyle={styles.alertTitle}
                messageStyle={styles.alertMessage}
                confirmButtonStyle={styles.alertConfirmButton}
                confirmButtonTextStyle={styles.alertConfirmButtonText}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#f0f0f0', // Fondo gris claro similar al botón
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        fontSize: 16,
        borderRadius: 8, // Bordes redondeados para el input
        backgroundColor: '#f9f9f9', // Fondo claro para los campos de entrada
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
    },
    button: {
        width: '100%',
        padding: 12,
        backgroundColor: '#000',
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    button2: {
        width: '100%',
        padding: 12,
        backgroundColor: '#FEAF00',
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginTop: 4,
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