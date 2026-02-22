import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';



const { width } = Dimensions.get('window');

const ProfileScreen = ({ setIsLoggedIn, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('********');
  const [studentID, setStudentID] = useState('');
  const [zipCode, setZipCode] = useState('08817'); // Added to match image
  const [avatarUri, setAvatarUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const session = await AuthService.getSession();
      const storedProfile = await AsyncStorage.getItem('student_profile');

      let profileData = null;
      if (storedProfile) {
        profileData = JSON.parse(storedProfile);
        console.log('Using stored profile data:', profileData);
      }

      if (session && session.user) {
        // Prefer profile data if available, otherwise fallback to session user data
        setName(profileData?.name || session.user.name);
        setEmail(profileData?.email || session.user.email);
        setStudentID(profileData?.student_userid || profileData?.student_id || session.user.userid);

        // New fields from profileData
        setClassName(profileData?.class_name || '');
        setDob(profileData?.date_of_birth || '');
        setAddress(profileData?.student_address || profileData?.address || '');
        setPhone(profileData?.student_phone || profileData?.phone || '');
      }
    } catch (error) {
      console.log('Error loading user profile:', error);
    }
  };

  // const handleLogout = async () => {
  //   Alert.alert('Logout', 'Are you sure?', [
  //     { text: 'Cancel', style: 'cancel' },
  //     { text: 'Logout', onPress: async () => setIsLoggedIn && setIsLoggedIn(false) },
  //   ]);
  // };

  const handleLogout = async () => {
  Alert.alert('Logout', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      onPress: async () => {
        try {
          await AsyncStorage.clear();   // 🔥 clears all stored data
          setIsLoggedIn(false);         // update auth state
        } catch (error) {
          console.log('Error clearing storage:', error);
        }
      },
    },
  ]);
};

  const selectImage = (type) => {
    const options = { mediaType: 'photo', includeBase64: false };
    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorMessage && response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (type === 'avatar') {
          setAvatarUri(uri);
          setCoverUri(uri);
        } else {
          setCoverUri(uri);
        }
      }
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.coverWrapper} pointerEvents="box-none">
          <Image
            source={avatarUri ? { uri: avatarUri } : require('../assets/images/app-logo.png')}
            style={styles.coverImage}
            blurRadius={2}
          />
          <View style={styles.overlay} pointerEvents="none" />

          {/* Top Toolbar - Must be AFTER overlay to be on top */}
          <View style={styles.topToolbar}>
            <Text style={styles.headerTitle}>PROFILE</Text>
          </View>
        </View>

        {/* PROFILE IMAGE OVERLAP */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={() => selectImage('avatar')} style={styles.avatarBorder}>
              <Image
                source={avatarUri ? { uri: avatarUri } : require('../assets/images/app-logo.png')}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarCamera} onPress={() => selectImage('avatar')}>
              <Icon name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.displayName}>{name || 'AVLIN THOMUS'}</Text>
        <Text style={styles.displayLocation}>NEW YORK</Text>
      </View>

      {/* FORM SECTION */}
      <View style={styles.formContainer}>
        <ProfileField label="Name" value={name} editable={false} />
        <ProfileField label="Email" value={email} editable={false} keyboardType="email-address" />
        <ProfileField label="Phone" value={phone} editable={false} keyboardType="phone-pad" />
        <ProfileField label="Class" value={className} editable={false} />
        <ProfileField label="Date of Birth" value={dob} editable={false} />
        <ProfileField label="Address" value={address} editable={false} multiline />
        <ProfileField label="Student ID" value={studentID} editable={false} />
        {/* <ProfileField label="Password" value={password} onChangeText={setPassword} secureTextEntry={true} /> */}
        {/* <ProfileField label="Zip Code" value={zipCode} onChangeText={setZipCode} /> */}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Reusable Field Component to keep code clean
const ProfileField = ({ label, value, onChangeText, ...props }) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#ccc"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { alignItems: 'center', marginBottom: 20 },
  coverWrapper: { width: '100%', height: 220, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(126, 87, 194, 0.5)' },

  topToolbar: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarContainer: { marginTop: -50, alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatarBorder: { padding: 4, backgroundColor: '#fff', borderRadius: 60, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarCamera: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7E57C2',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },

  displayName: { marginTop: 15, fontSize: 22, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  displayLocation: { fontSize: 13, color: '#999', letterSpacing: 1, marginTop: 4 },

  formContainer: { paddingHorizontal: 25, marginTop: 10 },
  fieldWrapper: { borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 12, marginBottom: 10 },
  fieldLabel: { color: '#7E57C2', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  input: { color: '#333', fontSize: 16, fontWeight: '600', padding: 0 },

  logoutButton: { backgroundColor: '#7E57C2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 40 },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});

export default ProfileScreen;