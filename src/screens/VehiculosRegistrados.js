import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import VehiculoCard from '../components/Cards/VehiculoCard'; // Componente para la tarjeta
import * as Constantes from '../../utils/constantes';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import { useFocusEffect } from '@react-navigation/native';

export default function VehiculosRegistrados() {

      // Estados para manejar datos y mostrar la interfaz
    const [vehiculos, setVehiculos] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(''); // 'success', 'error', or 'confirm'
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedVehiculoId, setSelectedVehiculoId] = useState(null);
    const ip = Constantes.IP; // Usar la IP del archivo de constantes
    const navigation = useNavigation(); // Obtén el objeto navigation

    // Funcion para traer los vehiculos del cliente
    useFocusEffect(
        React.useCallback(() => {
            fetch(`${ip}/services/public/vehiculo.php?action=readByCliente`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 1) {
                        if (data.dataset && data.dataset.length > 0) {
                            setVehiculos(data.dataset);
                            setAlertMessage(''); // Limpiar el mensaje de alerta si hay vehículos
                            setShowAlert(false); // Asegurarse de que no se muestre alerta si hay vehículos
                        } else {
                            setVehiculos([]); // Asegurarse de que la lista de vehículos esté vacía
                            // setAlertMessage('No se encontraron vehículos para este cliente.');
                            // setAlertType('info'); // Cambia el tipo de alerta a 'info'
                            // setShowAlert(true); // Mostrar alerta
                        }
                    } else {
                        // Mostrar alerta solo para errores críticos
                        // setAlertMessage('No se encontraron vehículos para este cliente.');
                        // setAlertType('info'); // Cambia el tipo de alerta a 'info'
                        // setShowAlert(true);
                    }
                })
                .catch(error => {
                    // Mostrar alerta solo para errores críticos
                    setAlertMessage('Error en la solicitud: ' + error.message);
                    setAlertType('error');
                    setShowAlert(true);
                });
        }, [ip])
    );

    const handleEdit = (vehiculoId) => {
        // Navegar a la pantalla de edición con el ID del vehículo
        navigation.navigate('EditarVehiculo', { vehiculoId });
    };

    // Funcion para eliminar un vehiculo
    const handleDelete = (vehiculoId) => {
        setSelectedVehiculoId(vehiculoId);
        setAlertMessage('¿Estás seguro de que deseas eliminar este vehículo?');
        setAlertType('confirm');
        setShowAlert(true);
    };

    const confirmDelete = () => {
        if (selectedVehiculoId === null) return;

        fetch(`${ip}/services/public/vehiculo.php?action=deleteRow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                id_vehiculo: selectedVehiculoId.toString(),
            }).toString(), // Asegúrate de convertir los parámetros a una cadena
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 1) {
                    setVehiculos(prevVehiculos => prevVehiculos.filter(vehiculo => vehiculo.id_vehiculo !== selectedVehiculoId));
                    setAlertMessage(data.message);
                    setAlertType('success');
                    setShowAlert(true);
                } else {
                    setAlertMessage(data.error);
                    setAlertType('error');
                    setShowAlert(true);
                }
            })
            .catch(error => {
                setAlertMessage('Error al eliminar el vehículo: ' + error.message);
                setAlertType('error');
                setShowAlert(true);
            });
        setSelectedVehiculoId(null); // Reinicia el ID seleccionado
    };

    const cancelDelete = () => {
        setSelectedVehiculoId(null); // Reinicia el ID seleccionado
        setShowAlert(false); // Cierra la alerta
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis vehículos</Text>
            {vehiculos.length === 0 && !showAlert ? (
                <Text style={styles.noVehiclesText}>No existen vehículos registrados para este cliente.</Text>
            ) : (
                <FlatList
                    data={vehiculos}
                    keyExtractor={(item) => item.id_vehiculo.toString()}
                    renderItem={({ item }) => (
                        <VehiculoCard
                            vehiculo={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                    contentContainerStyle={styles.listContainer} // Ajusta el espacio alrededor del FlatList
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
                confirmButtonColor={alertType === 'success' ? 'gray' : alertType === 'error' ? '#dc3545' : '#007bff'}
                cancelButtonColor='gray'
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20, // Agrega un poco de espacio en la parte superior
        paddingHorizontal: 10, // Agrega espacio a los lados
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10, // Espacio debajo del encabezado
        marginTop: 35, // Espacio encima del encabezado
        textAlign: 'center', // Centra el texto del encabezado
    },
    noVehiclesText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    listContainer: {
        paddingBottom: 20, // Espacio en la parte inferior
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