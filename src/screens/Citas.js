import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import { useFocusEffect } from '@react-navigation/native';
import * as Constantes from '../../utils/constantes';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function Citas({ navigation }) {
  const ip = Constantes.IP; // Obtiene la IP del servidor desde las constantes

  // Estados para manejar datos y mostrar la interfaz
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [modoHora, setModoHora] = useState('time');
  const [mostrarHora, setMostrarHora] = useState(false);
  const [modo, setModo] = useState('date');
  const [mostrar, setMostrar] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [vehiculo, setVehiculo] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Citas</Text>
        </View>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  // Carga los vehículos y servicios cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      cargarVehiculos();
      cargarServicios();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      // Limpiar los campos cuando la pantalla se enfoque
      setFecha(new Date());
      setVehiculo('');
      setServiciosSeleccionados([]);
    }, [])
  );

  // Función para cargar la lista de vehículos
  const cargarVehiculos = async () => {
    try {
      const respuesta = await fetch(`${ip}/services/public/citas.php?action=readAllByClient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_cliente: Constantes.ID_CLIENTE }),
      });

      const textoRespuesta = await respuesta.text();
      console.log('Respuesta cruda:', textoRespuesta);

      const datos = JSON.parse(textoRespuesta);

      if (datos.status === 1) {
        setVehiculos(datos.dataset);
      } else {
        setVehiculos([]); // Reset vehicles if there was an error
        console.error('Error al cargar los vehículos:', datos.error);
      }
    } catch (error) {
      setVehiculos([]); // Reset vehicles if there was an error
      console.error('Error al cargar los vehículos:', error);
    }
  };

  // Función para cargar la lista de servicios
  const cargarServicios = async () => {
    try {
      const respuesta = await fetch(`${ip}/services/public/citas.php?action=getServices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const datos = await respuesta.json();
      if (datos.status === 1) {
        setServicios(datos.dataset);
      } else {
        setServicios([]); // Reset services if there was an error
        console.error('Error al cargar los servicios:', datos.error);
      }
    } catch (error) {
      setServicios([]); // Reset services if there was an error
      console.error('Error al cargar los servicios:', error);
    }
  };

  const mostrarModo = (modoActual) => {
    setMostrar(true);
    setModo(modoActual);
  };

  const mostrarSelectorDeFecha = () => {
    mostrarModo('date');
  };

  const manejarConfirmacion = (evento, valorSeleccionado) => {
    if (evento.type === 'set' && valorSeleccionado) {
      if (modo === 'date') {
        setFecha(valorSeleccionado);
      } else if (modoHora === 'time') {
        setHora(valorSeleccionado);
      }
    }
    setMostrar(Platform.OS === 'ios'); // Oculta el selector en Android después de seleccionar
    setMostrarHora(false); // Oculta el selector de hora
  };

  // Manejo de la selección de hora
  const manejarSeleccionHora = (horaSeleccionada) => {
    // Actualiza el estado con la nueva hora
    setHora(horaSeleccionada);
    console.log('Hora seleccionada:', horaSeleccionada.toISOString());
  };

  // Función para manejar la confirmación de la hora
  const manejarConfirmacionHora = (evento, valorSeleccionado) => {
    if (evento.type === 'set' && valorSeleccionado) {
      manejarSeleccionHora(valorSeleccionado);
      setMostrarHora(false); // Oculta el selector de hora después de seleccionar
    }
  };

  const formatearHora = (hora) => {
    const opciones = { hour: '2-digit', minute: '2-digit', hour12: true };
    return hora.toLocaleTimeString([], opciones);
  };

  // Función para agendar una cita
  const manejarAgendar = async () => {
    if (!vehiculo) {
      setAlertTitle('Error');
      setAlertMessage('Por favor, seleccione un vehículo.');
      setAlertVisible(true);
      return;
    }

    if (serviciosSeleccionados.length === 0) {
      setAlertTitle('Error');
      setAlertMessage('Por favor, seleccione al menos un servicio.');
      setAlertVisible(true);
      return;
    }

    if (!fecha) {
      setAlertTitle('Error');
      setAlertMessage('Por favor, seleccione una fecha.');
      setAlertVisible(true);
      return;
    }

    if (!hora) {
      setAlertTitle('Error');
      setAlertMessage('Por favor, seleccione una hora.');
      setAlertVisible(true);
      return;
    }

    const cita = {
      id_vehiculo: vehiculo,
      id_servicio: serviciosSeleccionados,
      fecha_cita: fecha.toISOString().split('T')[0],
      hora_cita: hora.toISOString().split('T')[1].slice(0, 5), // Formato HH:mm
    };

    console.log('Datos enviados:', cita);

    try {
      const respuesta = await fetch(`${ip}/services/public/citas.php?action=createRow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cita),
      });

      if (!respuesta.ok) {
        throw new Error(`HTTP error! Status: ${respuesta.status}`);
      }

      const textoRespuesta = await respuesta.text();
      console.log('Respuesta del servidor en texto:', textoRespuesta);

      try {
        const datos = JSON.parse(textoRespuesta);
        console.log('Datos procesados:', datos);

        if (datos.status) {
          setAlertTitle('Éxito');
          setAlertMessage(datos.message || 'Cita agendada con éxito');
          setAlertVisible(true);
          // Limpiar los campos después de un registro exitoso
          setFecha(new Date());
          setHora(new Date());
          setVehiculo('');
          setServiciosSeleccionados([]);
        } else {
          console.error('Error en la respuesta:', datos.error);
          setAlertTitle('Error');
          setAlertMessage('Error al agendar la cita: ' + datos.error);
          setAlertVisible(true);
        }
      } catch (error) {
        console.error('Error al parsear la respuesta JSON:', error);
        setAlertTitle('Error');
        setAlertMessage('Error al procesar la respuesta del servidor.');
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      setAlertTitle('Error');
      setAlertMessage('Error al agendar la cita. Por favor, inténtelo nuevamente.');
      setAlertVisible(true);
    }
  };

  const mostrarSelectorDeHora = () => {
    setMostrarHora(true);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.titulo}>Agendar cita</Text>
    </View>
  );

  // Función para navegar hacia la pantalla de Citas agendadas
  const irCitas = async () => {
    navigation.navigate('CitasRegistradas');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={() => null} // No renderiza elementos de lista, solo el encabezado
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <View style={styles.contenedorPicker}>
              <Picker
                selectedValue={vehiculo}
                style={styles.picker}
                onValueChange={(valorSeleccionado) => setVehiculo(valorSeleccionado)}
              >
                <Picker.Item label="Seleccione un vehículo" value="" />
                {vehiculos.length === 0 ? (
                  <Picker.Item label="No se encontraron vehículos" value="" />
                ) : (
                  vehiculos.map((vehiculo) => (
                    <Picker.Item key={vehiculo.id_vehiculo} label={vehiculo.descripcion_vehiculo} value={vehiculo.id_vehiculo} />
                  ))
                )}
              </Picker>
            </View>
            <View style={styles.contenedorMultiSelect}>
              <MultiSelect
                items={servicios}
                uniqueKey="id_servicio"
                onSelectedItemsChange={(itemsSeleccionados) => setServiciosSeleccionados(itemsSeleccionados)}
                selectedItems={serviciosSeleccionados}
                selectText="Seleccione servicios"
                searchInputPlaceholderText="Buscar servicios..."
                tagRemoveIconColor="#000"
                tagBorderColor="#000"
                tagTextColor="#000"
                selectedItemTextColor="#000"
                selectedItemIconColor="#000"
                itemTextColor="#000"
                displayKey="nombre_servicio"
                searchInputStyle={{ color: '#000' }} // Texto en negro
                submitButtonColor="#000" // Botón negro
                submitButtonText="Seleccionar"
                styleDropdownMenu={styles.multiSelectDropdown}
                styleDropdownMenuSubsection={styles.multiSelectDropdownSubsection}
                styleTextDropdown={styles.multiSelectTextDropdown}
                styleListContainer={styles.multiSelectListContainer}
                styleRowList={styles.multiSelectRowList}
              />

              {servicios.length === 0 && (
                <Text style={styles.noRecordsText}>No se encontraron servicios</Text>
              )}
            </View>
            <View style={styles.contenedorFecha}>
              <Text style={styles.etiqueta}>Fecha de cita</Text>
              <TouchableOpacity onPress={mostrarSelectorDeFecha}>
                <Text style={styles.textoFecha}>{fecha.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {mostrar && (
                <DateTimePicker
                  value={fecha}
                  mode={modo}
                  is24Hour={true}
                  onChange={manejarConfirmacion}
                  style={styles.selectorDeFecha}
                  minimumDate={new Date()}
                />
              )}
            </View>
            <View style={styles.contenedorFecha}>
              <Text style={styles.etiqueta}>Hora de cita</Text>
              <TouchableOpacity onPress={mostrarSelectorDeHora}>
                <Text style={styles.textoFecha}>{formatearHora(hora)}</Text>
              </TouchableOpacity>
              {mostrarHora && (
                <DateTimePicker
                  value={hora}
                  mode="time"
                  is24Hour={false} // Establecer en falso para formato de 12 horas
                  onChange={manejarConfirmacionHora} // Usar manejarConfirmacionHora para confirmar la hora
                  style={styles.selectorDeFecha}
                />
              )}
            </View>
            <TouchableOpacity style={styles.boton} onPress={manejarAgendar}>
              <Text style={styles.textoBoton}>AGENDAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton2} onPress={irCitas}>
              <Text style={styles.textoBoton}>VER CITAS AGENDADAS</Text>
            </TouchableOpacity>
          </View>
        }
      />
      <AwesomeAlert
        show={alertVisible}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="gray"
        onConfirmPressed={() => {
          setAlertVisible(false);
          if (alertTitle === 'Éxito') {
          }
        }}
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
    backgroundColor: '#fff', // Asegura que el fondo sea blanco
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff', // Asegura que el fondo sea blanco
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerContainer: {
    padding: 16,
    backgroundColor: '#fff', // Asegura que el fondo sea blanco
  },
  contenedorPicker: {
    width: '100%',
    borderWidth: 0, // Elimina el borde
    borderColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff', // Asegura que el fondo sea blanco
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 0, // Elimina el borde
  },
  contenedorMultiSelect: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9', // Asegura que el fondo sea blanco
  },
  contenedorFecha: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f9f9f9', // Asegura que el fondo sea blanco
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textoFecha: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'underline',
  },
  selectorDeFecha: {
    width: '100%',
    backgroundColor: '#fff', // Asegura que el fondo sea blanco
  },
  boton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  boton2: {
    width: '100%',
    padding: 12,
    backgroundColor: '#FEAF00',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  multiSelectDropdown: {
    backgroundColor: '#f9f9f9', // Asegura que el fondo sea blanco
  },
  multiSelectDropdownSubsection: {
    backgroundColor: '#f9f9f9', // Asegura que el fondo sea blanco
  },
  multiSelectTextDropdown: {
    color: '#000', // Texto en negro
  },
  multiSelectListContainer: {
    backgroundColor: '#f9f9f9', // Asegura que el fondo sea blanco
  },
  noRecordsText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
  },
  alertTitle: {
    fontSize: 20,
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
  multiSelectDropdown: {
    backgroundColor: '#f9f9f9', // Fondo gris
  },
  multiSelectDropdownSubsection: {
    backgroundColor: '#f9f9f9', // Fondo gris
  },
  multiSelectTextDropdown: {
    color: '#000', // Texto en negro
  },
  multiSelectListContainer: {
    backgroundColor: '#f9f9f9', // Fondo gris
  },
  multiSelectRowList: {
    backgroundColor: '#f9f9f9', // Fondo gris en las filas
  },
});