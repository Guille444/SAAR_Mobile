import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import * as Constantes from '../../utils/constantes';
import { useFocusEffect } from '@react-navigation/native';

/* 
Algunos estandares de programación en javascript
1. Los archivos javascript deben estar escrito en el formato de codificacion UTF-8
2. Para importar otros ES modules, se debe usar "import"
3. No importar un mismo archivo mas de una vez, mejor importar los elementos con el mismo archivo
*/


export default function Inicio({ navigation, route }) {
    const [alias, setAlias] = useState(null);
    const ip = Constantes.IP;

    // Función para obtener el alias del usuario
    const getAlias = async () => {
        try {
            const response = await fetch(`${ip}/services/public/cliente.php?action=getUser`, {
                method: 'GET'
            });
            const data = await response.json();
            if (data.status) {
                setAlias(data.username); // Usar `username` si es lo que devuelves del backend
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al obtener el alias');
            console.error('Error al obtener el alias:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getAlias(); // Obtener el alias cuando la pantalla se enfoque
        }, [])
    );

    useEffect(() => {
        // Si el parámetro `aliasUpdated` está presente, actualizar el alias
        if (route.params?.aliasUpdated) {
            getAlias();
        }
    }, [route.params?.aliasUpdated]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Inicio</Text>
                </View>
            ),
            headerTitleAlign: 'center',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../img/llanta.png')} style={styles.image} />
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.aliasText}>
                {alias ? alias : 'No hay alias para mostrar'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Puedes ajustar el color de fondo según tu diseño
    },
    headerTitleContainer: {
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    aliasText: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 10,
        fontWeight: 'condensed',
        color: '#000', // Color del texto para el alias
    },
});