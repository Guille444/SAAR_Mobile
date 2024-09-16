import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

const UpdateCitaModal = ({ isVisible, onClose, onUpdate, initialDate, initialTime }) => {
    const [fecha, setFecha] = useState(initialDate ? new Date(initialDate) : new Date());
    const [hora, setHora] = useState(initialTime ? new Date(`1970-01-01T${initialTime}`) : new Date());
    const [errorFecha, setErrorFecha] = useState('');
    const [errorHora, setErrorHora] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        setFecha(initialDate ? new Date(initialDate) : new Date());
        setHora(initialTime ? new Date(`1970-01-01T${initialTime}`) : new Date());
    }, [initialDate, initialTime]);

    const handleUpdate = () => {
        const formattedDate = fecha.toISOString().split('T')[0];
        const hours = hora.getHours();
        const minutes = hora.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // Formato HH:mm

        if (!formattedDate || !formattedTime) {
            if (!formattedDate) setErrorFecha('Fecha es requerida.');
            if (!formattedTime) setErrorHora('Hora es requerida.');
            return;
        }

        setErrorFecha('');
        setErrorHora('');
        onUpdate(formattedDate, formattedTime);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios'); // Mantén el picker visible en iOS después de la selección
        if (event.type === 'set') {
            setFecha(selectedDate || fecha);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios'); // Mantén el picker visible en iOS después de la selección
        if (event.type === 'set') {
            setHora(selectedTime || hora);
        }
    };

    const formatHourTo12Hour = (date) => {
        if (!date) return '';
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'p.m.' : 'a.m.';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropColor="rgba(0, 0, 0, 0.5)"
            backdropOpacity={0.5}
            style={styles.modal}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Actualizar Cita</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Fecha (YYYY-MM-DD)"
                        value={fecha.toISOString().split('T')[0]}
                        editable={false}
                    />
                </TouchableOpacity>
                {errorFecha ? <Text style={styles.error}>{errorFecha}</Text> : null}

                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Hora (HH:MM)"
                        value={formatHourTo12Hour(hora)}
                        editable={false}
                    />
                </TouchableOpacity>
                {errorHora ? <Text style={styles.error}>{errorHora}</Text> : null}

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Actualizar</Text>
                    </TouchableOpacity>
                </View>
                {showDatePicker && (
                    <DateTimePicker
                        value={fecha}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={hora}
                        mode="time"
                        display="default"
                        onChange={onTimeChange}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        color: '#000',
        paddingHorizontal: 10,
        marginBottom: 15,
        textAlign: 'left',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonCancel: {
        backgroundColor: '#6c757d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default UpdateCitaModal;