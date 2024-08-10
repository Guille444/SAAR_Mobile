import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';
import { useFocusEffect } from '@react-navigation/native';

export default function Vehiculo({ navigation }) {
  const ip = Constantes.IP;

  const [modelos, setModelos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [año, setAño] = useState('');
  const [matricula, setMatricula] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState({ modelos: false, marcas: false });
  const [errors, setErrors] = useState({ modelos: '', marcas: '', matricula: '' });
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: '',
    message: '',
    confirmText: 'OK',
    onConfirm: () => {},
  });

  const alertShown = useRef(false);

  const fetchData = async (endpoint, params, setData, setLoadingKey, setErrorKey) => {
    setLoading(prevState => ({ ...prevState, [setLoadingKey]: true }));
    try {
      const queryParams = params ? `&${new URLSearchParams(params)}` : '';
      const response = await fetch(`${ip}/services/public/vehiculo.php?action=${endpoint}${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.status === 0) {
        setErrors(prevState => ({ ...prevState, [setErrorKey]: data.error || `No se encontraron ${endpoint}` }));
        setData([]);
      } else {
        setData(data.dataset || []);
        setErrors(prevState => ({ ...prevState, [setErrorKey]: '' }));
      }
    } catch (error) {
      setErrors(prevState => ({ ...prevState, [setErrorKey]: `Error al obtener ${endpoint}` }));
      console.error(`Error de red ${endpoint}:`, error);
      setData([]);
    } finally {
      setLoading(prevState => ({ ...prevState, [setLoadingKey]: false }));
    }
  };

  const fetchMarcas = useCallback(async () => {
    await fetchData('getMarcas', null, setMarcas, 'marcas', 'marcas');
  }, [ip]);

  const fetchModelos = useCallback(async (marcaSeleccionada) => {
    if (!marcaSeleccionada) {
      setModelos([]);
      return;
    }
    await fetchData('getModelosByMarca', { id_marca: marcaSeleccionada }, setModelos, 'modelos', 'modelos');
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

  const registrarVehiculo = async () => {
    if (!marca || !modelo || !año || !matricula || !color || !vin) {
      showAlert('Error', 'Todos los campos deben ser completados.');
      return;
    }

    if (!validarMatricula(matricula)) {
      setErrors(prevState => ({ ...prevState, matricula: 'La matrícula debe seguir el formato especificado.' }));
      return;
    }

    setErrors(prevState => ({ ...prevState, matricula: '' }));

    try {
      const response = await fetch(`${ip}/services/public/vehiculo.php?action=createRow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_marca: marca,
          id_modelo: modelo,
          año: año,
          placa: matricula,
          color: color,
          vin: vin
        })
      });

      const text = await response.text();
      console.log('Response text:', text);

      try {
        const data = JSON.parse(text);
        if (data.status === 1) {
          showAlert('Registro', 'Vehículo registrado exitosamente', () => {
            clearFields();
          });
        } else {
          showAlert('Error', data.error || 'Error al registrar el vehículo');
        }
      } catch (jsonError) {
        showAlert('Error', 'Error al procesar la respuesta del servidor');
        console.error('Error al analizar JSON:', jsonError);
      }

    } catch (error) {
      showAlert('Error', 'Error al conectar con el servidor');
      console.error('Error en el registro del vehículo:', error);
    }
  };

  const showAlert = (title, message, onConfirm) => {
    setAlertConfig({
      show: true,
      title,
      message,
      confirmText: 'OK',
      onConfirm: () => {
        setAlertConfig(prevConfig => ({ ...prevConfig, show: false }));
        if (onConfirm) onConfirm();
        alertShown.current = false;
      }
    });
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

  const irVehiculos = async () => {
    navigation.navigate('VehiculosRegistrados');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar vehículo</Text>

      <View style={styles.pickerContainer}>
        {loading.marcas ? (
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
            {errors.marcas ? <Text style={styles.error}>{errors.marcas}</Text> : null}
          </>
        )}
      </View>

      <View style={styles.pickerContainer}>
        {loading.modelos ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <>
            <Picker
              selectedValue={modelo}
              style={styles.picker}
              onValueChange={(itemValue) => setModelo(itemValue)}
              enabled={marca !== ''}
            >
              <Picker.Item label="Seleccione un modelo" value="" />
              {modelos.map((item) => (
                <Picker.Item key={item.id_modelo} label={item.modelo_vehiculo} value={item.id_modelo} />
              ))}
            </Picker>
            {errors.modelos ? <Text style={styles.error}>{errors.modelos}</Text> : null}
          </>
        )}
      </View>

      {/* Campos adicionales */}
      <TextInput
        style={styles.input}
        placeholder="Año"
        value={año}
        onChangeText={(text) => setAño(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={(text) => setMatricula(text)}
        onBlur={() => {
          if (!validarMatricula(matricula)) {
            setErrors(prevState => ({ ...prevState, matricula: 'La matrícula debe seguir el formato especificado.' }));
          } else {
            setErrors(prevState => ({ ...prevState, matricula: '' }));
          }
        }}
      />
      {errors.matricula ? <Text style={styles.error}>{errors.matricula}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={(text) => setColor(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="VIN"
        value={vin}
        onChangeText={(text) => setVin(text)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={registrarVehiculo}
      >
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={irVehiculos}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Ver vehículos registrados</Text>
      </TouchableOpacity>

      <AwesomeAlert
        show={alertConfig.show}
        title={alertConfig.title}
        message={alertConfig.message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText={alertConfig.confirmText}
        confirmButtonColor="#007bff"
        onConfirmPressed={alertConfig.onConfirm}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  secondaryButtonText: {
    color: '#ffffff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
