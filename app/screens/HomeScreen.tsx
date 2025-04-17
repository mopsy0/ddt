import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RouteProps = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { appName, milestoneType } = route.params;

  const [name, setName] = useState('');
  const [reward, setReward] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await AsyncStorage.getItem('userName');
    const rewardType = await AsyncStorage.getItem('rewardType');
    const avoidCount = await AsyncStorage.getItem('avoidCount');
    setName(user || '');
    setReward(rewardType || '');
    setCount(Number(avoidCount) || 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hi {name},</Text>
      <Text style={styles.status}>You've avoided {appName} {count} times!</Text>
      <Text style={styles.path}>Reward Path: {reward}</Text>

      <TouchableOpacity
        style={styles.savingsBtn}
        onPress={() => navigation.navigate('LifeSavings')}
      >
        <Text style={styles.savingsText}>View Life Savings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  welcome: { fontSize: 26, color: 'orange', marginBottom: 12 },
  status: { fontSize: 18, color: 'white', marginBottom: 8 },
  path: { fontSize: 16, color: '#ccc', marginBottom: 20 },
  savingsBtn: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
  },
  savingsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});