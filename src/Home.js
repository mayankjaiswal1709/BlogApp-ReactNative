import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const fetchBlogs = async () => {
    try {
      const blogsSnapshot = await firestore().collection('posts').get();

      const fetchedBlogs = blogsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogPosts(fetchedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error.message);
    }
  };

  useEffect(() => {
    // Fetch blogs when the component mounts
    fetchBlogs();

    // Set up interval to refresh every 3 seconds
    const intervalId = setInterval(() => {
      setRefreshing(true);
      fetchBlogs();
      setRefreshing(false);
    }, 10000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Refetch blogs when the user logs in
    if (userLoggedIn) {
      fetchBlogs();
    }
  }, [userLoggedIn]);

  const _renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>BLOGS</Text>
      </View>

      {/* Blog Posts */}
      <FlatList
        data={blogPosts}
        keyExtractor={(item) => item.id}
        renderItem={_renderItem}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchBlogs();
          setRefreshing(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4285f4', // Google Blue
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  postContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default Home;
