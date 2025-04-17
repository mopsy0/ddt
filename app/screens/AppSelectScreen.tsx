import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppSelect'>;

interface BlockedApp {
  appName: string;
  message?: string;
}

const AppSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [appName, setAppName] = useState('');
  const [message, setMessage] = useState('');
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>([]);

  useEffect(() => {
    loadBlockedApps();
  }, []);

  const loadBlockedApps = async () => {
    const data = await AsyncStorage.getItem('blockedApps');
    if (data) setBlockedApps(JSON.parse(data));
  };

  const saveBlockedApps = async (apps: BlockedApp[]) => {
    await AsyncStorage.setItem('blockedApps', JSON.stringify(apps));
    setBlockedApps(apps);
  };

  const addBlockedApp = () => {
    if (!appName.trim()) return;
    const newList = [...blockedApps, { appName, message }];
    saveBlockedApps(newList);
    setAppName('');
    setMessage('');
  };

  const deleteApp = (appName: string) => {
    const updated = blockedApps.filter((app) => app.appName !== appName);
    saveBlockedApps(updated);
  };

  const goToHome = () => {
    navigation.navigate('Home', {
      appName: blockedApps[0]?.appName || 'App',
      milestoneType: 'Tree',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Block Apps</Text>
      <TextInput
        placeholder="App name (e.g., Instagram)"
        placeholderTextColor="#888"
        value={appName}
        onChangeText={setAppName}
        style={styles.input}
      />
      <TextInput
        placeholder="Custom message (optional)"
        placeholderTextColor="#888"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />
      <TouchableOpacity onPress={addBlockedApp} style={styles.addButton}>
        <Text style={styles.addText}>Add App</Text>
      </TouchableOpacity>

      <FlatList
        data={blockedApps}
        keyExtractor={(item) => item.appName}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.appName}>{item.appName}</Text>
              {item.message && <Text style={styles.message}>"{item.message}"</Text>}
            </View>
            <TouchableOpacity onPress={() => deleteApp(item.appName)}>
              <Text style={styles.delete}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ marginTop: 20 }}
      />

      <TouchableOpacity style={styles.startBtn} onPress={goToHome}>
        <Text style={styles.startText}>Done → Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppSelectScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { color: 'orange', fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#444',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addText: { color: 'white' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  appName: { color: '#fff', fontSize: 16 },
  message: { color: '#aaa', fontSize: 14 },
  delete: { color: 'red', fontSize: 20 },
  startBtn: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  startText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});