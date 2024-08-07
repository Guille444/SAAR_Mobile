import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Constantes from '../../utils/constantes';


export default function RegistroVehiculo({ navigation }) {

  useEffect(() => {
    // Configura el título del encabezado de navegación
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Vehículo</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    });

    // Fetch modelos y marcas desde la API o base de datos
    fetchMarcas();
    //fetchModelos();

  }, []);

  const ip = Constantes.IP;

  const [modelos, setModelos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [año, setAño] = useState('');
  const [matricula, setMatricula] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');

  const fetchModelos = async () => {
    try {
      // Reemplaza con la URL real de tu API o base de datos
      const response = await fetch(`${ip}/services/public/modelo.php?action=readAll`, {
        method: 'GET'
      });
      const data = await response.json();
      console.log(data);
      setModelos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMarcas = async () => {
    try {
      // Reemplaza con la URL real de tu API o base de datos
      const response = await fetch(`${ip}/services/public/marca.php?action=readAll`, {
        method: 'GET'
      });
      const data = await response.json();
      console.log(data);
      setMarcas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const registrarVehiculo = async () => {
    if (!modelo.trim() || !marca.trim() || !año.trim() || !matricula.trim() ||
      !color.trim() || !vin.trim()) {
      showAlertWithMessage("Debes llenar todos los campos");
      return;
    }

    try {
      // Creación de un objeto FormData para enviar los datos del formulario.
      const formData = new FormData();
      formData.append('marcaVehiculo', marca);
      formData.append('modeloVehiculo', modelo);
      formData.append('anioVehiculo', año);
      formData.append('placaVehiculo', matricula);
      formData.append('colorVehiculo', color);
      formData.append('vimVehiculo', vin);

      // Envío de los datos del formulario al servidor.
      const response = await fetch(`${ip}/services/public/vehiculo.php?action=createRow`, {
        method: 'POST',
        body: formData
      });

      const responseText = await response.text();
      console.log(responseText); // Muestra la respuesta cruda en la consola

      const data = JSON.parse(responseText);
      if (data.status) {
        showAlertWithMessage('Vehiculo agregado correctamente');
      } else {
        showAlertWithMessage(data.error);
      }
    } catch (error) {
      showAlertWithMessage('Ocurrió un problema al agregar el producto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar vehículo</Text>

      {/* Selector de marca */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={marca}
          style={styles.picker}
          onValueChange={(itemValue) => setMarca(itemValue)}
        >
          <Picker.Item label="Seleccione una marca" value="" />
          {marcas.map((marca, id_marca) => (
            <Picker.Item key={marca.id_marca} label={marca.marca_vehiculo} value={marca.id_marca} />
          ))}
        </Picker>
      </View>

      {/* Selector de modelo */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={modelo}
          style={styles.picker}
          onValueChange={(itemValue) => setModelo(itemValue)}
        >
          <Picker.Item label="Seleccione un modelo" value="" />
          {modelos.map((modelo, id_modelo) => (
            <Picker.Item key={modelo.id_modelo} label={modelo.modelo_vehiculo} value={modelo.id_modelo} />
          ))}
        </Picker>
      </View>

      {/* Campos de entrada para otros datos del vehículo */}
      <TextInput
        style={styles.input}
        placeholder="Año"
        value={año}
        onChangeText={setAño}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        style={styles.input}
        placeholder="VIN del motor"
        value={vin}
        onChangeText={setVin}
      />

      <TouchableOpacity onPress={registrarVehiculo} style={styles.button}>
        <Text style={styles.buttonText}>REGISTRAR VEHÍCULO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
    alignSelf: 'center',
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden', // Asegura que el borde redondeado se muestre correctamente
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
});
