import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';


const Field = ({ placeholder, keyboardType, onChangeText }) => {
  return (
    <View>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={{
          backgroundColor: '#fff', // Set background color to black
          color: '#000', // Set text color to white
          padding: 10,
          borderRadius: 35,
          marginBottom: 10,
          width:250
        }}
      />
    </View>
  );
};
// Placeholder for Btn component
const Btn = ({ textColor, bgColor, btnLabel, Press }) => {
  return (
    <TouchableOpacity
      style={{ 
      backgroundColor: bgColor, 
      borderRadius: 10, 
      padding: 10
      
       }}
      onPress={Press}>
      <Text style={{ color: textColor, textAlign: 'center' }}>{btnLabel}</Text>
    </TouchableOpacity>
  );
};

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ====================
  // Animated value for the animation
  const animatedValue = new Animated.Value(0);

  // Animation configuration
  const animationConfig = {
    toValue: 1,
    duration: 1000, // Adjust the duration as needed
    easing: Easing.linear,
    useNativeDriver: true,
  };

  useEffect(() => {
    // Start the continuous animation
    const animation = Animated.timing(animatedValue, animationConfig);

    // Set up a loop for the continuous animation
    const loopAnimation = () => {
      Animated.loop(animation).start();
    };

    // Call the loop function
    loopAnimation();

    // Clean up the animation on component unmount
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [animatedValue, animationConfig]);

  // Interpolate the animated value to create a style for the text
  const animatedTextStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1], // Adjust the output range as needed
        }),
      },
    ],
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'monospace',
    color: 'white',
  };
  // ==================

  const handleLogin = async () => {
    try {
      // Check if email or password is empty
      if (!email || !password) {
        Alert.alert('Error', 'Email and password are required.');
        return;
      }

      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );

      // Access the user information
      const user = userCredential.user;

      props.navigation.navigate('AllBlogs');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, alignItems: 'center', backgroundColor: '#d3d3d3' }}>

        <View
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            width: 460,
            paddingTop: 100,
            alignItems: 'center',
          }}>

          <Text
            style={{
              fontSize: 45,
              color: '#fff', // Set text color to white
              fontWeight: 'bold',
              fontFamily:'monospace',
            }}>
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 19,
              color: 'grey',
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            Login to your account
          </Text>
          <Field
            placeholder="Email"
            keyboardType={'email-address'}
            onChangeText={(text) => setEmail(text)}
            style={{
              color: 'white', // Set placeholder color to white
              backgroundColor: '#fff', // Set background color to black
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />
          <Field
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            style={{
              color: 'white', // Set placeholder color to white
              backgroundColor: '#fff', // Set background color to black
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              alignItems: 'flex-end',
              width: '70%',
              paddingRight: 16,
              marginBottom: 40,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#fff', // Set text color to white
                fontWeight: 'bold',
              }}>
              Forgot Password ?
            </Text>
          </View>
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']} // Change gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 100,
              overflow: 'hidden',
              height: 40,
              width: 150,
              justifyContent: 'center', // Center the button
            }}>
            <Btn
              textColor="white"
              bgColor="transparent"
              btnLabel="LOGIN"
              Press={handleLogin}
            />
          </LinearGradient>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#fff' }}>
              Don't have an account ?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signup')}>
              <Animated.Text style={animatedTextStyle} > Signup</Animated.Text>
            </TouchableOpacity>

          </View>

        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
export default Login;
