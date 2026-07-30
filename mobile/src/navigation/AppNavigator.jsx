import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
//import RegisterScreen from '../screens/RegisterScreen';
import DashboardSelectionScreen from '../screens/DashboardSelectionScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import HRPanelScreen from '../screens/HRPanelScreen';
import HREmployeeDetailScreen from '../screens/HREmployeeDetailScreen';
import HRAnalyticsScreen from '../screens/HRAnalyticsScreen';
import InfirmaryPanelScreen from '../screens/InfirmaryPanelScreen';
import InfirmaryAnalyticsScreen from '../screens/InfirmaryAnalyticsScreen'
import InfirmaryEmployeeDetailScreen from '../screens/InfirmaryEmployeeDetail';
import QCPanelScreen from '../screens/QCPanelScreen'
import QCAnalyticsScreen from '../screens/QCAnalyticsScreen';
import QCEmployeeDetailScreen from '../screens/QCEmployeeDetailScreen';

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
        <Stack.Screen name="HRPanel" component={HRPanelScreen} />
        <Stack.Screen name="HREmployeeDetail" component={HREmployeeDetailScreen} />
        <Stack.Screen name="HRAnalytics" component={HRAnalyticsScreen} />
        <Stack.Screen name="InfirmaryPanel" component={InfirmaryPanelScreen} />
        <Stack.Screen name="InfirmaryAnalytics" component={InfirmaryAnalyticsScreen} /> 
        <Stack.Screen name="InfirmaryEmployeeDetail" component={InfirmaryEmployeeDetailScreen} />
        <Stack.Screen name="QCPanel" component={QCPanelScreen} />
        <Stack.Screen name="QCEmployeeDetail" component={QCEmployeeDetailScreen} />
        <Stack.Screen name="QCAnalytics" component={QCAnalyticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}