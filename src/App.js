/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';
import BottomNavigator from './navigation/BottomNavigator';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={
            useColorScheme() === 'dark' ? 'light-content' : 'dark-content'
          }
        />
        {isLoggedIn ? (
          <BottomNavigator />
        ) : (
          <LoginScreen setIsLoggedIn={setIsLoggedIn} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;
