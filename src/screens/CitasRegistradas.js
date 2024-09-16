import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Constantes from '../../utils/constantes';
import CitaCard from '../components/Cards/CitaCard';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function CitasRegistradas({ navigation }) {
    const ip = Constantes.IP;
    const [dataCitas, setDataCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(''); // 'success', 'error', 'confirm'
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedCitaId, setSelectedCitaId] = useState(null);

    // Función para cargar las citas
    const fetchCitas = async () => {
        setLoading(true); // Inicia el loading
        try {
            const response = await fetch(`${ip}/services/public/citas.php?action=readAllByClientMobile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_cliente: Constantes.ID_CLIENTE }),
            });

            const textResponse = await response.text(); // Obtener la respuesta como texto

            try {
                const result = JSON.parse(textResponse); // Intentar parsear como JSON
                console.log('Datos recibidos:', result.dataset);

                if (result.status === 1) {
                    // Procesar los datos para cada cita
                    const citas = result.dataset.map(cita => ({
                        ...cita,
                        servicios: cita.servicios ? cita.servicios.split(',').map(servicio => servicio.trim()) : [],
                    }));

                    console.log('Datos agrupados:', citas);
                    setDataCitas(citas);
                } else {
                    setAlertMessage(result.error || 'No se pudieron cargar las citas.');
                    setAlertType('error');
                    setShowAlert(true);
                }
            } catch (jsonError) {
                console.error('Error al parsear JSON:', jsonError);
                setAlertMessage('Respuesta del servidor no es un JSON válido.');
                setAlertType('error');
                setShowAlert(true);
            }

        } catch (error) {
            setAlertMessage(`Ocurrió un error al obtener las citas: ${error.message}`);
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    // Llama a fetchCitas cada vez que la pantalla reciba el enfoque
    useFocusEffect(
        useCallback(() => {
            fetchCitas();
        }, [])
    );

    const handleEdit = (idCita) => {
        if (!idCita) {
            showAlert('Error', 'ID de cita inválido');
            return;
        }
        console.log('Editando cita con ID:', idCita);
        navigation.navigate('EditarCita', { citaId: idCita });
    };

    const handleDelete = (id_cita) => {
        setSelectedCitaId(id_cita);
        setAlertMessage('¿Estás seguro de que deseas eliminar esta cita?');
        setAlertType('confirm');
        setShowAlert(true);
    };

    const confirmDelete = async () => {
        if (selectedCitaId === null) return;

        try {
            const response = await fetch(`${ip}/services/public/citas.php?action=deleteRow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_cita: selectedCitaId }),
            });

            const result = await response.json(); // Obtener y parsear la respuesta como JSON
            console.log('Respuesta del servidor:', result);

            if (result.status === true) { // Cambiar la comparación a true
                setDataCitas(prevCitas => prevCitas.filter(cita => cita.id_cita !== selectedCitaId));
                setAlertMessage('Cita eliminada correctamente.');
                setAlertType('success');
                setShowAlert(true);
            } else {
                setAlertMessage(result.error || 'No se pudo eliminar la cita.');
                setAlertType('error');
                setShowAlert(true);
            }
        } catch (error) {
            setAlertMessage(`Ocurrió un error al eliminar la cita: ${error.message}`);
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setSelectedCitaId(null); // Reinicia el ID seleccionado
        }
    };

    const cancelDelete = () => {
        setSelectedCitaId(null); // Reinicia el ID seleccionado
        setShowAlert(false); // Cierra la alerta
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.header}>Mis citas</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={dataCitas}
                        keyExtractor={(item) => item.id_cita ? item.id_cita.toString() : Math.random().toString()}
                        renderItem={({ item }) => (
                            <CitaCard
                                id_cita={item.id_cita}
                                fecha={item.fecha_cita}
                                hora={item.hora_cita}
                                vehiculo={item.vehiculo}
                                servicios={item.servicios}
                                estado={item.estado_cita}
                                onEdit={() => handleEdit(item.id_cita)}
                                onDelete={() => handleDelete(item.id_cita)} // Pasar ID de la cita a la función de eliminación
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.text}>No hay citas registradas</Text>}
                    />
                )}
                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title={alertType === 'success' ? 'Éxito' : alertType === 'error' ? 'Error' : alertType === 'confirm' ? 'Confirmar' : 'Información'}
                    message={alertMessage}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={alertType !== ''}
                    showCancelButton={alertType === 'confirm'}
                    confirmText="Aceptar"
                    cancelText="Cancelar"
                    confirmButtonColor={alertType === 'success' ? 'gray' : alertType === 'error' ? '#dc3545' : 'gray'}
                    cancelButtonColor='#DC3545'
                    confirmButtonTextStyle={styles.alertConfirmButtonText}
                    confirmButtonStyle={styles.alertConfirmButton}
                    cancelButtonTextStyle={styles.alertConfirmButtonText}
                    cancelButtonStyle={styles.alertConfirmButton}
                    titleStyle={styles.alertTitle}
                    messageStyle={styles.alertMessage}
                    contentContainerStyle={styles.alertContentContainer}
                    onConfirmPressed={() => {
                        if (alertType === 'confirm') {
                            confirmDelete();
                        } else {
                            setShowAlert(false);
                        }
                    }}
                    onCancelPressed={cancelDelete}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        textAlign: 'center',
    },
    text: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginTop: 20,
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