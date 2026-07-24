import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
//import RegisterScreen from '../screens/RegisterScreen';
import DashboardSelectionScreen from '../screens/DashboardSelectionScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        {/*<Stack.Screen name="Register" component={RegisterScreen} /> */}
        <Stack.Screen name="DashboardSelection" component={DashboardSelectionScreen} />
        <Stack.Screen name="EmployeeDashboard" component= {EmployeeDashboardScreen} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}