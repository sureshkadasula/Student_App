import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import AuthService from '../services/AuthService';

const LoginScreen = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      try {
        const userData = await AuthService.login(email, password);
        Alert.alert('Login Successful', `Welcome, ${userData.user.name}!`);
        setIsLoggedIn(true);
      } catch (error) {
        Alert.alert('Login Failed', error.message || 'Invalid credentials.');
        console.log(error);
      }
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/app-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Student Portal Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 300,
    height: 160,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: '#FF751F',
  },
  inputContainer: {
    marginBottom: 15,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderColor: '#7b7676',
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  eyeText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#FF751F',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
