import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [reward, setReward] = useState<'Tree' | 'Pet' | 'Soldier' | null>(null);

  const handleContinue = async () => {
    if (!name || !reward) {
      Alert.alert('Please enter your name and choose a reward path.');
      return;
    }

    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('rewardType', reward);

    navigation.navigate('AppSelect');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.subtitle}>Choose your reward path:</Text>
      <View style={styles.buttons}>
        {['Tree', 'Pet', 'Soldier'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.rewardButton,
              reward === option && styles.selectedButton,
            ]}
            onPress={() => setReward(option as any)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.continue} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 26, color: 'orange', marginBottom: 16 },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#111',
    borderRadius: 8,
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 8 },
  buttons: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  rewardButton: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: 'orange',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  continue: {
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 10,
  },
  continueText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});