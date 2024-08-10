import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Constantes from '../../utils/constantes';
import CitaCard from '../components/CitaCard';

export default function CitasRegistradas({ navigation }) {
  const ip = Constantes.IP;
  const [dataCitas, setDataCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCitas = async () => {
    try {
      const response = await fetch(`${ip}/services/public/citas.php?action=readAllByClientMobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_cliente: Constantes.ID_CLIENTE }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 1) {
        setDataCitas(result.dataset || []);
      } else {
        Alert.alert('Error', result.error || 'No se pudieron cargar las citas.');
      }
    } catch (error) {
      Alert.alert('Error', `Ocurrió un error al obtener las citas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleCitaPress = (cita) => {
    navigation.navigate('Citas', { cita });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <Text style={styles.text}>Cargando...</Text>
        ) : (
          <FlatList
            data={dataCitas}
            keyExtractor={(item, index) => item.id_cita?.toString() || index.toString()}
            renderItem={({ item }) => (
              <CitaCard
                fecha={item.fecha_cita}
                vehiculo={item.vehiculo}
                servicios={item.servicios}
                onPress={() => handleCitaPress(item.id_vehiculo, item.nombre_servicio, item.fecha_cita)}
              />
            )}
            ListEmptyComponent={<Text style={styles.text}>No hay citas registradas</Text>}
          />
        )}
      </SafeAreaView>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>VOLVER</Text>
      </TouchableOpacity>
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
});
