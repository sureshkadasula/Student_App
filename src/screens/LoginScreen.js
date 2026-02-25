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
import { EyeIcon, EyeOffIcon } from '../components/Icons';
import AuthService from '../services/AuthService';

const LoginScreen = ({ setIsLoggedIn }) => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (userid && password) {
      try {
        const userData = await AuthService.login(userid, password);
        Alert.alert('Login Successful', `Welcome, ${userData.user.name}!`);
        setIsLoggedIn(true);
      } catch (error) {
        Alert.alert('Login Failed', error.message || 'Invalid credentials.');
        console.log(error);
      }
    } else {
      Alert.alert('Error', 'Please enter both User ID and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/360-big.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Student Portal Login</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userid}
        onChangeText={setUserid}
        autoCapitalize="none"
        selectionColor="#FF751F"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          key={showPassword ? 'visible' : 'hidden'}
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />


        <TouchableOpacity
          style={styles.eyeIconButton}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          {showPassword ? (
            <EyeIcon size={22} color="#7b7676" />
          ) : (
            <EyeOffIcon size={22} color="#7b7676" />
          )}
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
    width: 280,
    height: 105,
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: '#FF751F',
  },
  input: {
    height: 50,
    borderColor: '#7b7676',
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
    marginTop: 15,
    marginBottom: 15,
  },
  passwordInput: {
    height: 50,
    borderColor: '#7b7676',
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingRight: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
    placeholderTextColor: '#999',
  },
  eyeIconButton: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 50,
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
