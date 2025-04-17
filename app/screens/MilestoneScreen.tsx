import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Milestone'>;
type RouteProps = RouteProp<RootStackParamList, 'Milestone'>;

const emojiMap = {
  Tree: '🌳',
  Pet: '🐼',
  Soldier: '🪖',
};

const MilestoneScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { milestoneType } = route.params;

  const [fadeAnim] = useState(new Animated.Value(0));
  const emoji = emojiMap[milestoneType];

  useEffect(() => {
    saveReward();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const saveReward = async () => {
    const data = await AsyncStorage.getItem('savedRewards');
    const list = data ? JSON.parse(data) : [];
    list.push(milestoneType);
    await AsyncStorage.setItem('savedRewards', JSON.stringify(list));
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.emoji, { opacity: fadeAnim }]}>
        {emoji}
      </Animated.Text>
      <Text style={styles.congrats}>Milestone reached!</Text>
      <Text style={styles.reward}>You saved a {milestoneType}!</Text>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate('Home', { appName: 'Instagram', milestoneType })}
      >
        <Text style={styles.doneText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MilestoneScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 96, marginBottom: 20 },
  congrats: { color: 'orange', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  reward: { color: 'white', fontSize: 18, marginBottom: 30 },
  doneButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 10,
  },
  doneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});