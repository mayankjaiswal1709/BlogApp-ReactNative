import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MyBlogs = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const currentUser = auth().currentUser;
  
        if (currentUser) {
          console.log('Current User ID:', currentUser.uid);
  
          if (userId !== currentUser.uid) {
            console.log('User ID Changed, Fetching User Blogs...');
            setUserBlogs([]);
            setUserId(currentUser.uid);
          }
  
          const blogsSnapshot = await firestore()
            .collection('posts')
            .where('authorId', '==', currentUser.uid)
            .get();
  
          const blogsData = blogsSnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title || '',
            description: doc.data().description || '',
            ...doc.data(),
          }));
  
          setUserBlogs(blogsData);
  
          // Set userLoggedIn to true since the user is logged in
          setUserLoggedIn(true);
        } else {
          console.error('Current user not available');
          // Set userLoggedIn to false since the user is not logged in
          setUserLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user blogs:', error.message);
      }
    };
  
    fetchUserBlogs();
  
    // Set up an interval to fetch blogs every 3 seconds
    const intervalId = setInterval(() => {
      fetchUserBlogs();
    }, 10000);
  
    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [userId, auth().currentUser]); // Added auth().currentUser as a dependency

  useEffect(() => {
    console.log('User Blogs:', userBlogs); // Log user blogs
  }, [userBlogs]);

  const deletePost = async (postId) => {
    try {
      // Delete the post with the given postId
      await firestore().collection('posts').doc(postId).delete();
      // After deleting, update the userBlogs state to reflect the changes
      setUserBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {userLoggedIn ? (
        <>
          <Text style={styles.title}>My Blogs</Text>
          <FlatList
            data={userBlogs}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postDescription}>{item.description}</Text>
                <Text style={styles.postContent}>{item.content}</Text>
                {item.imageUrl && (
                  <Image source={{ uri: item?.imageUrl }} style={styles.postImage} />
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deletePost(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.notLoggedInText}>You are not logged in. Please log in.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'monospace',
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  notLoggedInText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'monospace',
    color: 'red',
  },
});

export default MyBlogs;
