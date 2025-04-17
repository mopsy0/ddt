import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

type AppInputScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AppInput'
>;

const AppInputScreen = () => {
  const [appName, setAppName] = useState('');
  const navigation = useNavigation<AppInputScreenNavigationProp>();

  const handleNext = () => {
    if (appName.trim()) {
      navigation.navigate('AppSelect', { appName });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the name of the app you want to block:</Text>
      <TextInput
        style={styles.input}
        value={appName}
        onChangeText={setAppName}
        placeholder="Enter app name"
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff',
  },
});

export default AppInputScreen;