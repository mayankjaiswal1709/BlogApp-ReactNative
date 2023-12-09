import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MyProfile = () => {
  const navigation = useNavigation();

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    profilePic: { uri: '', borderColor: '#000', borderWidth: 2 },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUserDetails({
          name: user.displayName || '',
          email: user.email || '',
          profilePic: { uri: user.photoURL || '', borderColor: '#000', borderWidth: 2 },
        });
      } else {
        // If user is not logged in, navigate to login screen
        navigation.navigate('Auth', { screen: 'Login' });
      }
      
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [navigation]);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Auth', { screen: 'Login' });
      })
      .catch(error => {
        console.error('Error logging out:', error.message);
      });
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setUserDetails({ ...userDetails, profilePic: { uri: imageUri } });
      }
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        // Update the user's display name and email in Firebase Authentication
        await currentUser.updateProfile({
          displayName: userDetails.name,
        });

        await currentUser.updateEmail(userDetails.email);

        // Save user details including profile picture URI to Firebase Cloud Firestore
        await firestore().collection('users').doc(currentUser.uid).set({
          name: userDetails.name,
          email: userDetails.email,
          profilePic: userDetails.profilePic.uri, // Save the profile picture URI
          // Add other user details as needed
        });

        Alert.alert(
          'Profile Updated',
          'Your profile has been successfully updated!',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    // You can render a loading indicator here if needed
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => {
          navigation.openDrawer();
        }}>
        <Ionicons name="menu-outline" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>My Profile</Text>
      {userDetails.profilePic.uri ? (
        <Image
          source={{ uri: userDetails.profilePic.uri }}
          style={[
            styles.profilePic,
            {
              borderColor: userDetails.profilePic.borderColor,
              borderWidth: userDetails.profilePic.borderWidth,
            },
          ]}
        />
      ) : (
        <View style={styles.profilePicPlaceholder}>
          <Ionicons name="person-circle-outline" size={150} color="#000" />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={openImagePicker}>
        <Text style={styles.buttonText}>UPLOAD PICTURE</Text>
      </TouchableOpacity>

      {/* Editable Fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userDetails.name}
        onChangeText={text => setUserDetails({ ...userDetails, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userDetails.email}
        onChangeText={text => setUserDetails({ ...userDetails, email: text })}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>UPDATE PROFILE</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  menuIcon: {
    marginLeft: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'monospace',
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginVertical: 16,
    borderColor: '#000',
    borderWidth: 2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 58,
    marginBottom: 16,
    paddingLeft: 28,
  },
  profilePicPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    borderColor: '#000',
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    borderRadius: 58,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#191970',
    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton:{
    borderRadius: 58,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#191970',
    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default MyProfile;
