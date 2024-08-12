import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';

export default function SplashScreen2() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000, // Duración del giro completo
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/llanta-carga.png')} // Reemplaza con tu imagen
        style={[styles.image, { transform: [{ rotate: spin }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '30%',
    height: '30%',
  },
});
