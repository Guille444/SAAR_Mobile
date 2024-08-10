import React from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList, ScrollView, SafeAreaView, Image, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import VehiculoCard from '../components/VehiculoCard';
import ModalVehiculo from '../components/ModalVehiculo';
import * as Constantes from '../../utils/constantes';
import Constants from 'expo-constants';


export default function VehiculosRegistrados({ navigation }) {

  const ip = Constantes.IP;
  const [dataVehiculos, setDataVehiculos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [Modelo, setModelo] = useState('');
  const [Marca, setMarca] = useState('');
  const [Año, setAño] = useState('');
  const [Placa, setPlaca] = useState('');
  const [Color, setColor] = useState('');
  const [Vin, setVin] = useState('');


  const irVehiculos = async () => {
    navigation.navigate('Vehículo');
  };

  const handleVehiculos = (modelo, marca,año,placa,color,vin) => {
    setModalVisible(true)
    setModelo(modelo)
    setMarca(marca)
    setAño(año)
    setPlaca(placa)
    setColor(color)
    setVin(vin)
  }

  const getVehiculos = async () => {
    try {

      //utilizar la direccion IP del servidor y no localhost
      const response = await fetch(`${ip}/services/public/vehiculo.php?action=readAllCliente`, {
        method: 'GET',
      });

      const data = await response.json();
      console.log(data);
      if (data.status) {
        setDataVehiculos(data.dataset)
      } else {
        console.log(data);
        // Alert the user about the error
        Alert.alert('Error categorias', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al listar las categorias');
    }
  }

  useEffect(() => {
    getVehiculos();
  }, []);

  return (
    <View style={styles.container}>
      <ModalVehiculo
        visible={modalVisible}
        cerrarModal={setModalVisible}
        Modelo={Modelo}
        Marca={Marca}
        Año={Año}
        Placa={Placa}
        Color={Color}
        Vin={Vin}
      ></ModalVehiculo>

      <SafeAreaView style={styles.containerFlat}>
        <FlatList
          data={dataVehiculos}
          keyExtractor={(item) => item.id_vehiculo}
          renderItem={({ item }) => ( // Util izamos destructuración para obtener directamente el item
            <VehiculoCard
              nombreMarca={item.marca_vehiculo}
              nombreModelo={item.modelo_vehiculo}
              placaVehiculo={item.placa_vehiculo}
              accionBotonVehiculo={() => handleVehiculos(item.modelo_vehiculo, item.marca_vehiculo, item.año_vehiculo, item.placa_vehiculo, item.color_vehiculo, item.vin_motor)}
            />
          )}
        />
      </SafeAreaView>
      <TouchableOpacity onPress={irVehiculos} style={styles.loginButton}>
        <Text style={styles.textVolver}>VOLVER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco
  },
  text: {
    fontSize: 18,
    color: '#000', // Texto negro
  },
  containerFlat: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  loginButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 10,
  },
  textVolver: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});
