import React, { useState, useEffect} from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Constantes from '../../utils/constantes'

const ModalVehiculo = ({ visible, cerrarModal, Modelo, Marca, Año, Placa, Color, Vin }) => {

  const ip = Constantes.IP;

  const handleCerrarModal = () => {
    cerrarModal(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        cerrarModal(!visible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Marca: {Marca}</Text>
          <Text style={styles.modalText}>Modelo: {Modelo}</Text>
          <Text style={styles.modalText}>Año: {Año}</Text>
          <Text style={styles.modalText}>Placa: {Placa}</Text>
          <Text style={styles.modalText}>Color: {Color}</Text>
          <Text style={styles.modalText}>Vin: {Vin}</Text>
          <TouchableOpacity
        style={styles.button}
        onPress={handleCerrarModal}>
        <Text style={styles.buttonText}>Cerrar</Text>
      </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: 200,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ModalVehiculo;
