// AppEntry.tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigation from './app/navigation/AppNavigation';

const AppEntry = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <AppNavigation />
    </SafeAreaView>
  );
};

export default AppEntry;