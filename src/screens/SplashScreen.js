import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    height: '50%',
  },
});