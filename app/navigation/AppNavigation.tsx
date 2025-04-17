import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import BlockPopupScreen from '../screens/BlockPopupScreen';
import MilestoneScreen from '../screens/MilestoneScreen';
import AppSelectScreen from '../screens/AppSelectScreen';
import LifeSavingsScreen from '../screens/LifeSavingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BlockPopup" component={BlockPopupScreen} />
        <Stack.Screen name="Milestone" component={MilestoneScreen} />
        <Stack.Screen name="AppSelect" component={AppSelectScreen} />
        <Stack.Screen name="LifeSavings" component={LifeSavingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}