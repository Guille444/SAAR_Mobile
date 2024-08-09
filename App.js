import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa tus componentes de pantalla aquí
import Sesion from './src/screens/Sesion.js';
import RecuperarClave from './src/screens/RecuperarClave.js';
import NuevaClave from './src/screens/NuevaClave.js';
import Registro from './src/screens/Registro.js';
import Contrasenia from './src/screens/Contrasenia.js';
import TabNavigator from './src/tabNavigator/TabNavigator.js';
import SplashScreen from './src/screens/SplashScreen.js';
import VerificarCodigo from './src/screens/VerificarCodigo.js';
import VehiculosRegistrados from './src/screens/VehiculosRegistrados.js';
import CitasRegistradas from './src/screens/CitasRegistradas.js';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function inicia() {
      try {
        // Simula una carga inicial
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 segundos
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    inicia();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        {appIsReady ? (
          <>
            <Stack.Screen name="Sesion" component={Sesion} />
            <Stack.Screen name="RecuperarClave" component={RecuperarClave} />
            <Stack.Screen name="NuevaClave" component={NuevaClave} />
            <Stack.Screen name="Registro" component={Registro} />
            <Stack.Screen name="Contrasenia" component={Contrasenia} />
            <Stack.Screen name="VerificarCodigo" component={VerificarCodigo} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="VehiculosRegistrados" component={VehiculosRegistrados} />
            <Stack.Screen name="CitasRegistradas" component={CitasRegistradas} />

          </>
        ) : (
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}