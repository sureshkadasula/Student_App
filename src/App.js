/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoginScreen from './screens/LoginScreen';
import DrawerNavigator from './navigation/DrawerNavigator';
import AuthService from './services/AuthService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    console.log('🚀 [App.js] Checking login status...');
    try {
      const session = await AuthService.getSession();
      console.log('📂 [App.js] Session:', session ? 'Found' : 'Not found');

      if (session && session.token) {
        console.log('🔑 [App.js] Token found, verifying...');

        try {
          // Verify token in background
          const verifiedData = await AuthService.verifyToken(session.token);
          console.log('✅ [App.js] Token verification result:', verifiedData ? 'Success' : 'Failed');

          if (!verifiedData) {
            console.log('⚠️ [App.js] Verification failed (Invalid Token), logging out...');
            setIsLoggedIn(false);
            await AuthService.logout();
          } else {
            setIsLoggedIn(true);
          }
        } catch (verifyError) {
          console.log('⚠️ [App.js] Verification network error, staying logged in (Offline Mode).', verifyError);
          // Assume logged in if network error (Offline mode)
          setIsLoggedIn(true);
        }

      } else {
        console.log('ℹ️ [App.js] No session/token, staying logged out');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('❌ [App.js] Auth check critical error', error);
      setIsLoggedIn(false);
    } finally {
      console.log('🏁 [App.js] Loading complete, rendering app');
      setIsLoading(false);
    }
  };

  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#FF751F" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar
            barStyle={
              colorScheme === 'dark' ? 'light-content' : 'dark-content'
            }
          />
          {isLoggedIn ? (
            <DrawerNavigator setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <LoginScreen setIsLoggedIn={setIsLoggedIn} />
          )}
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
export default App;
