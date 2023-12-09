import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';


const BlogPage = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsSnapshot = await firestore().collection('posts').get();
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async () => {
    const currentUser = auth().currentUser;
  
    if (currentUser) {
      if (newPostTitle && newPostDescription) {
        try {
          let imageUrl = null;
  
          // Check if an image is selected
          if (selectedImage) {
            // Upload the image to storage
            const imageRef = storage().ref(`images/${new Date().getTime()}`);
            await imageRef.putFile(selectedImage.uri);
            imageUrl = await imageRef.getDownloadURL();
          }
  
          const newPostRef = await firestore().collection('posts').add({
            title: newPostTitle,
            description: newPostDescription,
            imageUrl: imageUrl,
            authorId: currentUser.uid,
          });
  
          const newPostDoc = await newPostRef.get();
          const newPostData = { id: newPostRef.id, ...newPostDoc.data() };
          setPosts(prevPosts => [...prevPosts, newPostData]);
          setNewPostTitle('');
          setNewPostDescription('');
          setSelectedImage(null);
  
          Alert.alert('Success', 'Your post has been added successfully.');
        } catch (error) {
          console.error('Error adding post:', error.message);
        }
      } else {
        Alert.alert('Incomplete Information', 'Please provide both title and description.');
      }
    } else {
      // Show an alert if the user is not logged in
      Alert.alert(
        'Login Required',
        'You need to be logged in to add a blog.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
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
        setSelectedImage({ uri: imageUri });
      }
    });
  };
  
  

  const handleLogout = async () => {
    try {
      // Implement your logout logic here

      Alert.alert(
        'Logout',
        'You have successfully logged out.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Add Blog</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formHeading}>Create New Post</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={newPostTitle}
          onChangeText={text => setNewPostTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newPostDescription}
          onChangeText={text => setNewPostDescription(text)}
        />
        <TouchableOpacity
          style={styles.imagePickButton}
          onPress={openImagePicker}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.selectedImage}
          />
        )}
        <TouchableOpacity style={styles.createButton} onPress={addPost}>
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace',
  },
  logoutButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  formHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'monospace',
    color: '#000',
  },
  input: {
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#000',
    fontSize: 15,
  },
  createButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignContent: 'center',
    fontSize: 15,
    justifyContent: 'center',
  },
  imagePickButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default BlogPage;