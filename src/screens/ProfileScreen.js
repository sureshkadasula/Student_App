import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password123');
  const [studentID, setStudentID] = useState('123456');
  const [avatarUri, setAvatarUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);

  const selectImage = type => {
    console.log('selectImage called for ' + type);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image');
      } else {
        const uri = response.assets[0].uri;
        if (type === 'cover') {
          setCoverUri(uri);
        } else if (type === 'avatar') {
          setAvatarUri(uri);
        }
        Alert.alert('Image Updated', `${type} image has been updated.`);
      }
    });
  };

  const saveProfile = () => {
    Alert.alert('Profile Saved', 'Your profile has been updated.');
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        {/* Header Section with Cover Background */}
        <View style={styles.headerContainer}>
          <Image
            source={
              coverUri
                ? { uri: coverUri }
                : require('../assets/images/app-logo.png')
            }
            style={styles.coverImage}
          />
          <TouchableOpacity
            style={styles.coverEditButton}
            onPress={() => selectImage('cover')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="pencil" size={25} color="#FF751F" />
          </TouchableOpacity>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={() => selectImage('avatar')}>
              <Image
                source={
                  avatarUri
                    ? { uri: avatarUri }
                    : require('../assets/images/app-logo.png')
                }
                style={styles.avatarImage}
              />
            </TouchableOpacity>
            <View style={styles.avatarEditIcon}>
              <TouchableOpacity onPress={() => selectImage('avatar')}>
                <Icon name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.cardContainer}>
          <View style={styles.fieldContainer}>
            <Icon
              name="user"
              size={20}
              color="#FF751F"
              style={styles.fieldIcon}
            />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.fieldInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Icon
              name="envelope"
              size={20}
              color="#FF751F"
              style={styles.fieldIcon}
            />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Icon
              name="lock"
              size={20}
              color="#FF751F"
              style={styles.fieldIcon}
            />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                style={styles.fieldInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Icon
              name="id-card"
              size={20}
              color="#FF751F"
              style={styles.fieldIcon}
            />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Student ID</Text>
              <TextInput
                style={styles.fieldInput}
                value={studentID}
                onChangeText={setStudentID}
                placeholder="Enter your student ID"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverEditButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 15,
    borderRadius: 30,
  },
  headerContainer: {
    height: 200,
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  avatarWrapper: {
    position: 'absolute',
    top: 130,
    alignSelf: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF751F',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF751F',
    padding: 6,
    borderRadius: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0c0b0b',
    position: 'absolute',
    bottom: -35,
    left: 0,
    right: 0,
    textAlign: 'center',
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
  userEmail: {
    fontSize: 16,
    color: '#0b0b0b',
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    textAlign: 'center',
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
  cardContainer: {
    marginTop: 60,
    marginLeft: 0,
    marginRight: 20,
    marginBottom: 20,
    padding: 20,
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'left',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  fieldIcon: {
    marginRight: 15,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  fieldInput: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: '#FF751F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  saveIcon: {
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
