import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { voiceTemplates } from '../../constants/messages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BlockPopup'>;
type RouteProps = RouteProp<RootStackParamList, 'BlockPopup'>;

const BlockPopupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { appName } = route.params;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [rewardType, setRewardType] = useState<'Tree' | 'Pet' | 'Soldier'>('Tree');

  useEffect(() => {
    generateMessage();
  }, []);

  const generateMessage = async () => {
    const name = await AsyncStorage.getItem('userName');
    const reward = await AsyncStorage.getItem('rewardType');
    const blockedAppsJSON = await AsyncStorage.getItem('blockedApps');
    const blockedApps = blockedAppsJSON ? JSON.parse(blockedAppsJSON) : [];

    const appEntry = blockedApps.find((a: any) => a.appName === appName);
    const fallback = voiceTemplates[reward as 'Tree' | 'Pet' | 'Soldier'] || [];
    const randomMessage = appEntry?.message || fallback[Math.floor(Math.random() * fallback.length)];

    setUserName(name || '');
    setRewardType((reward as any) || 'Tree');
    setMessage(randomMessage || 'Stay strong!');
    setLoading(false);
  };

  const handleExit = async () => {
    const prev = parseInt((await AsyncStorage.getItem('avoidCount')) || '0');
    const newCount = prev + 1;
    await AsyncStorage.setItem('avoidCount', newCount.toString());

    if ([2, 5, 10].includes(newCount)) {
      navigation.navigate('Milestone', { milestoneType: rewardType });
    } else {
      navigation.navigate('Home', { appName, milestoneType: rewardType });
    }
  };

  const handleContinue = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DON’T DO IT, {userName}!</Text>
      {loading ? (
        <ActivityIndicator color="orange" size="large" />
      ) : (
        <Text style={styles.message}>{message}</Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BlockPopupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { fontSize: 24, color: 'orange', marginBottom: 20, textAlign: 'center' },
  message: { fontSize: 18, color: '#fff', textAlign: 'center', marginBottom: 40 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  continueButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  },
  exitButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});