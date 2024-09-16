import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';
import { useFocusEffect } from '@react-navigation/native';

export default function Vehiculo({ navigation }) {
  const ip = Constantes.IP; // Obtiene la IP del servidor desde las constantes

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

  const alertShown = useRef(false);

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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Vehículo</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    });

    fetchMarcas();
  }, [fetchMarcas, navigation]);

  useEffect(() => {
    fetchModelos(marca);
  }, [marca, fetchModelos]);

  const validarMatricula = (matricula) => {
    const regex = /^[A-Z]{1,2}\s?[0-9A-Z]{3,7}$/;
    return regex.test(matricula);
  };

  // Funcion para registrar un vehiculo
  const registrarVehiculo = async () => {
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
      const response = await fetch(`${ip}/services/public/vehiculo.php?action=createRow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
          if (!alertShown.current) {
            showAlert('Registro', 'Vehículo registrado exitosamente', () => {
              clearFields(); // Limpiar los campos después del registro exitoso
              alertShown.current = false; // Reset the flag after successful alert
            });
          }
        } else {
          if (!alertShown.current) {
            showAlert('Error', data.error || 'Error al registrar el vehículo');
          }
        }
      } catch (jsonError) {
        if (!alertShown.current) {
          showAlert('Error', 'Error al procesar la respuesta del servidor');
        }
        console.error('Error al analizar JSON:', jsonError);
      }

    } catch (error) {
      if (!alertShown.current) {
        showAlert('Error', 'Error al conectar con el servidor');
      }
      console.error('Error en el registro del vehículo:', error);
    }
  };

  const showAlert = (title, message, onConfirm) => {
    if (!alertShown.current) {
      setAlertConfig(prevConfig => ({
        show: true,
        title,
        message,
        confirmText: 'OK',
        onConfirm: () => {
          setAlertConfig(prevConfig => ({ ...prevConfig, show: false }));
          if (onConfirm) onConfirm();
          alertShown.current = false; // Reset the flag after the alert has been shown
        }
      }));
      alertShown.current = true; // Set the flag to true when the alert is about to be shown
    }
  };

  const clearFields = () => {
    setMarca('');
    setModelo('');
    setAño('');
    setMatricula('');
    setColor('');
    setVin('');
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearFields();
        alertShown.current = false;
      };
    }, [])
  );

  // Función para navegar hacia la pantalla de vehiculos registrados
  const irVehiculos = async () => {
    navigation.navigate('VehiculosRegistrados');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar vehículo</Text>

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
        maxLength={4} // Limita la longitud del input a 4 caracteres
        value={año}
        onChangeText={(text) => {
          // Asegúrate de que solo se ingresen números y no más de 4 dígitos
          const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
          setAño(numericText);
        }}
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
      <TouchableOpacity style={styles.button} onPress={registrarVehiculo}>
        <Text style={styles.buttonText}>REGISTRAR VEHICULO</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={irVehiculos}>
        <Text style={styles.buttonText}>VER MIS VEHICULOS</Text>
      </TouchableOpacity>

      <AwesomeAlert
        show={alertConfig.show}
        title={alertConfig.title}
        message={alertConfig.message}
        showConfirmButton={true}
        confirmText={alertConfig.confirmText}
        confirmButtonColor="gray"
        onConfirmPressed={() => {
          console.log(`Alert confirmed with title: ${alertConfig.title}`);
          setAlertConfig(prevConfig => ({ ...prevConfig, show: false }));
          if (alertConfig.onConfirm) alertConfig.onConfirm();
          alertShown.current = false; // Reset the flag on confirm
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
