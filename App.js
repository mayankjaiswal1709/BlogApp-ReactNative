import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import AllBlogs from './src/Home';
import AddBlog from './src/AddBlog';
import MyBlogs from './src/MyBlogs';
import Login from './src/Login';
import Signup from './src/Signup';
import MyProfile from './src/MyProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{headerShown: false}}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
        }}>
        <Tab.Screen
          name="AllBlogs"
          component={AllBlogs}
          options={{
            tabBarLabel: 'All Blogs',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AddBlog"
          component={AddBlog}
          options={{
            tabBarLabel: 'Add Blog',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="MyBlogs"
          component={MyBlogs}
          options={{
            tabBarLabel: 'My Blogs',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="MyProfile"
          component={MyProfile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, size}) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Auth"
          component={AuthStack}
          options={{tabBarLabel: 'Auth', tabBarVisible: false}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
